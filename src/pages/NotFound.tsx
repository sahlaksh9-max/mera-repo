import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';

type GameId = 'clicker' | 'dodge' | 'type';

const STORAGE_KEY = '404_arcade_scores_v1';

const GAMES: Record<GameId, { name: string; emoji: string; desc: string; color: string }> = {
  clicker: { name: 'Click The Orb', emoji: '🟣', desc: 'Tap the orb as it jumps around for 30s', color: 'hsl(var(--gold))' },
  dodge:   { name: 'Dodge Blocks', emoji: '🟩', desc: 'Slide to dodge falling blocks', color: 'hsl(var(--crimson))' },
  type:    { name: 'Type Sprint',  emoji: '⌨️', desc: 'Type words fast for 30s', color: 'hsl(var(--royal))' },
};

type Scores = Record<GameId, number>;

export default function NotFound() {
  const [active, setActive] = useState<GameId | null>(null);
  const [scores, setScores] = useState<Scores>({ clicker: 0, dodge: 0, type: 0 });
  const [hydrated, setHydrated] = useState(false);
  const [lastScore, setLastScore] = useState<{ game: GameId; score: number } | null>(null);
  const [newHigh, setNewHigh] = useState(false);

  // Load existing scores
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Scores>;
        setScores(s => ({ ...s, ...parsed }));
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist scores
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  }, [scores, hydrated]);

  const totalHigh = useMemo(() => scores.clicker + scores.dodge + scores.type, [scores]);

  function recordScore(game: GameId, score: number) {
    setLastScore({ game, score });
    const isHigh = score > (scores[game] || 0);
    if (isHigh) {
      setScores(prev => ({ ...prev, [game]: score }));
      setNewHigh(true);
      setTimeout(() => setNewHigh(false), 1600);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-royal/5 to-crimson/10 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <header className="flex items-end justify-between gap-4 p-6 bg-gradient-to-r from-gold/10 via-royal/5 to-crimson/10 border-b border-border">
            <div>
              <div className="text-sm font-bold text-gold uppercase tracking-wider mb-2">404</div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Lost? Play a game while you're here.</h1>
              <p className="text-muted-foreground">That page doesn't exist. Have some fun, then jump back home.</p>
            </div>
            <div>
              <Link to="/" className="btn-royal px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                Go Home
              </Link>
            </div>
          </header>

          {/* Content */}
          <section className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 p-6">
            {/* Scoreboard */}
            <aside className="card-3d p-6">
              <h3 className="text-lg font-heading font-semibold mb-4 text-gradient-gold">High Scores</h3>
              <ul className="space-y-3 mb-4">
                {Object.keys(GAMES).map((k) => {
                  const id = k as GameId;
                  return (
                    <li key={id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                      <span className="flex items-center gap-3">
                        <span className="text-lg" aria-hidden>{GAMES[id].emoji}</span>
                        <span className="text-sm font-medium">{GAMES[id].name}</span>
                      </span>
                      <span className="font-bold text-gold">{scores[id] ?? 0}</span>
                    </li>
                  );
                })}
                <li className="flex items-center justify-between p-3 bg-gradient-to-r from-gold/10 to-crimson/10 rounded-lg border border-gold/30 font-bold">
                  <span>Total</span>
                  <span className="text-gold">{totalHigh}</span>
                </li>
              </ul>
              {lastScore && (
                <div className="text-sm text-muted-foreground mb-4">
                  Last: {GAMES[lastScore.game].name} — <b className="text-foreground">{lastScore.score}</b>
                </div>
              )}
              {newHigh && (
                <div className="bg-gradient-to-r from-gold/20 to-crimson/20 border border-gold/50 text-gold font-bold px-4 py-2 rounded-full text-sm animate-pulse">
                  🎉 New high score!
                </div>
              )}
            </aside>

            {/* Game Stage */}
            <main className="card-3d p-6 min-h-[420px] flex flex-col">
              {!active && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                  {(Object.keys(GAMES) as GameId[]).map(id => (
                    <button 
                      key={id} 
                      className="card-3d p-6 text-left hover:scale-105 transition-all duration-300 group"
                      onClick={() => setActive(id)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl group-hover:scale-110 transition-transform" aria-hidden>{GAMES[id].emoji}</span>
                        <span className="font-heading font-semibold text-gradient-gold">{GAMES[id].name}</span>
                      </div>
                      <div className="text-muted-foreground mb-4 text-sm">{GAMES[id].desc}</div>
                      <div className="text-sm text-muted-foreground">
                        High score: <b className="text-gold">{scores[id] ?? 0}</b>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {active && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6 p-4 bg-muted/20 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <span className="text-xl" aria-hidden>{GAMES[active].emoji}</span>
                      <div>
                        <div className="font-heading font-semibold text-gradient-gold">{GAMES[active].name}</div>
                        <div className="text-sm text-muted-foreground">{GAMES[active].desc}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="btn-ghost px-4 py-2 rounded-lg" onClick={() => setActive(null)}>
                        Change game
                      </button>
                      <Link to="/" className="btn-gold px-4 py-2 rounded-lg">
                        Go Home
                      </Link>
                    </div>
                  </div>

                  <div className="flex-1 card-3d p-6 bg-gradient-to-br from-muted/5 to-muted/20">
                    {active === 'clicker' && <ClickTheOrb onEnd={(s) => recordScore('clicker', s)} />}
                    {active === 'dodge' && <DodgeBlocks onEnd={(s) => recordScore('dodge', s)} />}
                    {active === 'type' && <TypeSprint onEnd={(s) => recordScore('type', s)} />}
                  </div>
                </div>
              )}
            </main>
          </section>
        </div>
      </div>
    </>
  );
}

/* =============================
   Game 1: Click The Orb
   ============================= */

function ClickTheOrb({ onEnd }: { onEnd: (score: number) => void }) {
  const DURATION = 30;
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [pos, setPos] = useState({ x: 120, y: 100 });
  const boardRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<number | null>(null);
  const moveRef = useRef<number | null>(null);

  useEffect(() => () => { clearTimers(); }, []);

  function clearTimers() {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    if (moveRef.current) { clearInterval(moveRef.current); moveRef.current = null; }
  }

  function randomPos() {
    const el = boardRef.current;
    if (!el) return { x: 120, y: 100 };
    const rect = el.getBoundingClientRect();
    const r = 17; // radius
    const x = Math.random() * (rect.width - r * 2) + r;
    const y = Math.random() * (rect.height - r * 2) + r;
    return { x, y };
  }

  function start() {
    setScore(0);
    setTimeLeft(DURATION);
    setPos(randomPos());
    setRunning(true);

    clearTimers();
    tickRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          end();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Move orb every 900ms, a bit faster over time
    let step = 900;
    moveRef.current = window.setInterval(() => {
      setPos(randomPos());
      step = Math.max(380, step - 10);
      if (moveRef.current) {
        clearInterval(moveRef.current);
        moveRef.current = window.setInterval(() => setPos(randomPos()), step);
      }
    }, step);
  }

  function end() {
    clearTimers();
    setRunning(false);
    onEnd(score);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="bg-muted/30 px-3 py-1 rounded-full border border-border">Score: {score}</div>
        <div className="bg-muted/30 px-3 py-1 rounded-full border border-border">Time: {timeLeft}s</div>
      </div>

      <div 
        ref={boardRef} 
        className="relative w-full aspect-[1.2/1] bg-gradient-to-br from-royal/10 via-background to-crimson/10 border border-border rounded-xl overflow-hidden cursor-crosshair"
        onClick={() => running && setScore(s => Math.max(0, s - 1))}
      >
        {running ? (
          <button
            className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 via-purple-500 to-purple-700 shadow-lg hover:scale-110 transition-transform cursor-pointer animate-pulse"
            style={{ left: pos.x - 16, top: pos.y - 16 }}
            onClick={(e) => { e.stopPropagation(); setScore(s => s + 1); setPos(randomPos()); }}
            aria-label="Click the orb"
            title="Click me!"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="mb-4">Click the orb as many times as you can in 30 seconds.</div>
            <button className="btn-gold px-6 py-3 rounded-xl font-semibold mb-2" onClick={start}>Start</button>
            <div className="text-sm text-muted-foreground">Tip: misses subtract 1 point</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =============================
   Game 2: Dodge Blocks
   ============================= */

function DodgeBlocks({ onEnd }: { onEnd: (score: number) => void }) {
  const W = 520, H = 320;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [bestThisRun, setBestThisRun] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const keys = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  useEffect(() => () => stop(), []);

  function start() {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    setRunning(true);
    setScore(0);
    setBestThisRun(0);

    let playerX = W / 2, playerY = H - 26, playerW = 46, playerH = 12;
    let speed = 2.2, laneSpeed = 2.6;
    let last = performance.now();
    startRef.current = last;
    let elapsed = 0, spawnGap = 900, lastSpawn = 0;
    const blocks: { x: number; y: number; w: number; h: number }[] = [];

    function spawn() {
      const w = 32 + Math.random() * 42;
      const x = Math.random() * (W - w);
      const h = 12 + Math.random() * 10;
      blocks.push({ x, y: -h - 10, w, h });
    }

    function collide(a: any, b: any) {
      return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
    }

    function loop(t: number) {
      const dt = Math.min(40, t - last); last = t;
      elapsed = t - startRef.current;

      const diffBoost = Math.min(2.2, elapsed / 20000);
      laneSpeed = 2.8 + diffBoost;
      spawnGap = Math.max(420, 900 - elapsed / 10);

      const accel = 0.12;
      if (keys.current.left) playerX -= speed + accel * dt;
      if (keys.current.right) playerX += speed + accel * dt;
      playerX = Math.max(0, Math.min(W - playerW, playerX));

      if (t - lastSpawn > spawnGap) {
        lastSpawn = t;
        spawn();
      }

      for (let i = blocks.length - 1; i >= 0; i--) {
        blocks[i].y += laneSpeed + (dt * 0.02);
        if (blocks[i].y > H + 30) blocks.splice(i, 1);
      }

      if (ctx) {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        if (cvs.width !== W * dpr) {
          cvs.width = W * dpr; cvs.height = H * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);

        ctx.fillStyle = '#0a0f22';
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(255,255,255,.06)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 26) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }

        ctx.fillStyle = 'hsl(var(--gold))';
        roundRect(ctx, playerX, playerY, playerW, playerH, 6, true);

        ctx.fillStyle = 'hsl(var(--crimson))';
        blocks.forEach(b => roundRect(ctx, b.x, b.y, b.w, b.h, 6, true));
      }

      const player = { x: playerX, y: playerY, w: playerW, h: playerH };
      for (const b of blocks) {
        if (collide(player, b)) {
          stop();
          onEnd(Math.max(0, Math.floor(elapsed / 100)));
          return;
        }
      }

      const sc = Math.max(0, Math.floor(elapsed / 100));
      if (sc !== score) {
        setScore(sc);
        setBestThisRun(prev => Math.max(prev, sc));
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    rafRef.current = requestAnimationFrame(loop);

    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.current.left = true;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.current.right = true;
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.current.left = false;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.current.right = false;
    }

    function stop() {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setRunning(false);
    }

    (DodgeBlocks as any).stop = stop;
  }

  function stop() {
    const s = (DodgeBlocks as any).stop;
    if (s) s();
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="bg-muted/30 px-3 py-1 rounded-full border border-border">Score: {score}</div>
        <div className="bg-muted/30 px-3 py-1 rounded-full border border-border">Best: {bestThisRun}</div>
      </div>
      <div className="flex flex-col items-center">
        <canvas ref={canvasRef} className="w-full max-w-lg aspect-[1.625/1] bg-gradient-to-b from-background to-muted/20 border border-border rounded-xl" width={520} height={320} />
        {!running ? (
          <div className="mt-4 text-center">
            <button className="btn-gold px-6 py-3 rounded-xl font-semibold mb-3" onClick={start}>Start</button>
            <div className="text-sm text-muted-foreground mb-3">Controls: ← → or A / D</div>
            <div className="flex gap-3">
              <button className="bg-muted/30 border border-border px-4 py-2 rounded-lg" onPointerDown={() => (keys.current.left = true)} onPointerUp={() => (keys.current.left = false)}>◀</button>
              <button className="bg-muted/30 border border-border px-4 py-2 rounded-lg" onPointerDown={() => (keys.current.right = true)} onPointerUp={() => (keys.current.right = false)}>▶</button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-muted-foreground">Dodge the red blocks!</div>
        )}
      </div>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill = false) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  if (fill) ctx.fill();
}

/* =============================
   Game 3: Type Sprint
   ============================= */

const WORDS = [
  'code','logic','state','array','react','route','page','async','await','debug',
  'click','score','mouse','track','swift','pixel','frame','input','output','stack',
  'royal','academy','student','learn','study','class','grade','school','teach','excel'
];

function TypeSprint({ onEnd }: { onEnd: (score: number) => void }) {
  const DURATION = 30;
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [word, setWord] = useState('');
  const [typed, setTyped] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function nextWord() {
    const w = WORDS[(Math.random() * WORDS.length) | 0];
    setWord(w);
    setTyped('');
  }

  function start() {
    setScore(0);
    setTimeLeft(DURATION);
    nextWord();
    setRunning(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          end();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function end() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
    onEnd(score);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.toLowerCase();
    if (!running) return setTyped(v);
    setTyped(v);
    if (v === word) {
      setScore(s => s + 1);
      nextWord();
    }
  }

  const correct = useMemo(() => {
    let i = 0;
    while (i < typed.length && typed[i] === word[i]) i++;
    return i;
  }, [typed, word]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="bg-muted/30 px-3 py-1 rounded-full border border-border">Score: {score}</div>
        <div className="bg-muted/30 px-3 py-1 rounded-full border border-border">Time: {timeLeft}s</div>
      </div>
      <div className="w-full max-w-lg mx-auto">
        {!running ? (
          <div className="text-center p-8 bg-gradient-to-br from-royal/10 via-background to-crimson/10 border border-border rounded-xl">
            <div className="mb-4">Type as many words as you can in 30 seconds.</div>
            <button className="btn-gold px-6 py-3 rounded-xl font-semibold mb-2" onClick={start}>Start</button>
            <div className="text-sm text-muted-foreground">Click start then type!</div>
          </div>
        ) : (
          <div className="text-center p-8 bg-gradient-to-br from-royal/10 via-background to-crimson/10 border border-border rounded-xl">
            <div className="text-3xl font-bold mb-6 font-mono" aria-live="polite">
              <span className="text-gold">{word.slice(0, correct)}</span>
              <span className="text-muted-foreground">{word.slice(correct)}</span>
            </div>
            <input
              ref={inputRef}
              className="w-full p-4 bg-background border border-border rounded-lg text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-gold"
              value={typed}
              onChange={onChange}
              placeholder="type here..."
              autoCapitalize="off" 
              autoCorrect="off" 
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
