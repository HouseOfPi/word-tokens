// theme.jsx — palette, fonts, shared helpers + the TokenRow used across scenes
// Warm Anthropic-style: cream ground, coral accent, cool slate counter-accent.

// Theme system — C is mutated in place by applyTheme(); components read C every frame.
const THEMES = {
  warm: {
    bg: '#FAF6ED', panel: '#FFFFFF', ink: '#22201B', inkSoft: '#80785F',
    line: '#E2D9C4', lineSoft: '#EFE9DA',
    coral: '#D97757', coralDeep: '#BC5B3B', slate: '#6B89A7', slateDeep: '#4F6E8D',
    plate: '#2A2823', cream: '#F6F1E4',
    bgRGB: '250,246,237', cardRGB: '255,255,255', inkRGB: '34,32,27',
    accentRGB: '217,119,87', lineRGB: '214,202,176', creamRGB: '246,241,228',
    posRGB: '206,102,68', negRGB: '96,126,156',
  },
  midnight: {
    bg: '#161A20', panel: '#232932', ink: '#F1EDE2', inkSoft: '#98A1AC',
    line: '#3A434F', lineSoft: '#2C333D',
    coral: '#E0825C', coralDeep: '#EE9468', slate: '#7FA3C6', slateDeep: '#9FBEDB',
    plate: '#EDE7D8', cream: '#1A1E24',
    bgRGB: '22,26,32', cardRGB: '35,41,50', inkRGB: '0,0,0',
    accentRGB: '224,130,92', lineRGB: '58,67,79', creamRGB: '26,30,36',
    posRGB: '224,130,92', negRGB: '127,163,198',
  },
  sage: {
    bg: '#F3F4EB', panel: '#FFFFFF', ink: '#232A1F', inkSoft: '#76806A',
    line: '#DCE0CC', lineSoft: '#EAEDDE',
    coral: '#678B4F', coralDeep: '#50703B', slate: '#B07A4C', slateDeep: '#8F5F38',
    plate: '#2A2F24', cream: '#F2F4E9',
    bgRGB: '243,244,235', cardRGB: '255,255,255', inkRGB: '35,42,31',
    accentRGB: '103,139,79', lineRGB: '220,224,204', creamRGB: '242,244,233',
    posRGB: '103,139,79', negRGB: '176,122,76',
  },
  indigo: {
    bg: '#F4F3EF', panel: '#FFFFFF', ink: '#1E2030', inkSoft: '#757A8C',
    line: '#DDDCE3', lineSoft: '#ECEBF0',
    coral: '#5B63C7', coralDeep: '#444CB0', slate: '#C98A3F', slateDeep: '#A66F2D',
    plate: '#23253A', cream: '#F2F1FA',
    bgRGB: '244,243,239', cardRGB: '255,255,255', inkRGB: '30,32,48',
    accentRGB: '91,99,199', lineRGB: '221,220,227', creamRGB: '242,241,250',
    posRGB: '91,99,199', negRGB: '201,138,63',
  },
  paper: {
    bg: '#FFFFFF', panel: '#FFFFFF', ink: '#191919', inkSoft: '#8A8A8A',
    line: '#E4E4E4', lineSoft: '#F0F0F0',
    coral: '#C8442C', coralDeep: '#A33620', slate: '#5E7A96', slateDeep: '#46627E',
    plate: '#1E1E1E', cream: '#FAFAFA',
    bgRGB: '255,255,255', cardRGB: '252,252,252', inkRGB: '25,25,25',
    accentRGB: '200,68,44', lineRGB: '214,214,214', creamRGB: '250,250,250',
    posRGB: '200,68,44', negRGB: '94,122,150',
  },
};

const C = { ...THEMES.warm };
function applyTheme(key) { Object.assign(C, THEMES[key] || THEMES.warm); }

const F = {
  serif: '"Source Serif 4", Georgia, "Times New Roman", serif',
  sans:  '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono:  '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

// The hero vector for “cat” — used by the matrix row, the number strip and the recap.
const VEC = [0.82, -0.41, 0.13, 1.07, -0.66, 0.29, -1.12, 0.54, 0.08, 0.91, -0.27, 0.36];

// Deterministic pseudo-random in [0,1)
function srand(i, j) {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Signed value → warm/cool cell color
function cellColor(v, aMul = 1) {
  const intensity = clamp(Math.abs(v) / 1.2, 0.10, 1);
  const a = (0.14 + 0.58 * intensity) * aMul;
  return v >= 0 ? `rgba(${C.posRGB}, ${a})` : `rgba(${C.negRGB}, ${a})`;
}

const fmtNum = (v) => (v < 0 ? '\u2212' : '') + Math.abs(v).toFixed(2);

// Fade-up entrance style helper
function fadeUp(lt, start, dur = 0.6, dist = 18, ease = Easing.easeOutCubic) {
  const p = clamp((lt - start) / dur, 0, 1);
  const e = ease(p);
  return { opacity: e, transform: `translateY(${(1 - e) * dist}px)` };
}

// Visibility window with fade in + out
function windowAlpha(lt, show, hide, inD = 0.5, outD = 0.5) {
  return Math.min(clamp((lt - show) / inD, 0, 1), clamp((hide - lt) / outD, 0, 1));
}

// Whole-scene fade alpha given local time + scene duration
function sceneAlpha(lt, dur, inD = 0.0, outD = 0.8) {
  const a = inD > 0 ? clamp(lt / inD, 0, 1) : 1;
  const b = clamp((dur - lt) / outD, 0, 1);
  return Math.min(a, b);
}

// Numbered section kicker, top center
function Kicker({ lt, show, hide, num, text }) {
  const a = windowAlpha(lt, show, hide, 0.6, 0.5);
  if (a <= 0) return null;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 74,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      opacity: a, transform: `translateY(${(1 - a) * 10}px)`,
    }}>
      {num ? <span style={{ fontFamily: F.mono, fontSize: 23, color: C.coral, fontWeight: 600 }}>{num}</span> : null}
      {num ? <span style={{ width: 26, height: 1.5, background: C.line }}></span> : null}
      <span style={{
        fontFamily: F.mono, fontSize: 23, color: C.inkSoft,
        letterSpacing: '0.3em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>{text}</span>
    </div>
  );
}

// Caption, bottom center
function Caption({ lt, show, hide, children }) {
  const a = windowAlpha(lt, show, hide, 0.6, 0.5);
  if (a <= 0) return null;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 952, textAlign: 'center',
      fontFamily: F.serif, fontSize: 34, fontStyle: 'italic', color: C.inkSoft,
      opacity: a, transform: `translateY(${(1 - a) * 12}px)`,
    }}>{children}</div>
  );
}

// ── Sentence model ──────────────────────────────────────────────────────────
// "The cat sat quietly."  →  [The][cat][sat][quiet][ly][.]
const SENT_UNITS = [
  { parts: [{ t: 'The',   id: 464,  start: 0 }] },
  { parts: [{ t: 'cat',   id: 2543, start: 4, hero: true }] },
  { parts: [{ t: 'sat',   id: 7826, start: 8 }] },
  { parts: [
    { t: 'quiet', id: 5810, start: 12, sub: true },
    { t: 'ly',    id: 306,  start: 17, sub: true },
  ] },
  { parts: [{ t: '.',     id: 13,   start: 19 }], isPunc: true },
];
const SENT_TOTAL_CHARS = 20;

// ── TokenRow ────────────────────────────────────────────────────────────────
// One component renders the sentence through all its states so transitions
// are continuous: typing → chips → subword split → ID plates → hero dim.
function TokenRow({
  typedChars = SENT_TOTAL_CHARS,
  caretOn = false, caretBlink = 0,
  chipP = 0,        // 0 plain text → 1 chips
  splitP = 0,       // 0 joined → 1 subwords separated
  idsT = -1,        // local seconds since ID plates started (-1 = hidden)
  tagT = -1,        // local seconds since “token” tags started (-1 = hidden)
  dimP = 0,         // dim non-hero tokens
  pulseT = -1,      // local seconds since subword pulse started (-1 = off)
  heroRef = null,
  y = 430,
}) {
  const lerp = (a, b, p) => a + (b - a) * p;
  const fs = lerp(84, 56, chipP);
  const unitGap = lerp(fs * 0.27, 34, chipP);

  let partIndex = -1;

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: y,
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      gap: unitGap,
    }}>
      {SENT_UNITS.map((unit, ui) => {
        const multi = unit.parts.length > 1;
        const outerChipA = multi ? chipP * (1 - splitP) : 0;
        const innerGap = multi ? splitP * 20 : 0;
        const marginLeft = unit.isPunc ? lerp(-unitGap, 0, chipP) : 0;
        return (
          <div key={ui} style={{
            display: 'flex', gap: innerGap, alignItems: 'flex-start',
            padding: `${10 * outerChipA}px ${22 * outerChipA}px`,
            borderRadius: 16,
            background: `rgba(${C.cardRGB},${outerChipA})`,
            border: `1.5px solid rgba(${C.lineRGB},${outerChipA})`,
            boxShadow: outerChipA > 0.02 ? `0 ${5 * outerChipA}px ${20 * outerChipA}px rgba(${C.inkRGB},${0.07 * outerChipA})` : 'none',
            marginLeft,
          }}>
            {unit.parts.map((part, pi) => {
              partIndex += 1;
              const k = partIndex;
              const revealed = clamp(typedChars - part.start, 0, part.t.length);
              const isTypingHere = caretOn && revealed < part.t.length && typedChars >= part.start;
              const isLastTyped = caretOn && typedChars >= SENT_TOTAL_CHARS && k === 5;
              const showCaret = isTypingHere || isLastTyped;
              const cp = multi ? chipP * splitP : chipP;

              // ID plate progress (staggered)
              const idP = idsT < 0 ? 0 : Easing.easeOutCubic(clamp((idsT - k * 0.18) / 0.55, 0, 1));

              // “token” tag: in after split, hands off to the ID plate
              let tagA = 0;
              if (tagT >= 0) {
                tagA = Easing.easeOutCubic(clamp((tagT - k * 0.12) / 0.45, 0, 1));
                if (idsT >= 0) tagA *= 1 - clamp((idsT - k * 0.18) / 0.2, 0, 1);
              }

              // subword pulse
              let pulse = 0;
              if (pulseT >= 0 && part.sub) {
                const pt = clamp(pulseT / 1.6, 0, 1);
                pulse = Math.sin(pt * Math.PI * 2) * Math.exp(-pt * 1.8);
                pulse = Math.max(0, pulse);
              }

              const dim = part.hero ? 1 : lerp(1, 0.28, dimP);

              return (
                <div key={pi} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: dim }}>
                  <div
                    ref={part.hero ? heroRef : null}
                    style={{
                      fontFamily: F.serif, fontSize: fs, fontWeight: 600, color: C.ink,
                      lineHeight: 1.25, whiteSpace: 'pre',
                      padding: `${lerp(0, 12, cp)}px ${lerp(0, 24, cp)}px`,
                      borderRadius: 14,
                      background: `rgba(${C.cardRGB},${cp})`,
                      border: `1.5px solid ${pulse > 0.02 ? `rgba(${C.accentRGB},${0.3 + 0.7 * pulse})` : `rgba(${C.lineRGB},${cp})`}`,
                      boxShadow: cp > 0.02
                        ? `0 ${5 * cp}px ${20 * cp}px rgba(${C.inkRGB},${0.07 * cp})${pulse > 0.02 ? `, 0 0 0 ${6 * pulse}px rgba(${C.accentRGB},${0.14 * pulse})` : ''}`
                        : 'none',
                      transform: `scale(${1 + pulse * 0.06})`,
                    }}>
                    {part.t.slice(0, revealed)}
                    {showCaret && (
                      <span style={{
                        display: 'inline-block', width: 5, height: '0.85em',
                        background: C.coral, marginLeft: 5,
                        verticalAlign: 'baseline', transform: 'translateY(0.12em)',
                        opacity: caretBlink,
                      }}></span>
                    )}
                  </div>
                  {idP > 0.01 ? (
                    <div style={{
                      marginTop: 20,
                      fontFamily: F.mono, fontSize: 28, fontWeight: 500,
                      color: C.cream,
                      background: part.hero ? C.coral : C.plate,
                      padding: '7px 18px', borderRadius: 10,
                      opacity: idP,
                      transform: `translateY(${(1 - idP) * -14}px)`,
                      fontVariantNumeric: 'tabular-nums',
                    }}>{part.id}</div>
                  ) : tagA > 0.01 ? (
                    <div style={{
                      marginTop: 22,
                      fontFamily: F.mono, fontSize: 21, color: C.inkSoft,
                      letterSpacing: '0.1em',
                      opacity: tagA,
                      transform: `translateY(${(1 - tagA) * 8}px)`,
                    }}>token</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  C, F, VEC, srand, cellColor, fmtNum, THEMES, applyTheme,
  fadeUp, windowAlpha, sceneAlpha,
  Kicker, Caption, TokenRow, SENT_UNITS, SENT_TOTAL_CHARS,
});
