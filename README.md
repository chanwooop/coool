# AI 영상 자동 제작 파이프라인 (Python)

`narrations.txt`(대본) + `image_prompts.txt`(이미지 프롬프트)를 1:1로 받아,
OpenAI 이미지/TTS API를 호출하고 MoviePy로 자막까지 합성해 최종 MP4를 생성합니다.

## 1) 설치

```bash
pip install -r requirements.txt
```

> 추가 의존성: ffmpeg가 시스템에 설치되어 있어야 합니다.

## 2) 폴더/파일 구조

```text
coool/
├─ auto_video_pipeline.py
├─ requirements.txt
├─ .env                  # OPENAI_API_KEY 설정
├─ narrations.txt        # 컷별 내레이션(한 줄당 1컷)
├─ image_prompts.txt     # 컷별 이미지 프롬프트(한 줄당 1컷)
├─ images/               # 생성 이미지(.png)
├─ audio/                # 생성 음성(.mp3)
└─ output/               # 최종 영상(.mp4)
```

`.env` 예시:

```dotenv
OPENAI_API_KEY=sk-...
```

## 3) 실행

```bash
python auto_video_pipeline.py
```

기본 출력은 `output/final_output.mp4`입니다.

### 자주 쓰는 옵션

```bash
python auto_video_pipeline.py \
  --narrations narrations.txt \
  --image-prompts image_prompts.txt \
  --image-model gpt-image-1 \
  --tts-model gpt-4o-mini-tts \
  --tts-voice alloy \
  --width 1080 --height 1920 \
  --zoom-strength 0.04
```

## 4) 동작 파이프라인

1. `image_prompts.txt` 각 줄로 이미지 생성 후 `images/cut_XXX.png` 저장
2. `narrations.txt` 각 줄로 TTS 생성 후 `audio/cut_XXX.mp3` 저장
3. 오디오 길이에 맞춰 정지 이미지를 비디오 클립으로 생성(미세 줌인 효과 포함)
4. 동일 내레이션 문장을 자막으로 영상 하단에 오버레이(검은 윤곽선 + 반투명 배경)
5. 모든 컷 클립을 순서대로 연결하여 최종 MP4 렌더링

## 5) 입력 파일 작성 규칙

- `narrations.txt`와 `image_prompts.txt`의 **줄 개수는 반드시 동일**해야 합니다.
- 빈 줄은 자동으로 무시됩니다.
- 인덱스 순서(Cut 1, Cut 2, ...)가 정확히 대응되어야 합니다.

