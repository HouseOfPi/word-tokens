// scenes-3.jsx — Scene 5: Semantic space (with training-convergence intro) · Scene 6: Recap
// Sprite windows (global): space 181.2–224.4 · recap 224.4–238

const SPACE_POINTS = [
  // near cluster (kitten is handled separately — it converges with cat)
  { w: 'dog',    x: 1006, y: 540, near: true },
  { w: 'puppy',  x: 1092, y: 636, near: true },
  { w: 'tiger',  x: 1336, y: 514, near: true },
  // far words
  { w: 'car',    x: 478,  y: 758 },
  { w: 'truck',  x: 384,  y: 664 },
  { w: 'piano',  x: 562,  y: 252 },
  { w: 'violin', x: 452,  y: 344 },
];
const HERO_PT = { x: 1148, y: 468 };
const KITTEN_PT = { x: 1262, y: 372 };

// small 8-cell pattern strip shown above a point during the convergence phase
// valFor → cell color (may animate); numFor → displayed number (kept stable to
// avoid digit flicker). Defaults numFor to valFor for static strips.
function MiniPattern({ x, y, valFor, numFor, a }) {
  if (a <= 0) return null;
  const numF = numFor || valFor;
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0,
      transform: `translate(${x}px, ${y}px) translate(-50%, -100%)`,
      willChange: 'transform',
      display: 'flex', gap: 4, opacity: a,
      background: C.panel, border: `1px solid ${C.lineSoft}`, borderRadius: 9,
      padding: 6, boxShadow: `0 4px 14px rgba(${C.inkRGB},0.08)`,
    }}>
      {Array.from({ length: 8 }, (_, c) => (
        <div key={c} style={{
          width: 20, height: 28, borderRadius: 4, background: cellColor(valFor(c)),
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          <span style={{
            transform: 'rotate(-90deg)', display: 'inline-block',
            fontFamily: F.mono, fontSize: 8, fontWeight: 600, color: C.ink,
            whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
          }}>{fmtNum(numF(c))}</span>
        </div>
      ))}
    </div>
  );
}

function SceneSpace() {
  const { localTime: lt, duration } = useSprite();
  const alpha = sceneAlpha(lt, duration, 0.5, 0.9);
  const lerp = (a, b, p) => a + (b - a) * p;

  const gridA = animate({ from: 0, to: 1, start: 0.3, end: 1.2 })(lt);

  // P16 · training convergence: cat + kitten drift together as their patterns align
  const conv = animate({ from: 0, to: 1, start: 1.8, end: 13.0, ease: Easing.easeInOutSine })(lt);
  const catX = lerp(820, HERO_PT.x, conv), catY = lerp(700, HERO_PT.y, conv);
  const kitX = lerp(1485, KITTEN_PT.x, conv), kitY = lerp(255, KITTEN_PT.y, conv);
  const stripsA = windowAlpha(lt, 1.0, 15.8, 0.7, 0.8);

  // Both cat and kitten start from their own noisy vectors and drift toward a
  // shared aligned pattern (near VEC) — neither is a fixed anchor.
  const target = (c) => VEC[c] * 0.92 + 0.06;          // shared convergence pattern
  const kittenVal = (c) => lerp((srand(c, 55) * 2 - 1) * 1.1, target(c), conv);
  const catVal    = (c) => lerp((srand(c, 17) * 2 - 1) * 1.1, target(c) + 0.05, conv);
  // displayed numbers: quantized so the last digit ticks in coarse steps
  // instead of flickering every frame
  const kittenNum = (c) => Math.round(kittenVal(c) / 0.05) * 0.05;
  const catNum    = (c) => Math.round(catVal(c) / 0.05) * 0.05;

  // P17 · the rest of the space populates
  // P18 · links + zoom
  const zoom = animate({ from: 1, to: 1.18, start: 28, end: 41, ease: Easing.easeInOutSine })(lt);
  const ringP = clamp((lt - 16.8) / 1.4, 0, 1);

  const dot = (filled, near) => ({
    width: 18, height: 18, borderRadius: 10, margin: '0 auto',
    background: near ? C.coralDeep : C.slate,
    opacity: near ? 0.85 : 0.55,
  });

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha }}>
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${zoom})`,
        transformOrigin: `${HERO_PT.x}px ${HERO_PT.y}px`,
      }}>
        {/* dotted grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: gridA * 0.5,
          backgroundImage: `radial-gradient(circle, ${C.line} 2px, rgba(0,0,0,0) 2px)`,
          backgroundSize: '84px 84px', backgroundPosition: '42px 42px',
        }}></div>

        {/* neighbor links (P18) */}
        <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
          {[{ x: KITTEN_PT.x, y: KITTEN_PT.y }, ...SPACE_POINTS.filter(p => p.near)].map((p, i) => {
            const a = windowAlpha(lt, 28.4 + i * 0.3, 99, 0.7, 0.5);
            if (a <= 0) return null;
            return (
              <line key={i}
                x1={HERO_PT.x} y1={HERO_PT.y} x2={p.x} y2={p.y}
                stroke={C.coral} strokeWidth="2.5" opacity={a * 0.55}
                strokeDasharray="9 11" strokeDashoffset={-lt * 14}
              ></line>
            );
          })}
        </svg>

        {/* other words pop in during P17 */}
        {SPACE_POINTS.map((p, i) => {
          const t0 = p.near ? 18.5 + i * 0.35 : 17.0 + (i - 3) * 0.3;
          const e = Easing.easeOutBack(clamp((lt - t0) / 0.6, 0, 1));
          if (e <= 0) return null;
          return (
            <div key={p.w} style={{
              position: 'absolute', left: p.x, top: p.y,
              transform: `translate(-50%, -50%) scale(${e})`, opacity: Math.min(1, e * 1.4),
            }}>
              <div style={dot(true, p.near)}></div>
              <div style={{
                marginTop: 10, textAlign: 'center',
                fontFamily: F.mono, fontSize: 26,
                color: p.near ? C.ink : C.inkSoft,
                opacity: p.near ? 0.9 : 0.65,
              }}>{p.w}</div>
            </div>
          );
        })}

        {/* kitten — present from the start, converging toward cat */}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${kitX}px, ${kitY}px) translate(-50%, -50%)`, willChange: 'transform', opacity: Math.min(1, gridA * 1.4) }}>
          <div style={dot(true, true)}></div>
          <div style={{
            marginTop: 10, textAlign: 'center',
            fontFamily: F.mono, fontSize: 26, color: C.ink, opacity: 0.9,
          }}>kitten</div>
        </div>
        <MiniPattern x={kitX} y={kitY - 36} valFor={kittenVal} numFor={kittenNum} a={stripsA} />

        {/* hero: cat — converging to its final spot */}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${catX}px, ${catY}px) translate(-50%, -50%)`, willChange: 'transform', opacity: Math.min(1, gridA * 1.4) }}>
          {ringP > 0 && ringP < 1 && (
            <div style={{
              position: 'absolute', left: '50%', top: 13, width: 26, height: 26,
              transform: `translate(-50%, -50%) scale(${1 + ringP * 3.2})`,
              border: `2.5px solid ${C.coral}`, borderRadius: '50%',
              opacity: (1 - ringP) * 0.7,
            }}></div>
          )}
          <div style={{
            width: 26, height: 26, borderRadius: 14, margin: '0 auto',
            background: C.coral, boxShadow: `0 4px 14px rgba(${C.accentRGB},0.45)`,
          }}></div>
          <div style={{
            marginTop: 10, textAlign: 'center',
            fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600,
            fontSize: 34, color: C.ink,
          }}>cat</div>
        </div>
        <MiniPattern x={catX} y={catY - 36} valFor={catVal} numFor={catNum} a={stripsA} />
      </div>

      <Kicker lt={lt} show={0.6} hide={42.2} num="08" text="Meaning as geometry" />
      <Caption lt={lt} show={2.4} hide={9.6}>words used in similar ways develop similar patterns</Caption>
      <Caption lt={lt} show={10.2} hide={15.6}>similar patterns → their vectors land close together</Caption>
      <Caption lt={lt} show={17.4} hide={26.4}>by the end of training, every word has its own vector</Caption>
      <Caption lt={lt} show={33.0} hide={41.6}>similar meaning → nearby vectors</Caption>
    </div>
  );
}

// ── Scene 6 · Recap (224.4–238s global) — staccato beats match the narration ─
function SceneRecap() {
  const { localTime: lt, duration } = useSprite();
  const alpha = sceneAlpha(lt, duration, 0.5, 0.8);

  const itemAt = (k) => Easing.easeOutCubic(clamp((lt - (1.2 + k * 1.9)) / 0.6, 0, 1));
  const arrowAt = (k) => Easing.easeOutCubic(clamp((lt - (1.55 + k * 1.9)) / 0.45, 0, 1));

  const chipStyle = {
    fontFamily: F.serif, fontSize: 42, fontWeight: 600, color: C.ink,
    background: C.panel, border: `1.5px solid ${C.line}`, borderRadius: 12,
    padding: '8px 22px', boxShadow: `0 5px 18px rgba(${C.inkRGB},0.07)`,
  };

  const items = [
    { label: 'word', el: <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 52, fontWeight: 600, color: C.ink }}>“cat”</div> },
    { label: 'token', el: <div style={chipStyle}>cat</div> },
    { label: 'token ID', el: <div style={{
        fontFamily: F.mono, fontSize: 34, fontWeight: 500, color: C.cream,
        background: C.plate, padding: '9px 20px', borderRadius: 10, fontVariantNumeric: 'tabular-nums',
      }}>2543</div> },
    { label: 'vector', el: <div style={{
        fontFamily: F.mono, fontSize: 31, color: C.ink, fontVariantNumeric: 'tabular-nums', whiteSpace: 'pre',
      }}>[ 0.82  −0.41  … ]</div> },
    { label: 'a point in meaning-space', el: (
        <div style={{
          width: 30, height: 30, borderRadius: 16, background: C.coral,
          boxShadow: `0 0 0 9px rgba(${C.accentRGB},0.16), 0 4px 14px rgba(${C.accentRGB},0.4)`,
        }}></div>
      ) },
  ];

  const headA = windowAlpha(lt, 10.7, 99, 0.8, 0.5);
  const drift = 1 + clamp(lt / duration, 0, 1) * 0.025;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${drift})`, transformOrigin: '50% 46%' }}>

        {headA > 0 && (
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 296, textAlign: 'center',
            opacity: headA, transform: `translateY(${(1 - headA) * 16}px)`,
          }}>
            <span style={{ fontFamily: F.serif, fontSize: 84, fontWeight: 600, color: C.ink, letterSpacing: '-0.01em' }}>
              That’s a word embedding<span style={{ color: C.coral }}>.</span>
            </span>
          </div>
        )}

        <div style={{
          position: 'absolute', left: 0, right: 0, top: 528,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34,
        }}>
          {items.map((it, k) => (
            <React.Fragment key={k}>
              {k > 0 && (
                <div style={{
                  fontFamily: F.sans, fontSize: 40, color: C.inkSoft,
                  opacity: arrowAt(k - 1), transform: `translateX(${(1 - arrowAt(k - 1)) * -10}px)`,
                }}>→</div>
              )}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
                opacity: itemAt(k), transform: `translateY(${(1 - itemAt(k)) * 18}px)`,
                minHeight: 80, justifyContent: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', minHeight: 76 }}>{it.el}</div>
                <div style={{ fontFamily: F.mono, fontSize: 21, color: C.inkSoft, letterSpacing: '0.06em' }}>{it.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { SceneSpace, SceneRecap });
