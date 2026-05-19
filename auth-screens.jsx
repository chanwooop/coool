// auth-screens.jsx — login/signup onboarding flow
// Sits between ElderOnboarding (role pick) and the main app.
// Designed in the same Wanted-blue language as the elderly app —
// big buttons, large type, simple step-by-step screens.

// ─────────────────────────────────────────────────────────────
// Shared chrome — step indicator + back arrow
// ─────────────────────────────────────────────────────────────
function AuthStep({ step, total=5, onBack=true, children }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', fontFamily: T.font, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* top: back + progress */}
      <div style={{ padding: '54px 20px 12px', display: 'flex', alignItems: 'center', gap: 14 }}>
        {onBack && (
          <button style={{
            width: 36, height: 36, borderRadius: 18, background: T.bg,
            border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.ink,
          }}><Icon.arrowLeft width="18" height="18"/></button>
        )}
        <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
          {Array.from({length: total}).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i < step ? T.blue : T.line,
              transition: 'background .2s',
            }}/>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

// Big primary CTA fixed to the bottom
function AuthCTA({ label='다음', disabled=false, onClick, sub }) {
  return (
    <div style={{ padding: '12px 20px 36px', borderTop: sub ? 'none' : 'none' }}>
      <button onClick={onClick} disabled={disabled} style={{
        width: '100%', height: 58, borderRadius: 14,
        background: disabled ? T.line : T.blue,
        color: disabled ? T.muted : '#fff',
        fontSize: 17, fontWeight: 700, border: 'none',
        letterSpacing: -0.3,
        transition: 'background .15s',
      }}>{label}</button>
      {sub && <div style={{ marginTop: 12, fontSize: 12.5, color: T.muted, textAlign: 'center' }}>{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1) Login / Signup choice
// ─────────────────────────────────────────────────────────────
function AuthChoice() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', fontFamily: T.font, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        flex: 1, background: `radial-gradient(120% 50% at 50% 0%, ${T.blueSoft} 0%, #fff 60%)`,
        padding: '100px 32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          width: 84, height: 84, borderRadius: 24, background: T.blue, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 14px 32px ${T.blue}35`, marginBottom: 24,
        }}>
          <Icon.walk width="48" height="48"/>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -0.7, lineHeight: 1.2, textAlign: 'center' }}>
          NEVO를<br/>시작해볼까요?
        </div>
        <div style={{ fontSize: 14, color: T.muted, marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
          간단한 등록 후 바로 사용하실 수 있어요
        </div>

        {/* trust strip */}
        <div style={{ marginTop: 56, width: '100%', background: T.blueWash, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon.shield width="22" height="22" style={{ color: T.blue, flexShrink: 0 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>건강 정보 안전 보호</div>
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>의료기기 수준 암호화로 저장됩니다</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 40px' }}>
        <button style={{
          width: '100%', height: 58, borderRadius: 14, background: T.blue, color: '#fff',
          fontSize: 17, fontWeight: 700, border: 'none', marginBottom: 10, letterSpacing: -0.3,
        }}>처음이에요  ·  시작하기</button>
        <button style={{
          width: '100%', height: 58, borderRadius: 14, background: '#fff', color: T.ink,
          fontSize: 17, fontWeight: 700, border: `1.5px solid ${T.line}`, letterSpacing: -0.3,
        }}>이미 계정이 있어요</button>
        <div style={{ marginTop: 16, fontSize: 11.5, color: T.muted, textAlign: 'center', lineHeight: 1.5 }}>
          시작하시면 <u>이용약관</u>과 <u>개인정보 처리방침</u>에<br/>동의하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1.5) Role pick — dedicated branch between "Start" and phone entry
// ─────────────────────────────────────────────────────────────
function AuthRolePick() {
  return (
    <div style={{ width: '100%', height: '100%', background: T.bg, fontFamily: T.font, display: 'flex', flexDirection: 'column' }}>
      {/* top: back + tiny progress hint */}
      <div style={{ padding: '54px 20px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button style={{
          width: 36, height: 36, borderRadius: 18, background: '#fff',
          border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink,
        }}><Icon.arrowLeft width="18" height="18"/></button>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 0.6 }}>역할 선택  ·  STEP 0</div>
      </div>

      <div style={{ padding: '28px 20px 0', flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -0.7, lineHeight: 1.2 }}>
          어떻게 사용하시나요?
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
          역할에 따라 다른 화면을 보여드려요.<br/>나중에 설정에서 변경할 수 있어요.
        </div>

        {/* card A — Elderly user (selected by default) */}
        <div style={{
          marginTop: 28, position: 'relative',
          background: '#fff', borderRadius: 18, padding: '20px 18px',
          border: `2px solid ${T.blue}`,
          boxShadow: `0 8px 24px ${T.blue}1A`,
        }}>
          <div style={{
            position: 'absolute', top: 14, right: 14, width: 26, height: 26, borderRadius: 13,
            background: T.blue, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.check width="16" height="16"/>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: T.blue, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 18px ${T.blue}40`,
            }}>
              <Icon.user width="30" height="30"/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, letterSpacing: -0.4 }}>본인이 사용해요</div>
                <Pill tone="info" size="sm">노약자</Pill>
              </div>
              <div style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>내 걸음을 직접 측정하고 분석받아요</div>
            </div>
          </div>

          {/* feature chips */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.line}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['walk',   '평소처럼 걸으면 자동 측정'],
              ['brain',  'AI가 보행 패턴을 분석'],
              ['sos',    '비상 시 가족과 119에 알림'],
            ].map(([i,t],k)=>{
              const I = Icon[i];
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <I width="16" height="16" style={{ color: T.blue, flexShrink: 0 }}/>
                  <span style={{ fontSize: 13, color: T.body, fontWeight: 500 }}>{t}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* card B — Caregiver */}
        <div style={{
          marginTop: 12, background: '#fff', borderRadius: 18, padding: '20px 18px',
          border: `1.5px solid ${T.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: T.bg, color: T.body,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${T.line}`,
            }}>
              <Icon.family width="30" height="30"/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, letterSpacing: -0.4 }}>가족을 돌봐요</div>
                <Pill tone="neutral" size="sm">보호자</Pill>
              </div>
              <div style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>부모님·배우자의 보행 데이터를 살펴요</div>
            </div>
          </div>

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.line}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['chart', '여러 가족 한눈에 모니터링'],
              ['bell',  '위험 신호 즉시 알림'],
              ['doc',   '의료진에게 PDF 리포트 공유'],
            ].map(([i,t],k)=>{
              const I = Icon[i];
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <I width="16" height="16" style={{ color: T.muted, flexShrink: 0 }}/>
                  <span style={{ fontSize: 13, color: T.body, fontWeight: 500 }}>{t}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* help link */}
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: T.muted, fontSize: 12.5, fontWeight: 600, padding: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              width: 16, height: 16, borderRadius: 8, border: `1.5px solid ${T.muted}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800,
            }}>?</span>
            잘 모르겠어요  ·  도움말 보기
          </button>
        </div>
      </div>

      <AuthCTA label="다음"/>
    </div>
  );
}
function AuthPhone() {
  return (
    <AuthStep step={1} total={5}>
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -0.7, lineHeight: 1.2 }}>
          전화번호를<br/>입력해주세요
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
          본인 확인을 위해 인증번호를 보내드려요
        </div>

        {/* phone input */}
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: 0.6 }}>전화번호</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, borderBottom: `2px solid ${T.blue}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: T.muted, letterSpacing: -0.5 }}>+82</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>
              010-1234-<span style={{ color: T.blue, animation: 'blink 1s infinite' }}>5</span><span style={{ color: T.muted, opacity: 0.4 }}>___</span>
            </div>
          </div>
        </div>

        {/* helper */}
        <div style={{ marginTop: 16, padding: '10px 14px', background: T.blueWash, borderRadius: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon.spark width="14" height="14" style={{ color: T.blue }}/>
          <span style={{ fontSize: 12, color: T.body }}>대신 입력해드릴까요? <b style={{ color: T.blue }}>음성 안내</b></span>
        </div>

        <div style={{ flex: 1 }}/>

        {/* simple numpad mock */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4,
          padding: '16px 0 0',
        }}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k,i)=>(
            <button key={i} disabled={!k} style={{
              height: 52, borderRadius: 10, background: k ? '#fff' : 'transparent',
              border: 'none', fontSize: 22, fontWeight: 600, color: T.ink,
              fontFamily: T.font, fontVariantNumeric: 'tabular-nums',
              cursor: k ? 'pointer' : 'default',
            }}>{k}</button>
          ))}
        </div>
      </div>

      <AuthCTA label="인증번호 받기"/>
    </AuthStep>
  );
}

// ─────────────────────────────────────────────────────────────
// 3) OTP — 6-digit verification
// ─────────────────────────────────────────────────────────────
function AuthOTP() {
  const digits = ['4','8','2','7','',''];
  return (
    <AuthStep step={2} total={5}>
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -0.7, lineHeight: 1.2 }}>
          인증번호를<br/>입력해주세요
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
          <b style={{ color: T.body }}>010-1234-5678</b>으로 6자리 코드를 보냈어요
        </div>

        {/* 6 boxes */}
        <div style={{ marginTop: 40, display: 'flex', gap: 8, justifyContent: 'center' }}>
          {digits.map((d,i)=>(
            <div key={i} style={{
              width: 50, height: 60, borderRadius: 12,
              background: d ? T.blueSoft : T.bg,
              border: i === 4 ? `2px solid ${T.blue}` : `1.5px solid ${d?T.blueChip:T.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: T.ink, fontVariantNumeric: 'tabular-nums',
              letterSpacing: -0.5,
              boxShadow: i === 4 ? `0 0 0 4px ${T.blue}15` : 'none',
            }}>{d || (i === 4 ? <div style={{ width: 2, height: 26, background: T.blue, animation: 'blink 1s infinite' }}/> : '')}</div>
          ))}
        </div>

        {/* resend / timer */}
        <div style={{ marginTop: 28, textAlign: 'center', fontSize: 13, color: T.muted }}>
          남은 시간 <span style={{ color: T.blue, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>2:48</span>
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 14, fontSize: 13 }}>
          <button style={{ background: 'none', border: 'none', color: T.muted, fontSize: 13, fontWeight: 600, padding: '6px 12px' }}>번호 변경</button>
          <div style={{ width: 1, background: T.line }}/>
          <button style={{ background: 'none', border: 'none', color: T.blue, fontSize: 13, fontWeight: 700, padding: '6px 12px' }}>다시 받기</button>
        </div>

        <div style={{ flex: 1 }}/>

        {/* simple numpad mock */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, padding: '16px 0 0',
        }}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k,i)=>(
            <button key={i} disabled={!k} style={{
              height: 52, borderRadius: 10, background: k ? '#fff' : 'transparent',
              border: 'none', fontSize: 22, fontWeight: 600, color: T.ink,
              fontFamily: T.font, fontVariantNumeric: 'tabular-nums',
            }}>{k}</button>
          ))}
        </div>
      </div>

      <AuthCTA label="확인"/>
    </AuthStep>
  );
}

// ─────────────────────────────────────────────────────────────
// 4) Profile — name, sex, birth year
// ─────────────────────────────────────────────────────────────
function AuthProfile() {
  return (
    <AuthStep step={3} total={5}>
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -0.7, lineHeight: 1.2 }}>
          기본 정보를<br/>알려주세요
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
          나이와 성별로 더 정확하게 분석해드려요
        </div>

        {/* name */}
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 700, marginBottom: 8 }}>이름</div>
          <div style={{
            background: T.bg, borderRadius: 12, padding: '16px 16px',
            border: `1.5px solid ${T.line}`, display: 'flex', alignItems: 'center',
          }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: T.ink, fontFamily: T.font }}>김순자</span>
            <div style={{ width: 2, height: 22, background: T.blue, marginLeft: 2, animation: 'blink 1s infinite' }}/>
          </div>
        </div>

        {/* sex */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 700, marginBottom: 8 }}>성별</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['여성', true],['남성', false]].map(([l,on],i)=>(
              <div key={i} style={{
                flex: 1, height: 56, borderRadius: 12,
                background: on ? T.blueSoft : '#fff',
                border: on ? `2px solid ${T.blue}` : `1.5px solid ${T.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 16, fontWeight: 700, color: on ? T.blue : T.body,
              }}>
                {on && <Icon.check width="18" height="18"/>}
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* birth year */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 700, marginBottom: 8 }}>출생 연도</div>
          <div style={{
            background: T.bg, borderRadius: 12, padding: '14px 16px',
            border: `1.5px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>1954년 (72세)</span>
            <Icon.chevron width="18" height="18" style={{ color: T.muted, transform: 'rotate(90deg)' }}/>
          </div>
        </div>

        {/* helper */}
        <div style={{ marginTop: 20, padding: '12px 14px', background: T.blueWash, borderRadius: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Icon.shield width="16" height="16" style={{ color: T.blue, flexShrink: 0, marginTop: 1 }}/>
          <span style={{ fontSize: 12, color: T.body, lineHeight: 1.5 }}>
            입력하신 정보는 보행 분석에만 사용되며, 외부에 공유되지 않아요.
          </span>
        </div>
      </div>

      <AuthCTA label="다음"/>
    </AuthStep>
  );
}

// ─────────────────────────────────────────────────────────────
// 5) Permission grant — motion + notifications
// ─────────────────────────────────────────────────────────────
function AuthPermissions() {
  const perms = [
    { i: 'walk',   t: '걸음 측정',         s: '주머니에 있을 때 자동 측정', need: '필수', on: true  },
    { i: 'bell',   t: '알림',              s: '측정 결과와 가족 알림', need: '필수', on: true  },
    { i: 'pin',    t: '위치 (선택)',       s: '응급 시 가족에게 위치 전송', need: '선택', on: false },
    { i: 'heart',  t: '건강 데이터 (선택)', s: 'Apple 건강과 연동', need: '선택', on: false },
  ];
  return (
    <AuthStep step={4} total={5}>
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -0.7, lineHeight: 1.2 }}>
          몇 가지 권한이<br/>필요해요
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
          정확한 측정과 가족 알림을 위해 사용됩니다
        </div>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {perms.map((p,i)=>{
            const I = Icon[p.i];
            return (
              <div key={i} style={{
                background: '#fff', borderRadius: 14, padding: '16px',
                border: `1.5px solid ${p.on ? T.blueChip : T.line}`,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: p.on ? T.blueSoft : T.bg,
                  color: p.on ? T.blue : T.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <I width="22" height="22"/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{p.t}</div>
                    <span style={{
                      fontSize: 10, padding: '2px 6px', borderRadius: 4,
                      background: p.need === '필수' ? T.dangerSoft : T.bg,
                      color: p.need === '필수' ? '#9B1B1B' : T.muted, fontWeight: 700,
                    }}>{p.need}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{p.s}</div>
                </div>
                <div style={{ width: 44, height: 26, borderRadius: 13, background: p.on ? T.blue : T.line, position: 'relative', transition: '0.2s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 2, left: p.on ? 20 : 2, width: 22, height: 22, borderRadius: 11, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}/>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto' }}/>
      </div>

      <AuthCTA label="모두 허용하기" sub="언제든지 설정에서 변경할 수 있어요"/>
    </AuthStep>
  );
}

// ─────────────────────────────────────────────────────────────
// 6) Caregiver connect — invite code from family
// ─────────────────────────────────────────────────────────────
function AuthConnect() {
  return (
    <AuthStep step={5} total={5}>
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -0.7, lineHeight: 1.2 }}>
          가족과<br/>연결해볼까요?
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
          보호자 앱에서 발급받은 4자리 코드를 입력해주세요
        </div>

        {/* 4 digit boxes */}
        <div style={{ marginTop: 40, display: 'flex', gap: 10, justifyContent: 'center' }}>
          {['4','8','2','7'].map((d,i)=>(
            <div key={i} style={{
              width: 60, height: 72, borderRadius: 14,
              background: T.blueSoft, border: `1.5px solid ${T.blueChip}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800, color: T.ink, fontVariantNumeric: 'tabular-nums',
            }}>{d}</div>
          ))}
        </div>

        {/* preview connected */}
        <div style={{ marginTop: 30 }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, marginBottom: 10, textAlign: 'center', letterSpacing: 0.4 }}>
            이 사람과 연결됩니다
          </div>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '16px', border: `1.5px solid ${T.line}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <Avatar name="민지" size={48}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>이민지</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>딸 · 010-9876-5432</div>
            </div>
            <Icon.check width="22" height="22" style={{ color: T.ok }}/>
          </div>
        </div>

        {/* alt: QR */}
        <button style={{
          marginTop: 18, width: '100%', height: 48, borderRadius: 12,
          background: T.bg, color: T.body, border: `1.5px solid ${T.line}`,
          fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>QR 코드로 연결하기</button>

        <div style={{ marginTop: 'auto' }}/>

        <div style={{ paddingBottom: 8, textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: T.muted, fontSize: 13, fontWeight: 600, padding: 8, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            나중에 연결할게요
          </button>
        </div>
      </div>

      <AuthCTA label="연결하기"/>
    </AuthStep>
  );
}

// ─────────────────────────────────────────────────────────────
// 7) Welcome / Ready — completion celebration
// ─────────────────────────────────────────────────────────────
function AuthWelcome() {
  return (
    <div style={{ width: '100%', height: '100%', fontFamily: T.font, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(180deg, ${T.blue} 0%, ${T.blueDark} 70%, ${T.blueDarker} 100%)`,
      color: '#fff', display: 'flex', flexDirection: 'column',
    }}>
      {/* decorative concentric circles */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
        {[180, 280, 380, 480, 580].map((s,i)=>(
          <div key={i} style={{
            position: 'absolute', left: '50%', top: '35%',
            transform: `translate(-50%, -50%)`,
            width: s, height: s, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.7)',
          }}/>
        ))}
      </div>

      <div style={{ flex: 1, padding: '180px 32px 0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* checkmark badge */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%', background: '#fff', color: T.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}>
          <Icon.check width="56" height="56"/>
        </div>

        <div style={{ fontSize: 32, fontWeight: 800, marginTop: 28, letterSpacing: -1, lineHeight: 1.2 }}>
          김순자님,<br/>이제 시작해요!
        </div>
        <div style={{ fontSize: 15, opacity: 0.85, marginTop: 14, lineHeight: 1.6, maxWidth: 280 }}>
          평소처럼 걸으시면 자동으로<br/>분석해드릴게요
        </div>

        {/* summary chips */}
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          {[
            ['shield', '계정 생성 완료'],
            ['family', '딸 이민지님과 연결됨'],
            ['walk',   '자동 측정 시작'],
          ].map(([i,t],k)=>{
            const I = Icon[i];
            return (
              <div key={k} style={{
                background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(20px)',
                borderRadius: 12, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <I width="20" height="20" style={{ color: '#fff', opacity: 0.95 }}/>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, textAlign: 'left' }}>{t}</div>
                <Icon.check width="16" height="16" style={{ color: '#86E3C1' }}/>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '20px 20px 40px' }}>
        <button style={{
          width: '100%', height: 58, borderRadius: 14, background: '#fff', color: T.blue,
          fontSize: 17, fontWeight: 700, border: 'none', letterSpacing: -0.3,
        }}>NEVO 시작하기</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CAREGIVER variant — same chrome, slightly different copy & illustration
// ─────────────────────────────────────────────────────────────

// Caregiver "send invite" — generate code to share with elderly user
function CareInvite() {
  return (
    <AuthStep step={5} total={5}>
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -0.7, lineHeight: 1.2 }}>
          돌볼 가족을<br/>초대해주세요
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
          가족에게 이 4자리 코드를 알려주시면<br/>NEVO 앱에서 입력해 연결됩니다
        </div>

        {/* big invite code card */}
        <div style={{
          marginTop: 32, padding: '28px 24px',
          background: `linear-gradient(135deg, ${T.blue} 0%, ${T.blueDark} 100%)`,
          borderRadius: 20, color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
          <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 700, letterSpacing: 1, position: 'relative' }}>초대 코드</div>
          <div style={{
            fontSize: 56, fontWeight: 800, letterSpacing: 12, marginTop: 12,
            fontFamily: T.fontMono, position: 'relative',
          }}>4 8 2 7</div>
          <div style={{ marginTop: 14, fontSize: 12, opacity: 0.85, position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon.refresh width="13" height="13"/> 10:00 후 자동 갱신
          </div>
        </div>

        {/* share methods */}
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[['message','문자'],['share','공유'],['phone','전화']].map(([i,l],k)=>{
            const I = Icon[i];
            return (
              <button key={k} style={{
                background: '#fff', borderRadius: 14, padding: '16px 8px',
                border: `1.5px solid ${T.line}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                color: T.body, cursor: 'pointer',
              }}>
                <I width="22" height="22" style={{ color: T.blue }}/>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>{l}</span>
              </button>
            );
          })}
        </div>

        {/* waiting state */}
        <div style={{
          marginTop: 20, padding: '14px 16px', background: T.blueWash,
          borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: T.blue, animation: 'blink 1.2s infinite' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>연결 대기 중...</div>
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>가족이 코드를 입력하면 자동으로 진행돼요</div>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}/>

        <div style={{ paddingBottom: 8, textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: T.muted, fontSize: 13, fontWeight: 600, padding: 8, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            나중에 초대할게요
          </button>
        </div>
      </div>
    </AuthStep>
  );
}

// blink keyframes injected once
if (typeof document !== 'undefined' && !document.getElementById('auth-keyframes')) {
  const s = document.createElement('style');
  s.id = 'auth-keyframes';
  s.textContent = '@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }';
  document.head.appendChild(s);
}

Object.assign(window, {
  AuthChoice, AuthRolePick, AuthPhone, AuthOTP, AuthProfile,
  AuthPermissions, AuthConnect, AuthWelcome, CareInvite,
});
