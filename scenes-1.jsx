// scenes-1.jsx — Scene 1: Title  ·  Scene 1.5: Pipeline  ·  Scene 2: Tokenization → Token IDs → Vocabulary
// Timed to voiceover: title 0–18 · pipeline 18–31 · tokens 31–75.2 (global)

// ── Scene 1 · Title (0–18s) ─────────────────────────────────────────────────
function SceneTitle() {
  const { localTime: lt, duration } = useSprite();
  const alpha = sceneAlpha(lt, duration, 0, 0.8);

  // faint drifting numbers in the background
  const bgNums = React.useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => ({
      x: srand(i, 11) * 1840 + 40,
      y: srand(i, 23) * 1040 + 20,
      v: (srand(i, 37) * 2 - 1) * 1.2,
      s: 20 + srand(i, 51) * 16,
      o: 0.05 + srand(i, 67) * 0.08,
      drift: 3 + srand(i, 83) * 5,
    }));
  }, []);

  const ruleW = animate({ from: 0, to: 230, start: 1.6, end: 2.5, ease: Easing.easeInOutCubic })(lt);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 + lt * 0.0025})`, transformOrigin: '50% 50%' }}>
        {bgNums.map((n, i) => (
          <div key={i} style={{
            position: 'absolute', left: n.x, top: n.y - lt * n.drift,
            fontFamily: F.mono, fontSize: n.s, color: C.ink, opacity: n.o,
            fontVariantNumeric: 'tabular-nums',
          }}>{fmtNum(n.v)}</div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 416, textAlign: 'center', ...fadeUp(lt, 0.7, 0.9, 26) }}>
        <div style={{ fontFamily: F.serif, fontSize: 88, fontWeight: 600, color: C.ink, letterSpacing: '-0.015em', whiteSpace: 'nowrap' }}>
          How AI Converts Words into Numbers
        </div>
      </div>

      <div style={{
        position: 'absolute', left: '50%', top: 556, height: 5, width: ruleW,
        transform: 'translateX(-50%)', background: C.coral, borderRadius: 3,
      }}></div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 606, textAlign: 'center', ...fadeUp(lt, 2.2, 0.8, 16) }}>
        <div style={{ fontFamily: F.mono, fontSize: 30, color: C.inkSoft, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          From words to vectors
        </div>
      </div>

      {/* P2 · “That’s exactly what we’re going to find out.” */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', ...fadeUp(lt, 12.0, 0.8, 14) }}>
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 36, color: C.inkSoft }}>
          let’s find out
        </div>
      </div>
    </div>
  );
}

// ── Scene 1.5 · The big picture: embedding happens BEFORE the LLM (18–31s) ──
function ScenePipeline() {
  const { localTime: lt, duration } = useSprite();
  const alpha = sceneAlpha(lt, duration, 0.5, 0.9);

  // camera dive into the embedding gate at the end
  const zoomP = animate({ from: 0, to: 1, start: 13.0, end: 15.4, ease: Easing.easeInCubic })(lt);
  const zoom = 1 + zoomP * 1.6;

  // flow choreography (delayed ~5s so the number strip emerges as the
  // voiceover says "comes out the other side as numbers")
  const cardX = animate({ from: 370, to: 810, start: 7.0, end: 9.2, ease: Easing.easeInOutCubic })(lt);
  const cardA = Math.min(
    Easing.easeOutCubic(clamp((lt - 0.6) / 0.6, 0, 1)),
    1 - clamp((lt - 8.8) / 0.5, 0, 1)
  );
  const stripX = animate({ from: 990, to: 1430, start: 9.4, end: 11.6, ease: Easing.easeInOutCubic })(lt);
  const stripA = Math.min(clamp((lt - 9.4) / 0.5, 0, 1), 1 - clamp((lt - 11.3) / 0.5, 0, 1));

  // pulses
  const gatePulse = Math.max(0, Math.sin(clamp((lt - 9.0) / 1.1, 0, 1) * Math.PI));
  const llmPulse = Math.max(0, Math.sin(clamp((lt - 11.4) / 1.2, 0, 1) * Math.PI));

  const stationA = (k) => Easing.easeOutCubic(clamp((lt - 0.6 - k * 0.3) / 0.7, 0, 1));

  const labelStyle = {
    fontFamily: F.mono, fontSize: 23, color: C.inkSoft,
    letterSpacing: '0.08em', textAlign: 'center', whiteSpace: 'nowrap',
  };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha }}>
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${zoom})`, transformOrigin: '870px 540px',
      }}>
        {/* flow line */}
        <div style={{
          position: 'absolute', left: 370, top: 539, width: 1150, height: 2,
          background: C.line, opacity: stationA(0) * 0.7,
        }}></div>

        {/* your text */}
        <div style={{ position: 'absolute', left: 370, top: 540, transform: 'translate(-50%, -50%)', opacity: stationA(0) }}>
          <div style={{
            position: 'absolute', left: '50%', top: '-50%', transform: `translate(calc(-50% + ${cardX - 370}px), -50%)`,
            opacity: cardA, background: C.panel, border: `1.5px solid ${C.line}`,
            borderRadius: 14, padding: '18px 28px', whiteSpace: 'nowrap',
            boxShadow: `0 6px 22px rgba(${C.inkRGB},0.08)`,
            fontFamily: F.serif, fontSize: 32, fontWeight: 600, color: C.ink,
          }}>The cat sat quietly.</div>
        </div>
        <div style={{ position: 'absolute', left: 370, top: 640, transform: 'translateX(-50%)', opacity: stationA(0), ...labelStyle }}>your text</div>

        {/* embedding gate */}
        <div style={{ position: 'absolute', left: 795, top: 420, width: 150, height: 240, opacity: stationA(1) }}>
          <div style={{
            width: '100%', height: '100%', background: C.panel, borderRadius: 20,
            border: `2px solid ${gatePulse > 0.02 ? C.coral : C.line}`,
            boxShadow: `0 8px 26px rgba(${C.inkRGB},0.09)${gatePulse > 0.02 ? `, 0 0 0 ${8 * gatePulse}px rgba(${C.accentRGB},${0.13 * gatePulse})` : ''}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            {[0.9, -0.5, 0.3].map((v, i) => (
              <div key={i} style={{ width: 64, height: 22, borderRadius: 6, background: cellColor(v) }}></div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 870, top: 692, transform: 'translateX(-50%)', opacity: stationA(1), ...labelStyle }}>
          embedding layer
        </div>

        {/* vector strip in transit */}
        {stripA > 0 && (
          <div style={{
            position: 'absolute', left: stripX, top: 540, transform: 'translate(-50%, -50%)',
            display: 'flex', gap: 7, opacity: stripA,
          }}>
            {VEC.slice(0, 5).map((v, i) => (
              <div key={i} style={{
                width: 38, height: 52, borderRadius: 8, background: cellColor(v),
                border: `1px solid ${C.lineSoft}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <span style={{
                  transform: 'rotate(-90deg)',
                  display: 'inline-block',
                  fontFamily: F.mono, fontSize: 10, fontWeight: 600, color: C.ink,
                  whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {fmtNum(v)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* the LLM */}
        <div style={{ position: 'absolute', left: 1330, top: 380, width: 380, height: 320, opacity: stationA(2) }}>
          <div style={{
            width: '100%', height: '100%', background: C.plate, borderRadius: 28,
            boxShadow: `0 14px 40px rgba(${C.inkRGB},0.22)${llmPulse > 0.02 ? `, 0 0 0 ${10 * llmPulse}px rgba(${C.accentRGB},${0.16 * llmPulse})` : ''}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22,
          }}>
            <div style={{ fontFamily: F.serif, fontSize: 76, fontWeight: 600, color: C.cream, letterSpacing: '0.02em' }}>LLM</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'center' }}>
              {[120, 168, 96].map((w, i) => (
                <div key={i} style={{ width: w, height: 5, borderRadius: 3, background: `rgba(${C.creamRGB},${0.22 + llmPulse * 0.3})` }}></div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 1520, top: 740, transform: 'translateX(-50%)', opacity: stationA(2), ...labelStyle }}>
          the model
        </div>
      </div>

      <Kicker lt={lt} show={0.6} hide={13.8} text="The big picture" />
      <Caption lt={lt} show={1.6} hide={11.0}>before the model can read anything, text must become numbers</Caption>
      <Caption lt={lt} show={11.6} hide={14.6}>let’s look inside the embedding layer</Caption>
    </div>
  );
}

// ── Scene 2 · Tokenization → Token IDs → Vocabulary (31–75.2s global) ───────
function SceneTokens() {
  const { localTime: lt, duration } = useSprite();
  const alpha = sceneAlpha(lt, duration, 0.4, 0.9);

  // typing — “It starts with a sentence.”
  const typedChars = Math.floor(animate({ from: 0, to: SENT_TOTAL_CHARS, start: 0.2, end: 1.8, ease: Easing.linear })(lt));
  const caretOn = lt >= 0.1 && lt <= 2.2;
  const caretBlink = (Math.floor(lt * 2.6) % 2) === 0 ? 1 : 0;

  // morph phases — “broken into pieces, called tokens” / “quietly → quiet + ly”
  const chipP  = animate({ from: 0, to: 1, start: 2.2, end: 3.5, ease: Easing.easeInOutCubic })(lt);
  const splitP = animate({ from: 0, to: 1, start: 7.2, end: 8.5, ease: Easing.easeInOutCubic })(lt);
  const pulseT = lt >= 8.8 && lt < 12.2 ? lt - 8.8 : -1;

  // IDs — “Notice each token got a number.”
  const idsT = lt >= 16.6 ? lt - 16.6 : -1;

  // “token” tags under each chip, once chips form
  const tagT = lt >= 3.8 ? lt - 3.8 : -1;

  const { playing } = useTimeline();
  const typingAudioRef = React.useRef(null);
  React.useEffect(() => {
    const a = new Audio('keyboard_typing.wav');
    a.preload = 'auto';
    typingAudioRef.current = a;
    return () => {
      a.pause();
      typingAudioRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const a = typingAudioRef.current;
    if (!a) return;
    const isMuted = localStorage.getItem('word-embedding-video:muted') === 'true';
    a.muted = isMuted;

    const inTypingWindow = lt >= 0.2 && lt <= 1.8;
    if (playing && inTypingWindow) {
      const targetTime = lt - 0.2;
      if (Math.abs(a.currentTime - targetTime) > 0.15) {
        a.currentTime = clamp(targetTime, 0, a.duration || 10);
      }
      if (a.paused) {
        a.play().catch(() => {});
      }
    } else {
      if (!a.paused) {
        a.pause();
      }
    }
  }, [lt, playing]);

  const scrollingAudioRef = React.useRef(null);
  React.useEffect(() => {
    const a = new Audio('scrolling.wav');
    a.preload = 'auto';
    a.loop = true;
    // Guard: if file fails to load, mark as broken so the playback effect skips it
    a.onerror = () => { a._broken = true; };
    scrollingAudioRef.current = a;
    return () => {
      a.pause();
      scrollingAudioRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const a = scrollingAudioRef.current;
    if (!a || a._broken) return;
    const isMuted = localStorage.getItem('word-embedding-video:muted') === 'true';
    a.muted = isMuted;

    // The fast scrolling animation occurs between local time 35.4s and 38.6s
    const inScrollWindow = lt >= 35.4 && lt <= 38.6;
    if (playing && inScrollWindow) {
      const elapsed = lt - 35.4;
      const targetTime = elapsed % (a.duration || 1.0);
      if (Math.abs(a.currentTime - targetTime) > 0.15) {
        a.currentTime = targetTime;
      }
      if (a.paused) {
        a.play().catch(() => {});
      }
    } else {
      if (!a.paused) {
        a.pause();
      }
    }
  }, [lt, playing]);

  // hero zoom + dim, leading into the matrix scene
  const zoomP = animate({ from: 0, to: 1, start: 42.6, end: 44.4, ease: Easing.easeInOutCubic })(lt);
  const dimP = zoomP;
  const scale = 1 + zoomP * 0.55;

  // measure hero chip center (canvas coords) once chips are settled
  const outerRef = React.useRef(null);
  const heroElRef = React.useRef(null);
  const [origin, setOrigin] = React.useState({ x: 760, y: 470 });
  const measuredRef = React.useRef(false);
  React.useEffect(() => {
    if (measuredRef.current) return;
    if (lt < 18.5 || !outerRef.current || !heroElRef.current) return;
    const o = outerRef.current.getBoundingClientRect();
    const h = heroElRef.current.getBoundingClientRect();
    if (o.width === 0) return;
    const k = o.width / 1920;
    setOrigin({
      x: (h.left + h.width / 2 - o.left) / k,
      y: (h.top + h.height / 2 - o.top) / k,
    });
    measuredRef.current = true;
  }, [lt > 18.5]);

  const tx = (960 - origin.x) * zoomP * 0.5;
  const ty = (520 - origin.y) * zoomP * 0.25;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha }}>
      <Kicker lt={lt} show={3.6} hide={15.9} num="01" text="Tokenization" />
      <Kicker lt={lt} show={16.5} hide={42.6} num="02" text="Token IDs" />

      <div ref={outerRef} style={{ position: 'absolute', inset: 0, transform: `translate(${tx}px, ${ty}px)` }}>
        <div style={{
          position: 'absolute', inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: `${origin.x}px ${origin.y}px`,
        }}>
          <TokenRow
            typedChars={typedChars}
            caretOn={caretOn}
            caretBlink={caretBlink}
            chipP={chipP}
            splitP={splitP}
            idsT={idsT}
            tagT={tagT}
            dimP={dimP}
            pulseT={pulseT}
            heroRef={heroElRef}
            y={370}
          />
        </div>
      </div>

      <Caption lt={lt} show={9.0} hide={13.0}>every piece — even the period — is a token</Caption>
      <Caption lt={lt} show={17.6} hide={20.8}>where do those numbers come from?</Caption>
      <Caption lt={lt} show={21.7} hide={27.0}>one numbered list of every token — fixed before training</Caption>
      {(() => {
        const show = 27.6, hide = 34.5;
        const a = windowAlpha(lt, show, hide, 0.55, 0.5);
        if (a <= 0) return null;
        const lead = lt - show;            // seconds since this callout appeared
        const cardE = Easing.easeOutCubic(clamp(lead / 0.55, 0, 1));
        return (
          <div style={{
            position: 'absolute', left: '50%', top: 902,
            transform: `translate(-50%, ${(1 - cardE) * 14}px)`,
            opacity: a * cardE,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: C.panel,
            border: `1.5px solid ${C.line}`,
            borderRadius: 18, padding: '22px 44px',
            boxShadow: `0 14px 44px rgba(${C.inkRGB},0.10)`,
            whiteSpace: 'nowrap',
          }}>
            <div style={{
              fontFamily: F.serif, fontSize: 32, fontStyle: 'italic', color: C.ink,
            }}>
              vocabulary &amp; token IDs are <span style={{ color: C.coral, fontStyle: 'normal', fontWeight: 600 }}>unique to each model</span>
            </div>
          </div>
        );
      })()}
      <Caption lt={lt} show={40.2} hide={43.4}>a token’s ID is simply its position in that list</Caption>

      {/* the vocabulary: a live scroll through the model's full token list */}
      {(() => {
        const a = windowAlpha(lt, 21.3, 43.0, 0.6, 0.5);
        if (a <= 0) return null;
        // slow crawl while the narrator explains, then the leap to 2543
        const crawl = animate({ from: 4, to: 48, start: 22.0, end: 35.2, ease: Easing.linear })(lt);
        const leap = animate({ from: 48, to: 2543, start: 35.4, end: 38.6, ease: Easing.easeInOutQuart })(lt);
        const scroll = lt < 35.3 ? crawl : leap;
        const settledV = lt >= 38.5;
        const PITCH = 44, ROWS_H = 4 * PITCH;
        const wordFor = (r) => {
          const real = {
            13: '.', 306: 'ly', 464: 'The',
            2536: 'carpet', 2537: 'carriage', 2538: 'carrot', 2539: 'carry', 2540: 'cars',
            2541: 'cart', 2542: 'castle', 2543: 'cat', 2544: 'catch', 2545: 'cattle',
            2546: 'caught', 2547: 'cause', 2548: 'cave', 2549: 'ceiling', 2550: 'cell',
            5810: 'quiet', 7826: 'sat',
          };
          if (real[r] != null) return real[r];
          if (r < 15) return '!"#$%&\'()*+,-./'.charAt(r);
          if (r < 95) return String.fromCharCode(97 + ((r - 15) % 26));
          const SYL = ['al','an','ba','be','bo','ca','co','da','de','en','er','es','fa','go','in','it','la','le','lo','ma','me','mi','na','ne','no','on','or','pa','ra','re','ro','sa','se','ta','te','ti','un','ur','ve','wa'];
          const n = 2 + Math.floor(srand(r, 7) * 2);
          let w = '';
          for (let i = 0; i < n; i++) w += SYL[Math.floor(srand(r, 13 + i) * SYL.length)];
          return w;
        };
        const rows = [];
        const base = Math.round(scroll);
        for (let r = base - 3; r <= base + 3; r++) {
          if (r < 0) continue;
          const y = ROWS_H / 2 + (r - scroll) * PITCH;
          if (y < -PITCH / 2 || y > ROWS_H + PITCH / 2) continue;
          rows.push({ r, y });
        }
        const thumbTop = clamp(scroll / 50257, 0, 1) * (ROWS_H - 40);
        return (
          <div style={{
            position: 'absolute', left: '50%', top: 590, width: 620,
            transform: `translate(-50%, ${(1 - a) * 20}px)`, opacity: a,
            background: C.panel, border: `1.5px solid ${C.line}`, borderRadius: 16,
            boxShadow: `0 8px 28px rgba(${C.inkRGB},0.08)`, padding: '14px 0 14px',
          }}>
            <div style={{ padding: '0 26px 12px', borderBottom: `1px solid ${C.lineSoft}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{
                  fontFamily: F.mono, fontSize: 19, color: C.inkSoft,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                }}>vocabulary</span>
                <span style={{
                  fontFamily: F.mono, fontSize: 19, color: settledV ? C.coral : C.inkSoft,
                  fontVariantNumeric: 'tabular-nums', fontWeight: settledV ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}>{Math.round(scroll).toLocaleString('en-US')} / 50,257</span>
              </div>

            </div>
            <div style={{ position: 'relative', height: ROWS_H, overflow: 'hidden', margin: '4px 0' }}>
              {rows.map(({ r, y }) => {
                const hero = settledV && r === 2543;
                return (
                  <div key={r} style={{
                    position: 'absolute', left: 12, right: 34, top: y - PITCH / 2, height: PITCH,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0 22px', borderRadius: 9,
                    background: hero ? `rgba(${C.accentRGB},0.13)` : 'transparent',
                  }}>
                    <span style={{
                      fontFamily: F.mono, fontSize: 23, fontVariantNumeric: 'tabular-nums',
                      color: hero ? C.coralDeep : C.inkSoft, fontWeight: hero ? 600 : 400,
                    }}>{r}</span>
                    <span style={{
                      fontFamily: F.serif, fontSize: 24, color: hero ? C.ink : C.inkSoft,
                      fontWeight: hero ? 600 : 400,
                    }}>{wordFor(r)}</span>
                  </div>
                );
              })}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 28, background: `linear-gradient(rgba(${C.cardRGB},1), rgba(${C.cardRGB},0))`, pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 28, background: `linear-gradient(rgba(${C.cardRGB},0), rgba(${C.cardRGB},1))`, pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', right: 14, top: 0, width: 8, height: ROWS_H, borderRadius: 4, background: C.lineSoft }}></div>
              <div style={{ position: 'absolute', right: 14, top: thumbTop, width: 8, height: 40, borderRadius: 4, background: settledV ? C.coral : C.inkSoft, opacity: 0.85 }}></div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

Object.assign(window, { SceneTitle, ScenePipeline, SceneTokens });
