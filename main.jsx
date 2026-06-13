// main.jsx — assembles the timeline

// Keeps data-screen-label in sync with the playhead (whole seconds)
function ScreenLabel({ children }) {
  const t = useTime();
  const sec = Math.floor(t);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.setAttribute('data-screen-label', `video t=${sec}s`);
  }, [sec]);
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }}>{children}</div>;
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "warm"
}/*EDITMODE-END*/;

const THEME_ORDER = ['warm', 'midnight', 'sage', 'indigo', 'paper'];
const THEME_NAMES = { warm: 'Warm cream', midnight: 'Midnight', sage: 'Sage', indigo: 'Indigo paper', paper: 'Paper white' };

// Always-visible in-page theme switcher (bottom-right corner)
function ThemeSwitcher({ theme, setTweak }) {
  const [open, setOpen] = React.useState(false);
  const [tweaksOn, setTweaksOn] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e.data && e.data.type;
      if (t === '__activate_edit_mode') setTweaksOn(true);
      else if (t === '__deactivate_edit_mode') { setTweaksOn(false); setOpen(false); }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  if (!tweaksOn) return null;
  return (
    <div style={{
      position: 'fixed', right: 18, bottom: 18, zIndex: 9000,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
      fontFamily: F.sans,
    }}>
      {open && (
        <div style={{
          background: 'rgba(20,20,20,0.92)', borderRadius: 14, padding: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
          boxShadow: '0 10px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
        }}>
          {THEME_ORDER.map((k) => (
            <button key={k} onClick={() => { setTweak('theme', k); }} style={{
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              background: theme === k ? 'rgba(255,255,255,0.14)' : 'transparent',
              border: '1px solid ' + (theme === k ? 'rgba(255,255,255,0.35)' : 'transparent'),
              borderRadius: 9, padding: '7px 12px',
            }}>
              <span style={{ display: 'flex', gap: 3 }}>
                {[THEMES[k].bg, THEMES[k].coral, THEMES[k].slate, THEMES[k].ink].map((c, i) => (
                  <span key={i} style={{ width: 14, height: 14, borderRadius: 7, background: c, border: '1px solid rgba(255,255,255,0.25)' }}></span>
                ))}
              </span>
              <span style={{ color: '#f3f0e8', fontSize: 13, fontWeight: theme === k ? 600 : 400 }}>{THEME_NAMES[k]}</span>
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        background: 'rgba(20,20,20,0.88)', color: '#f3f0e8',
        border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999,
        padding: '9px 16px', fontSize: 13, fontWeight: 500,
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
      }}>
        <span style={{ width: 12, height: 12, borderRadius: 6, background: THEMES[theme] ? THEMES[theme].coral : '#D97757' }}></span>
        {open ? 'Close' : 'Theme'}
      </button>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  applyTheme(t.theme);
  const swatches = THEME_ORDER.map((k) => [THEMES[k].bg, THEMES[k].coral, THEMES[k].slate, THEMES[k].ink]);
  const idx = Math.max(0, THEME_ORDER.indexOf(t.theme));
  return (
    <React.Fragment>
      <Stage width={1920} height={1080} duration={238} background={C.bg} persistKey="word-embedding-video" audioSrc="voiceover.mp3" musicSrc="music.mp3">
      <ScreenLabel>
        <Sprite start={0} end={15.15}><SceneTitle /></Sprite>
        <Sprite start={15.15} end={31}><ScenePipeline /></Sprite>
        <Sprite start={31} end={75.2}><SceneTokens /></Sprite>
        <Sprite start={75} end={117.5}><SceneMatrixVector /></Sprite>
        <Sprite start={117.5} end={135.4}><SceneLearnedValues /></Sprite>
        <Sprite start={135.4} end={155.4}><SceneDimensions /></Sprite>
        <Sprite start={155.4} end={181.2}><SceneFingerprint /></Sprite>
        <Sprite start={181.2} end={224.4}><SceneSpace /></Sprite>
        <Sprite start={224.4} end={238}><SceneRecap /></Sprite>
      </ScreenLabel>
      </Stage>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Color theme" />
        <TweakColor
          label={THEME_NAMES[t.theme] || 'Theme'}
          value={swatches[idx]}
          options={swatches}
          onChange={(v) => {
            const i = swatches.findIndex((s) => s.join() === (Array.isArray(v) ? v.join() : v));
            if (i >= 0) setTweak('theme', THEME_ORDER[i]);
          }}
        />
      </TweaksPanel>
      <ThemeSwitcher theme={t.theme} setTweak={setTweak} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
