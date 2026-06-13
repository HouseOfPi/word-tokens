// scenes-2.jsx — Scene 3: Embedding-matrix lookup → Scene 4: The vector (one continuous scene)
// Sprite window: 75–117.5s global. Local beats timed to voiceover:
//   P8 lookup 0–19 · P9 vector + 768 + model sizes 20–41.5

function SceneMatrixVector() {
  const { localTime: lt, duration } = useSprite();
  const alpha = sceneAlpha(lt, duration, 0.4, 0.9);
  const lerp = (a, b, p) => a + (b - a) * p;

  // phases
  const panelA = animate({ from: 0, to: 1, start: 0.6, end: 1.5, ease: Easing.easeOutCubic })(lt);
  const offset = animate({ from: 2493.2, to: 2543, start: 3.0, end: 9.5, ease: Easing.easeInOutQuart })(lt);
  const settled = lt >= 9.5;
  const E = animate({ from: 0, to: 1, start: 15.2, end: 17.2, ease: Easing.easeInOutCubic })(lt); // extraction
  const M = animate({ from: 0, to: 1, start: 20.3, end: 21.8, ease: Easing.easeInOutCubic })(lt); // morph to numbers
  const stripActive = lt >= 15.15;
  const matrixA = panelA * (1 - E);

  // geometry
  const COLS = 13,CW0 = 72,CH0 = 48,GAP0 = 8,PITCH = 64;
  const rowW = COLS * CW0 + (COLS - 1) * GAP0; // 1032
  const rowLeft = (1920 - rowW) / 2; // 444
  const clipTop = 216,clipH = 696,clipLeft = 270,clipW = 1380;

  const cellVal = (r, c) => r === 2543 && c < VEC.length ? VEC[c] : (srand(r, c) * 2 - 1) * 1.18;

  // rows to render
  const rows = [];
  if (matrixA > 0.01) {
    const base = Math.round(offset);
    for (let r = base - 7; r <= base + 7; r++) {
      const yC = 540 + (r - offset) * PITCH;
      if (yC < clipTop - 40 || yC > clipTop + clipH + 40) continue;
      rows.push({ r, yC });
    }
  }

  // strip geometry (matches in-matrix row at E=0)
  const cw = CW0 + 24 * E + 20 * M;
  const ch = CH0 + 40 * E + 62 * M;
  const gap = GAP0 + 2 * E + 4 * M;
  const stripW = COLS * cw + (COLS - 1) * gap;
  const stripLeft = (1920 - stripW) / 2;
  const stripTop = 540 - ch / 2;

  // highlight ring pulse — “go to its row”
  const ringA = windowAlpha(lt, 9.7, 14.8, 0.5, 0.6);

  const headerA = windowAlpha(lt, 0.9, 19.2, 0.7, 0.6);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha }}>
      <Kicker lt={lt} show={0.5} hide={19.6} num="03" text="Embedding lookup" />
      <Kicker lt={lt} show={20.2} hide={41.6} num="04" text="The vector" />

      {/* persistent header: cat → 2543 */}
      {headerA > 0 &&
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 138, textAlign: 'center', zIndex: 5,
        opacity: headerA, transform: `translateY(${(1 - headerA) * 10}px)`
      }}>
          <span style={{ fontFamily: F.serif, fontSize: 40, fontStyle: 'italic', fontWeight: 600, color: C.ink }}>“cat”</span>
          <span style={{ fontFamily: F.mono, fontSize: 32, color: C.inkSoft }}>  →  </span>
          <span style={{
          fontFamily: F.mono, fontSize: 30, fontWeight: 500, color: C.cream,
          background: C.coral, padding: '5px 16px', borderRadius: 9,
          fontVariantNumeric: 'tabular-nums', verticalAlign: '0.12em'
        }}>2543</span>
        </div>
      }

      {/* matrix (clipped window) */}
      {matrixA > 0.01 &&
      <div style={{
        position: 'absolute', left: clipLeft, top: clipTop, width: clipW, height: clipH,
        overflow: 'hidden', opacity: matrixA
      }}>
          {rows.map(({ r, yC }) => {
          const isHero = r === 2543;
          const hideHero = isHero && stripActive;
          return (
            <div key={r} style={{
              position: 'absolute', left: 0, top: yC - clipTop - CH0 / 2, width: '100%', height: CH0,
              opacity: hideHero ? 0 : 1
            }}>
                <div style={{
                position: 'absolute', left: 24, width: 130, top: 0, height: CH0,
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                fontFamily: F.mono, fontSize: 22, fontVariantNumeric: 'tabular-nums',
                color: isHero && settled ? C.coral : C.inkSoft,
                fontWeight: isHero && settled ? 600 : 400
              }}>{r}</div>
                {Array.from({ length: COLS }, (_, c) =>
              <div key={c} style={{
                position: 'absolute',
                left: rowLeft - clipLeft + c * (CW0 + GAP0), top: 0,
                width: CW0, height: CH0, borderRadius: 7,
                background: cellColor(cellVal(r, c))
              }}></div>
              )}
              </div>);

        })}

          {/* highlight ring on the hero row */}
          {ringA > 0 &&
        <div style={{
          position: 'absolute',
          left: rowLeft - clipLeft - 12, top: 540 + (2543 - offset) * PITCH - clipTop - CH0 / 2 - 9,
          width: rowW + 24, height: CH0 + 18,
          border: `3px solid ${C.coral}`, borderRadius: 13,
          opacity: ringA * (0.72 + 0.28 * Math.sin(lt * 5)),
          boxShadow: `0 0 0 7px rgba(${C.accentRGB},0.12)`
        }}></div>
        }

          {/* edge fades */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 110, background: `linear-gradient(${C.bg}, rgba(${C.bgRGB},0))`, pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 110, background: `linear-gradient(rgba(${C.bgRGB},0), ${C.bg})`, pointerEvents: 'none' }}></div>
        </div>
      }

      {/* extracted strip → vector */}
      {stripActive &&
      <div style={{ position: 'absolute', left: stripLeft, top: stripTop, height: ch, display: 'flex', gap }}>
          {Array.from({ length: COLS }, (_, i) => {
          const isEll = i === COLS - 1;
          const v = isEll ? 0.32 : VEC[i];
          const nP = Easing.easeOutQuart(clamp((lt - 21.2 - i * 0.12) / 0.9, 0, 1));
          const nA = clamp((lt - 21.2 - i * 0.12) / 0.3, 0, 1) * M;
          const bP = Easing.easeOutCubic(clamp((lt - 25.5 - i * 0.08) / 0.6, 0, 1));
          const shown = v * nP;
          return (
            <div key={i} style={{
              position: 'relative', width: cw, height: ch, borderRadius: 7 + 5 * M,
              background: `rgba(${C.cardRGB},${M})`,
              border: `1.5px solid rgba(${C.lineRGB},${M})`,
              boxShadow: E > 0.02 ? `0 ${8 * E}px ${22 * E}px rgba(${C.inkRGB},${0.08 * E})` : 'none',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: cellColor(v), opacity: 1 - 0.87 * M, borderRadius: 'inherit' }}></div>
                {M > 0.05 &&
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 16, opacity: nA
              }}>
                    {isEll ?
                <div style={{ fontFamily: F.mono, fontSize: 38, color: C.inkSoft }}>…</div> :

                <React.Fragment>
                        <div style={{
                    fontFamily: F.mono, fontSize: 29, fontWeight: 600, color: C.ink,
                    fontVariantNumeric: 'tabular-nums'
                  }}>{fmtNum(shown)}</div>
                        <div style={{ position: 'relative', width: 84, height: 10 }}>
                          <div style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: 10, marginLeft: -1, background: C.lineSoft }}></div>
                          <div style={{
                      position: 'absolute', left: '50%', top: 1, height: 8, borderRadius: 4,
                      width: Math.abs(v) / 1.2 * 42 * bP,
                      transform: v >= 0 ? 'none' : 'translateX(-100%)',
                      background: v >= 0 ? C.coral : C.slate
                    }}></div>
                        </div>
                      </React.Fragment>
                }
                  </div>
              }
              </div>);

        })}
        </div>
      }

      {/* row label during extraction */}
      {(() => {
        const a = windowAlpha(lt, 15.8, 20.6, 0.5, 0.5);
        return a > 0 ?
        <div style={{
          position: 'absolute', left: stripLeft + 4, top: stripTop - 52,
          fontFamily: F.mono, fontSize: 25, color: C.coral, fontWeight: 600, opacity: a
        }}>row 2543</div> :
        null;
      })()}

      {/* dimensions note — “seven hundred sixty-eight of them” */}
      {(() => {
        const a = windowAlpha(lt, 29.2, 41.4, 0.6, 0.6);
        return a > 0 ?
        <div style={{ ...{
            position: 'absolute', left: 0, right: 0, top: stripTop + ch + 44, textAlign: 'center',
            fontFamily: F.mono, fontSize: 27, color: C.inkSoft, opacity: a,
            transform: `translateY(${(1 - a) * 10}px)`, fontWeight: "800"
          }, color: "rgb(34, 32, 27)" }}>768 dimensions</div> :
        null;
      })()}

      {/* “…but that number depends on the model” — size comparison */}
      {(() => {
        const a = windowAlpha(lt, 32.2, 41.4, 0.7, 0.6);
        if (a <= 0) return null;
        const entries = [
          { name: 'this example', dims: 768, color: C.coral },
          { name: 'GPT-3', dims: 12288, color: C.slate },
        ];
        return (
          <div style={{
            position: 'absolute', left: '50%', top: stripTop + ch + 116, width: 980,
            transform: `translate(-50%, ${(1 - a) * 12}px)`, opacity: a,
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            {entries.map((e, k) => {
              const ea = Easing.easeOutCubic(clamp((lt - 32.6 - k * 0.9) / 0.7, 0, 1));
              const barW = Math.max(34, e.dims / 12288 * 560) * ea;
              return (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: ea }}>
                  <div style={{
                    width: 230, textAlign: 'right', fontFamily: F.mono, fontSize: 23, color: C.inkSoft,
                  }}>{e.name}</div>
                  <div style={{ width: barW, height: 16, borderRadius: 8, background: e.color, opacity: 0.8 }}></div>
                  <div style={{
                    fontFamily: F.mono, fontSize: 23, color: C.ink, fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                  }}>{e.dims.toLocaleString('en-US')} dimensions</div>
                </div>
              );
            })}
          </div>
        );
      })()}

      <Caption lt={lt} show={3.0} hide={14.2}>one row for every token in the vocabulary</Caption>
      <Caption lt={lt} show={21.5} hide={25.2}>the meaning of “cat”, written as numbers</Caption>
      <Caption lt={lt} show={25.8} hide={29.0}>each position holds one value — positive or negative</Caption>
      <Caption lt={lt} show={33.0} hide={37.6}>the number of dimensions depends on the model</Caption>
    </div>);

}

Object.assign(window, { SceneMatrixVector });
