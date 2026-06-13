// scenes-4.jsx — Scene 4.5: Learned values · Scene 4.6: Dimensions · Scene 4.7: The fingerprint
// Sprite windows (global): learned 117.5–135.4 · dimensions 135.4–155.4 · fingerprint 155.4–181.2

// Shared mini vector strip used by these scenes: 12 value cells + ellipsis
const LV_COLS = 13;
const LV_CW = 100, LV_CH = 130, LV_GAP = 12;
const LV_W = LV_COLS * LV_CW + (LV_COLS - 1) * LV_GAP;
const LV_LEFT = (1920 - LV_W) / 2;

function LVCell({ v, isEll, numOpacity = 1, glow = 0, children }) {
  return (
    <div style={{
      position: 'relative', width: LV_CW, height: LV_CH, borderRadius: 12,
      background: C.panel, border: `1.5px solid ${glow > 0.04 ? `rgba(${C.accentRGB},${0.3 + 0.7 * glow})` : C.line}`,
      boxShadow: `0 6px 18px rgba(${C.inkRGB},0.07)${glow > 0.04 ? `, 0 0 0 ${7 * glow}px rgba(${C.accentRGB},${0.15 * glow})` : ''}`,
      overflow: 'hidden', transform: `scale(${1 + glow * 0.08})`,
      boxSizing: 'border-box',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: isEll ? 'transparent' : cellColor(v, 0.55), borderRadius: 'inherit' }}></div>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.mono, fontSize: isEll ? 34 : 25, fontWeight: 600, color: C.ink,
        fontVariantNumeric: 'tabular-nums', opacity: numOpacity,
      }}>{isEll ? '…' : fmtNum(v)}</div>
      {children}
    </div>
  );
}

// ── Scene 4.5 · Learned values (P10 + P11) ──────────────────────────────────
// “But where do these values come from?” → “Nobody writes them by hand…”
function SceneLearnedValues() {
  const { localTime: lt, duration } = useSprite();
  const alpha = sceneAlpha(lt, duration, 0.5, 0.8);

  // the big question (P10)
  const qA = windowAlpha(lt, 0.3, 4.2, 0.6, 0.6);

  // strip + training stream (P11)
  const stripA = windowAlpha(lt, 4.8, 99, 0.8, 0.5);
  const settleP = animate({ from: 0, to: 1, start: 10.5, end: 16.0, ease: Easing.easeInOutCubic })(lt);
  const settled = settleP >= 0.999;

  const STREAM = [
    'the cat sat quietly on the warm carpet',
    'a small kitten purrs softly in the sun',
    'dogs and puppies love to play outside',
    'she parked the car beside the old piano hall',
    'every word is read in its context',
    'the quiet library hums at noon',
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha }}>
      <Kicker lt={lt} show={4.8} hide={17.2} num="05" text="Learned values" />

      {/* P10 · the question */}
      {qA > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center',
          opacity: qA, transform: `translateY(${(1 - qA) * 16}px)`,
        }}>
          <span style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 54, fontWeight: 600, color: C.ink }}>
            But where do these values come from<span style={{ color: C.coral }}>?</span>
          </span>
        </div>
      )}

      {/* training text drifting behind the strip */}
      {stripA > 0 && STREAM.map((s, i) => {
        const y = 230 + i * 110;
        const dir = i % 2 === 0 ? 1 : -1;
        const x = 960 + dir * ((lt * (26 + i * 7)) % 480 - 240);
        const rowA = windowAlpha(lt, 5.6 + i * 0.25, 16.6, 0.8, 0.8);
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, transform: 'translateX(-50%)',
            fontFamily: F.serif, fontSize: 34, fontStyle: 'italic', color: C.inkSoft,
            opacity: rowA * stripA * 0.30, whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>{s}</div>
        );
      })}

      {/* the vector, values searching → settling */}
      {stripA > 0 && (
        <div style={{
          position: 'absolute', left: LV_LEFT, top: 475, display: 'flex', gap: LV_GAP,
          opacity: stripA, transform: `translateY(${(1 - stripA) * 18}px)`,
        }}>
          {Array.from({ length: LV_COLS }, (_, i) => {
            const isEll = i === LV_COLS - 1;
            const jitter = (srand(i, 3 + Math.floor(lt * 5)) * 2 - 1) * 1.1;
            const v = isEll ? 0 : VEC[i] * settleP + jitter * (1 - settleP);
            return <LVCell key={i} v={v} isEll={isEll} />;
          })}
        </div>
      )}

      {/* status under the strip */}
      {stripA > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 648, textAlign: 'center',
          fontFamily: F.mono, fontSize: 24, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: settled ? C.coral : C.inkSoft, fontWeight: settled ? 600 : 400,
          opacity: stripA,
        }}>
          {settled ? 'learned' : `training${'.'.repeat(1 + Math.floor(lt * 2) % 3)}`}
        </div>
      )}

      <Caption lt={lt} show={5.2} hide={9.8}>nobody writes these numbers by hand</Caption>
      <Caption lt={lt} show={10.3} hide={16.8}>the model learns every value by reading massive amounts of text</Caption>
    </div>
  );
}

// ── Scene 4.6 · Dimensions (P12 + P13) ──────────────────────────────────────
// “Each number occupies a specific position… we call these positions dimensions.”
function SceneDimensions() {
  const { localTime: lt, duration } = useSprite();
  const alpha = sceneAlpha(lt, duration, 0.5, 0.8);

  const headA = windowAlpha(lt, 0.3, 3.2, 0.6, 0.6);
  const stripA = windowAlpha(lt, 3.6, 99, 0.8, 0.5);
  const dimTagA = windowAlpha(lt, 8.6, 99, 0.7, 0.5);
  const eqA = windowAlpha(lt, 12.4, 99, 0.8, 0.5);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha }}>
      <Kicker lt={lt} show={3.6} hide={19.4} num="06" text="Dimensions" />

      {/* P12 · transition line */}
      {headA > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center',
          opacity: headA, transform: `translateY(${(1 - headA) * 14}px)`,
        }}>
          <span style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 50, fontWeight: 600, color: C.ink }}>
            So what does the model actually learn?
          </span>
        </div>
      )}

      {/* “positions = dimensions” tag above the strip */}
      {dimTagA > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 318, textAlign: 'center',
          opacity: dimTagA, transform: `translateY(${(1 - dimTagA) * 10}px)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
        }}>
          <span style={{ width: 60, height: 1.5, background: C.line }}></span>
          <span style={{
            fontFamily: F.mono, fontSize: 25, color: C.coral, fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>positions = dimensions</span>
          <span style={{ width: 60, height: 1.5, background: C.line }}></span>
        </div>
      )}

      {/* the vector with position badges */}
      {stripA > 0 && (
        <div style={{
          position: 'absolute', left: LV_LEFT, top: 400, opacity: stripA,
          transform: `translateY(${(1 - stripA) * 18}px)`,
        }}>
          <div style={{ display: 'flex', gap: LV_GAP }}>
            {Array.from({ length: LV_COLS }, (_, i) => {
              const isEll = i === LV_COLS - 1;
              return <LVCell key={i} v={isEll ? 0 : VEC[i]} isEll={isEll} />;
            })}
          </div>
          {/* badges */}
          <div style={{ display: 'flex', gap: LV_GAP, marginTop: 16 }}>
            {Array.from({ length: LV_COLS }, (_, i) => {
              const isEll = i === LV_COLS - 1;
              const bA = Easing.easeOutCubic(clamp((lt - 4.0 - i * 0.14) / 0.5, 0, 1));
              return (
                <div key={i} style={{
                  width: LV_CW, textAlign: 'center', opacity: bA,
                  transform: `translateY(${(1 - bA) * -8}px)`,
                }}>
                  <span style={{
                    fontFamily: F.mono, fontSize: 21, fontVariantNumeric: 'tabular-nums',
                    color: isEll ? C.coral : C.inkSoft, fontWeight: isEll ? 600 : 400,
                    background: isEll ? `rgba(${C.accentRGB},0.12)` : C.panel,
                    border: `1px solid ${isEll ? `rgba(${C.accentRGB},0.4)` : C.lineSoft}`,
                    borderRadius: 8, padding: '4px 12px', display: 'inline-block',
                  }}>{isEll ? '768' : i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* P13 · the equation */}
      {eqA > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 716, textAlign: 'center',
          opacity: eqA, transform: `translateY(${(1 - eqA) * 14}px)`,
        }}>
          <span style={{ fontFamily: F.serif, fontSize: 52, fontWeight: 600, color: C.ink }}>
            768 dimensions <span style={{ color: C.coral }}>=</span> 768 values
          </span>
        </div>
      )}

      <Caption lt={lt} show={4.2} hide={8.2}>each value sits at a fixed position in the vector</Caption>
      <Caption lt={lt} show={13.0} hide={19.0}>“768 dimensions” simply means 768 values</Caption>
    </div>
  );
}

// ── Scene 4.7 · The fingerprint (P14 + P15) ─────────────────────────────────
// “Meaning is spread across the whole vector… a fingerprint for the word.”
function SceneFingerprint() {
  const { localTime: lt, duration } = useSprite();
  const alpha = sceneAlpha(lt, duration, 0.5, 0.8);

  const stripA = windowAlpha(lt, 0.4, 99, 0.8, 0.5);

  // P14 · sweep: meaning is spread across every cell
  const wavePos = animate({ from: -2.5, to: 15, start: 1.6, end: 7.2, ease: Easing.easeInOutSine })(lt);

  // P15 · fingerprint tag, then the pattern morphs away from “cat”
  const tagA = windowAlpha(lt, 10.3, 99, 0.7, 0.5);
  const morphP = animate({ from: 0, to: 1, start: 19.4, end: 23.8, ease: Easing.easeInOutCubic })(lt);

  const catA = clamp(1 - morphP * 1.6, 0, 1);
  const qA = clamp((morphP - 0.5) * 2.6, 0, 1);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha }}>
      <Kicker lt={lt} show={0.6} hide={25.2} num="07" text="The fingerprint" />

      {/* word label above the strip */}
      {stripA > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center',
          opacity: stripA, height: 90,
        }}>
          <span style={{
            fontFamily: F.serif, fontStyle: 'italic', fontSize: 64, fontWeight: 600,
            color: C.ink, opacity: catA, position: 'absolute', left: 0, right: 0,
          }}>“cat”</span>
          <span style={{
            fontFamily: F.serif, fontSize: 64, fontWeight: 600,
            color: C.inkSoft, opacity: qA, position: 'absolute', left: 0, right: 0,
            transform: `scale(${0.9 + qA * 0.1})`,
          }}>…something else?</span>
        </div>
      )}

      {/* the pattern */}
      {stripA > 0 && (
        <div style={{
          position: 'absolute', left: LV_LEFT, top: 455, display: 'flex', gap: LV_GAP,
          opacity: stripA, transform: `translateY(${(1 - stripA) * 18}px)`,
        }}>
          {Array.from({ length: LV_COLS }, (_, i) => {
            const isEll = i === LV_COLS - 1;
            const glow = Math.exp(-Math.pow(i - wavePos, 2) / 1.6);
            // progressive per-cell morph away from cat's pattern
            const cellMorph = clamp((morphP - i / LV_COLS) * 5, 0, 1);
            const alt = (srand(i, 99) * 2 - 1) * 1.1;
            const v = isEll ? 0 : VEC[i] * (1 - cellMorph) + alt * cellMorph;
            return <LVCell key={i} v={v} isEll={isEll} glow={glow} numOpacity={0.85} />;
          })}
        </div>
      )}

      {/* fingerprint tag */}
      {tagA > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 650, textAlign: 'center',
          opacity: tagA * clamp(1 - morphP * 1.8, 0, 1),
          transform: `translateY(${(1 - tagA) * 12}px)`,
          fontFamily: F.serif, fontStyle: 'italic', fontSize: 34, color: C.inkSoft,
        }}>a fingerprint for “cat” — the whole pattern, not any single number</div>
      )}

      <Caption lt={lt} show={1.4} hide={8.8}>meaning is spread across the entire vector</Caption>
      <Caption lt={lt} show={13.9} hide={18.3}>no single number defines “cat” — the whole pattern does</Caption>
      <Caption lt={lt} show={19.6} hide={25.0}>change the pattern enough, and it stops being “cat”</Caption>
    </div>
  );
}

Object.assign(window, { SceneLearnedValues, SceneDimensions, SceneFingerprint });
