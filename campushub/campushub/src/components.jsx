import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, X, Sun, Moon, Plus, Users, Trophy, Check, ChevronLeft, ChevronRight, Flame, BookOpen } from "lucide-react";
import { CATEGORIES, MODES, CHAPTERS, PATHS, CONTRIBUTORS } from "./data.js";

/* ---------- helpers ---------- */
export const fmtDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

// Builds an "Add to Google Calendar" deep link (no API key needed).
export const gcalUrl = (e) => {
  const z = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const s = new Date(e.start), end = new Date(s.getTime() + e.hours * 3600e3);
  const q = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${z(s)}/${z(end)}`, details: e.desc, location: e.location });
  return `https://calendar.google.com/calendar/render?${q}`;
};

const CAT_STYLE = {
  Hackathons: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
  Workshops: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  "Cultural Programs": "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  "Tech Meetups": "bg-sky-500/15 text-sky-700 dark:text-sky-300",
};
export const Badge = ({ cat }) => <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CAT_STYLE[cat]}`}>{cat}</span>;

/* ---------- Navbar ---------- */
export function Navbar({ dark, toggle, onHost }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="text-lg font-bold tracking-tight">Campus<span className="text-indigo-500">Hub</span></a>
        <nav className="hidden gap-6 text-sm text-zinc-500 sm:flex dark:text-zinc-400">
          <a href="#events" className="hover:text-indigo-500">Events</a>
          <a href="#community" className="hover:text-indigo-500">Community</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onHost} className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400">
            <Plus size={16} /> Host an event
          </button>
          <button onClick={toggle} aria-label="Toggle theme" className="rounded-lg border border-zinc-300 p-2 hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero: headline, animated stats, featured spotlight carousel ---------- */
function Counter({ to }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, t0;
    const tick = (t) => { t0 ??= t; const p = Math.min((t - t0) / 1200, 1); setN(Math.round(to * p)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}</>;
}

export function Hero({ events, onOpen }) {
  const featured = events.filter((e) => e.featured);
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % featured.length), 6000); return () => clearInterval(t); }, [featured.length]);
  const f = featured[i % featured.length];
  const stats = [[events.length, "Active events"], [24, "Student chapters"], [57, "Hackathons hosted"]];
  return (
    <section id="top" className="mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-14 lg:grid-cols-2 lg:items-center">
      <div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Discover, Learn, and Build Together.
        </motion.h1>
        <p className="mt-5 max-w-md text-zinc-600 dark:text-zinc-400">Find hackathons, workshops, and meetups across campuses, then host your own in two minutes.</p>
        <a href="#events" className="mt-6 inline-block rounded-lg bg-teal-400 px-5 py-3 font-medium text-zinc-950 hover:bg-teal-300">Browse events</a>
        <dl className="mt-10 flex gap-8">
          {stats.map(([v, l]) => (
            <div key={l}><dt className="text-3xl font-bold text-indigo-500"><Counter to={v} />+</dt><dd className="text-sm text-zinc-500">{l}</dd></div>
          ))}
        </dl>
      </div>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.button key={f.id} onClick={() => onOpen(f)} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="block w-full rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 p-7 text-left text-white shadow-xl shadow-indigo-500/20">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">Spotlight: {f.category}</span>
            <h3 className="mt-4 text-2xl font-bold sm:text-3xl">{f.title}</h3>
            <p className="mt-2 text-white/85">{f.club}</p>
            <p className="mt-6 flex items-center gap-2 text-sm"><Calendar size={16} />{fmtDate(f.start)}</p>
            <p className="mt-1 flex items-center gap-2 text-sm"><MapPin size={16} />{f.location}</p>
          </motion.button>
        </AnimatePresence>
        <div className="mt-3 flex justify-end gap-2">
          <button aria-label="Previous" onClick={() => setI((i + featured.length - 1) % featured.length)} className="rounded-full border border-zinc-300 p-2 dark:border-zinc-700"><ChevronLeft size={16} /></button>
          <button aria-label="Next" onClick={() => setI((i + 1) % featured.length)} className="rounded-full border border-zinc-300 p-2 dark:border-zinc-700"><ChevronRight size={16} /></button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Filters ---------- */
const Chip = ({ active, children, ...p }) => (
  <button {...p} className={`rounded-full border px-3.5 py-1.5 text-sm transition ${active ? "border-indigo-500 bg-indigo-500 text-white" : "border-zinc-300 hover:border-indigo-400 dark:border-zinc-700"}`}>{children}</button>
);

export function Filters({ f, set }) {
  const toggle = (k, v) => set({ ...f, [k]: f[k] === v ? "" : v });
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input value={f.q} onChange={(e) => set({ ...f, q: e.target.value })} placeholder="Search events, clubs, or topics"
          className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900" />
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => <Chip key={c} active={f.cat === c} onClick={() => toggle("cat", c)}>{c}</Chip>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {["Today", "This Week", "This Month"].map((w) => <Chip key={w} active={f.when === w} onClick={() => toggle("when", w)}>{w}</Chip>)}
        <span className="mx-1 hidden w-px bg-zinc-300 sm:block dark:bg-zinc-700" />
        {MODES.map((m) => <Chip key={m} active={f.mode === m} onClick={() => toggle("mode", m)}>{m}</Chip>)}
      </div>
    </div>
  );
}

/* ---------- Event card ---------- */
export function EventCard({ e, rsvped, onOpen, onRsvp }) {
  return (
    <motion.article layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between"><Badge cat={e.category} /><span className="text-xs text-zinc-500">{e.mode}</span></div>
      <h3 onClick={() => onOpen(e)} className="mt-3 cursor-pointer text-lg font-bold leading-snug hover:text-indigo-500">{e.title}</h3>
      <p className="text-sm text-zinc-500">{e.club}</p>
      <div className="mt-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
        <p className="flex items-center gap-2"><Calendar size={14} />{fmtDate(e.start)}</p>
        <p className="flex items-center gap-2"><MapPin size={14} />{e.location}</p>
      </div>
      <div className="mt-5 flex gap-2">
        <button onClick={() => onRsvp(e.id)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${rsvped ? "bg-teal-400/20 text-teal-600 dark:text-teal-300" : "bg-indigo-500 text-white hover:bg-indigo-400"}`}>
          {rsvped ? <span className="inline-flex items-center gap-1"><Check size={14} /> Registered</span> : "Register"}
        </button>
        <button onClick={() => onOpen(e)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Details</button>
      </div>
    </motion.article>
  );
}

/* ---------- Generic modal ---------- */
export function Modal({ onClose, children }) {
  useEffect(() => { const k = (ev) => ev.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <motion.div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl dark:bg-zinc-900">
        <button onClick={onClose} aria-label="Close" className="float-right rounded-lg p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"><X size={20} /></button>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Event detail ---------- */
export function EventDetail({ e, rsvped, onRsvp, onClose }) {
  return (
    <Modal onClose={onClose}>
      <Badge cat={e.category} />
      <h2 className="mt-3 text-2xl font-bold">{e.title}</h2>
      <p className="text-zinc-500">{e.club} · {e.mode}</p>
      <p className="mt-4 text-zinc-700 dark:text-zinc-300">{e.desc}</p>
      <h3 className="mt-5 font-bold">Before you come</h3>
      <ul className="mt-1 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">{e.prereq.map((p) => <li key={p}>{p}</li>)}</ul>
      <h3 className="mt-5 font-bold">Speakers and mentors</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {e.speakers.map((s) => (
          <div key={s.name} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-500 font-bold text-white">{s.name[0]}</div>
            <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-zinc-500">{s.role}</p></div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-zinc-500">{fmtDate(e.start)} · {e.location}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onRsvp(e.id)} className={`rounded-lg px-4 py-2 font-medium ${rsvped ? "bg-teal-400/20 text-teal-600 dark:text-teal-300" : "bg-indigo-500 text-white hover:bg-indigo-400"}`}>{rsvped ? "Registered" : "Register"}</button>
        <a href={gcalUrl(e)} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-300 px-4 py-2 font-medium dark:border-zinc-700">Add to Google Calendar</a>
      </div>
    </Modal>
  );
}

/* ---------- Host an event ---------- */
export function HostForm({ onSubmit, onClose }) {
  const [v, setV] = useState({ title: "", club: "", category: CATEGORIES[0], mode: MODES[1], date: "", time: "10:00", location: "", desc: "" });
  const up = (k) => (ev) => setV({ ...v, [k]: ev.target.value });
  const input = "mt-1 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-indigo-500 dark:border-zinc-700";
  const submit = (ev) => {
    ev.preventDefault();
    onSubmit({ ...v, id: Date.now(), start: new Date(`${v.date}T${v.time}`).toISOString(), hours: 2, prereq: ["Open to all"], speakers: [{ name: v.club, role: "Organizer" }] });
  };
  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold">Host an event</h2>
      <p className="text-sm text-zinc-500">Your event goes live on the list right away.</p>
      <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm">Event title<input required className={input} value={v.title} onChange={up("title")} /></label>
        <label className="text-sm">Club or organizer<input required className={input} value={v.club} onChange={up("club")} /></label>
        <label className="text-sm">Location or link<input required className={input} value={v.location} onChange={up("location")} /></label>
        <label className="text-sm">Category<select className={input} value={v.category} onChange={up("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-sm">Mode<select className={input} value={v.mode} onChange={up("mode")}>{MODES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-sm">Date<input required type="date" className={input} value={v.date} onChange={up("date")} /></label>
        <label className="text-sm">Time<input required type="time" className={input} value={v.time} onChange={up("time")} /></label>
        <label className="sm:col-span-2 text-sm">Description<textarea required rows={3} className={input} value={v.desc} onChange={up("desc")} /></label>
        <button className="sm:col-span-2 rounded-lg bg-indigo-500 py-2.5 font-medium text-white hover:bg-indigo-400">Publish event</button>
      </form>
    </Modal>
  );
}

/* ---------- Community: chapter leaderboard, learning paths, top contributors ---------- */
export function Community() {
  return (
    <section id="community" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-3xl font-bold tracking-tight">Learn and build with your chapter</h2>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800 lg:col-span-1">
          <h3 className="flex items-center gap-2 font-bold"><Trophy size={18} className="text-orange-500" />Chapter leaderboard</h3>
          <ol className="mt-4 space-y-3">
            {CHAPTERS.map((c, i) => (
              <li key={c.name} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-500/15 font-bold text-indigo-500">{i + 1}</span>
                <div className="flex-1"><p className="font-medium">{c.name}</p><p className="flex items-center gap-1 text-xs text-zinc-500"><Users size={12} />{c.members} members · <Flame size={12} />{c.streak}</p></div>
                <span className="font-bold text-teal-500">{c.points}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800 lg:col-span-1">
          <h3 className="flex items-center gap-2 font-bold"><BookOpen size={18} className="text-teal-500" />Learning paths</h3>
          <div className="mt-4 space-y-4">
            {PATHS.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm"><span className="font-medium">{p.name}</span><span className="text-zinc-500">{p.learners} learners</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.progress}%` }} viewport={{ once: true }} className="h-full bg-gradient-to-r from-indigo-500 to-teal-400" />
                </div>
                <p className="mt-1 text-xs text-zinc-500">{p.steps} steps</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800 lg:col-span-1">
          <h3 className="font-bold">Top contributors this month</h3>
          <ul className="mt-4 space-y-3">
            {CONTRIBUTORS.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-orange-500 font-bold text-white">{c.name[0]}</div>
                <div className="flex-1"><p className="font-medium">{c.name}</p><p className="text-xs text-zinc-500">{c.badge}</p></div>
                <span className="font-bold">{c.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
