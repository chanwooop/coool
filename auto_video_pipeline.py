#!/usr/bin/env python3
"""
YouTube Shorts/Mid-form 자동 영상 제작 파이프라인.

입력:
- narrations.txt      : 컷별 내레이션 텍스트(한 줄당 1컷)
- image_prompts.txt   : 컷별 이미지 프롬프트(한 줄당 1컷)

출력:
- images/cut_XXX.png
- audio/cut_XXX.mp3
- output/final_output.mp4

필수 환경변수 (.env):
- OPENAI_API_KEY=...
"""

from __future__ import annotations

import argparse
import base64
import os
from pathlib import Path
from typing import List, Tuple

from dotenv import load_dotenv
from openai import OpenAI
from moviepy.editor import (
    AudioFileClip,
    ColorClip,
    CompositeVideoClip,
    ImageClip,
    TextClip,
    concatenate_videoclips,
)


def read_non_empty_lines(path: Path) -> List[str]:
    """텍스트 파일에서 공백 줄을 제외한 라인 목록을 반환."""
    if not path.exists():
        raise FileNotFoundError(f"입력 파일이 없습니다: {path}")

    lines = [line.strip() for line in path.read_text(encoding="utf-8").splitlines()]
    return [line for line in lines if line]


def validate_inputs(narrations: List[str], prompts: List[str]) -> None:
    """내레이션/이미지 프롬프트 길이 일치 검증."""
    if not narrations:
        raise ValueError("narrations.txt가 비어 있습니다.")
    if not prompts:
        raise ValueError("image_prompts.txt가 비어 있습니다.")
    if len(narrations) != len(prompts):
        raise ValueError(
            "컷 개수가 일치하지 않습니다. "
            f"narrations={len(narrations)}, image_prompts={len(prompts)}"
        )


def ensure_dirs(*dirs: Path) -> None:
    """필요한 출력 디렉토리를 생성."""
    for directory in dirs:
        directory.mkdir(parents=True, exist_ok=True)


def generate_image_with_openai(
    client: OpenAI,
    prompt: str,
    image_path: Path,
    image_model: str,
    image_size: str,
) -> None:
    """OpenAI 이미지 API를 호출해 이미지를 생성/저장."""
    # 참고:
    # - gpt-image-1: b64_json 반환
    # - dall-e-3: url 반환
    response = client.images.generate(
        model=image_model,
        prompt=prompt,
        size=image_size,
    )

    item = response.data[0]
    if getattr(item, "b64_json", None):
        image_bytes = base64.b64decode(item.b64_json)
        image_path.write_bytes(image_bytes)
        return

    image_url = getattr(item, "url", None)
    if not image_url:
        raise RuntimeError("이미지 응답에서 b64_json/url을 찾을 수 없습니다.")

    # URL만 반환하는 모델(dall-e-3) 대응
    import requests

    response_http = requests.get(image_url, timeout=60)
    response_http.raise_for_status()
    image_path.write_bytes(response_http.content)


def generate_tts_with_openai(
    client: OpenAI,
    text: str,
    audio_path: Path,
    tts_model: str,
    tts_voice: str,
) -> None:
    """OpenAI TTS로 mp3 생성/저장."""
    speech = client.audio.speech.create(
        model=tts_model,
        voice=tts_voice,
        input=text,
        format="mp3",
    )
    speech.stream_to_file(str(audio_path))


def build_animated_image_clip(
    image_path: Path,
    duration: float,
    video_size: Tuple[int, int],
    zoom_strength: float,
) -> ImageClip:
    """오디오 길이에 맞는 정지 이미지 + 미세 줌인(Ken Burns 유사) 클립 생성."""
    target_w, target_h = video_size

    clip = ImageClip(str(image_path)).set_duration(duration)

    # 화면을 꽉 채우도록 스케일
    scale = max(target_w / clip.w, target_h / clip.h)
    clip = clip.resize(scale)

    # 중앙 크롭으로 목표 해상도 맞춤
    clip = clip.crop(
        x_center=clip.w / 2,
        y_center=clip.h / 2,
        width=target_w,
        height=target_h,
    )

    # 시간이 지날수록 아주 미세한 줌인
    if zoom_strength > 0:
        clip = clip.resize(lambda t: 1 + zoom_strength * (t / max(duration, 0.001)))
        clip = clip.crop(
            x_center=clip.w / 2,
            y_center=clip.h / 2,
            width=target_w,
            height=target_h,
        )

    return clip


def build_subtitle_clip(
    text: str,
    duration: float,
    video_size: Tuple[int, int],
    subtitle_font: str | None,
) -> CompositeVideoClip:
    """자막(윤곽선 + 반투명 배경 박스) 클립 생성."""
    w, h = video_size
    subtitle_width = int(w * 0.9)
    font_size = max(36, int(h * 0.042))
    y_pos = int(h * 0.78)

    txt = TextClip(
        text,
        fontsize=font_size,
        color="white",
        font=subtitle_font,
        method="caption",
        size=(subtitle_width, None),
        align="center",
        stroke_color="black",
        stroke_width=2,
    ).set_duration(duration)

    # 자막 배경 박스(반투명)
    bg_padding_x = 24
    bg_padding_y = 14
    bg = (
        ColorClip(
            size=(txt.w + bg_padding_x * 2, txt.h + bg_padding_y * 2),
            color=(0, 0, 0),
        )
        .set_opacity(0.45)
        .set_duration(duration)
    )

    sub_group = CompositeVideoClip(
        [
            bg.set_position(("center", y_pos - bg_padding_y)),
            txt.set_position(("center", y_pos)),
        ],
        size=video_size,
    ).set_duration(duration)

    return sub_group


def create_cut_clip(
    image_path: Path,
    audio_path: Path,
    narration_text: str,
    video_size: Tuple[int, int],
    zoom_strength: float,
    subtitle_font: str | None,
) -> CompositeVideoClip:
    """이미지 + 오디오 + 자막을 결합한 단일 컷 클립 생성."""
    audio = AudioFileClip(str(audio_path))
    duration = audio.duration

    base = build_animated_image_clip(
        image_path=image_path,
        duration=duration,
        video_size=video_size,
        zoom_strength=zoom_strength,
    )
    subtitle = build_subtitle_clip(
        text=narration_text,
        duration=duration,
        video_size=video_size,
        subtitle_font=subtitle_font,
    )

    final = CompositeVideoClip([base, subtitle], size=video_size).set_duration(duration)
    final = final.set_audio(audio)
    return final


def run_pipeline(args: argparse.Namespace) -> Path:
    """전체 파이프라인 실행."""
    load_dotenv(args.env_file)
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise EnvironmentError("OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.")

    client = OpenAI(api_key=api_key)

    narrations = read_non_empty_lines(Path(args.narrations))
    prompts = read_non_empty_lines(Path(args.image_prompts))
    validate_inputs(narrations, prompts)

    images_dir = Path(args.images_dir)
    audio_dir = Path(args.audio_dir)
    output_dir = Path(args.output_dir)
    ensure_dirs(images_dir, audio_dir, output_dir)

    cut_clips = []

    for idx, (narration, prompt) in enumerate(zip(narrations, prompts), start=1):
        cut_id = f"cut_{idx:03d}"
        image_path = images_dir / f"{cut_id}.png"
        audio_path = audio_dir / f"{cut_id}.mp3"

        print(f"[{cut_id}] 이미지 생성 중...")
        generate_image_with_openai(
            client=client,
            prompt=prompt,
            image_path=image_path,
            image_model=args.image_model,
            image_size=args.image_size,
        )

        print(f"[{cut_id}] TTS 생성 중...")
        generate_tts_with_openai(
            client=client,
            text=narration,
            audio_path=audio_path,
            tts_model=args.tts_model,
            tts_voice=args.tts_voice,
        )

        print(f"[{cut_id}] 영상 클립 구성 중...")
        cut_clip = create_cut_clip(
            image_path=image_path,
            audio_path=audio_path,
            narration_text=narration,
            video_size=(args.width, args.height),
            zoom_strength=args.zoom_strength,
            subtitle_font=args.subtitle_font,
        )
        cut_clips.append(cut_clip)

    print("모든 컷 연결 및 최종 렌더링 중...")
    final_video = concatenate_videoclips(cut_clips, method="compose")

    output_path = output_dir / args.output_name
    final_video.write_videofile(
        str(output_path),
        fps=args.fps,
        codec="libx264",
        audio_codec="aac",
        threads=args.threads,
    )

    # 리소스 정리
    final_video.close()
    for clip in cut_clips:
        clip.close()

    return output_path


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="텍스트 -> 이미지/TTS -> 자동 영상 생성 파이프라인")

    # 입/출력
    parser.add_argument("--narrations", default="narrations.txt", help="컷별 내레이션 텍스트 파일")
    parser.add_argument("--image-prompts", default="image_prompts.txt", help="컷별 이미지 프롬프트 파일")
    parser.add_argument("--images-dir", default="images", help="생성 이미지 저장 폴더")
    parser.add_argument("--audio-dir", default="audio", help="생성 오디오 저장 폴더")
    parser.add_argument("--output-dir", default="output", help="최종 영상 저장 폴더")
    parser.add_argument("--output-name", default="final_output.mp4", help="최종 출력 파일명")
    parser.add_argument("--env-file", default=".env", help="환경변수 파일 경로")

    # OpenAI 모델 옵션
    parser.add_argument("--image-model", default="gpt-image-1", help="이미지 생성 모델 (예: gpt-image-1, dall-e-3)")
    parser.add_argument("--image-size", default="1024x1024", help="이미지 생성 해상도")
    parser.add_argument("--tts-model", default="gpt-4o-mini-tts", help="TTS 모델")
    parser.add_argument("--tts-voice", default="alloy", help="TTS 음성")

    # 영상 옵션
    parser.add_argument("--width", type=int, default=1080, help="출력 영상 너비")
    parser.add_argument("--height", type=int, default=1920, help="출력 영상 높이")
    parser.add_argument("--fps", type=int, default=30, help="출력 FPS")
    parser.add_argument("--threads", type=int, default=4, help="인코딩 스레드 수")
    parser.add_argument(
        "--zoom-strength",
        type=float,
        default=0.04,
        help="미세 줌인 강도 (0이면 비활성화, 권장 0.02~0.06)",
    )
    parser.add_argument(
        "--subtitle-font",
        default=None,
        help="자막 폰트 이름(미설정 시 moviepy 기본 폰트)",
    )

    return parser


def main() -> None:
    parser = build_arg_parser()
    args = parser.parse_args()

    output_path = run_pipeline(args)
    print(f"완료: {output_path}")


if __name__ == "__main__":
    main()
