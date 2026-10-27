import { useMemo, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { EVENTS } from "./data.js";
import { Navbar, Hero, Filters, EventCard, EventDetail, HostForm, Community } from "./components.jsx";

// Returns true if event date falls in the chosen window.
const inWindow = (iso, when) => {
  if (!when) return true;
  const t = new Date(iso), now = new Date();
  const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = { Today: 1, "This Week": 7, "This Month": 30 }[when];
  return t >= sod && t < new Date(sod.getTime() + days * 864e5);
};

export default function App() {
  const [events, setEvents] = useState(EVENTS);
  const [filters, setFilters] = useState({ q: "", cat: "", when: "", mode: "" });
  const [selected, setSelected] = useState(null);
  const [hosting, setHosting] = useState(false);
  const [rsvps, setRsvps] = useState(new Set());
  const [dark, setDark] = useState(true);

  // Theme: Tailwind "class" strategy on <html>.
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  const toggleRsvp = (id) => setRsvps((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // Instant filtering: keyword + category + date window + mode.
  const visible = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return events
      .filter((e) => (!q || `${e.title} ${e.club} ${e.desc} ${e.location}`.toLowerCase().includes(q))
        && (!filters.cat || e.category === filters.cat)
        && (!filters.mode || e.mode === filters.mode)
        && inWindow(e.start, filters.when))
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  }, [events, filters]);

  return (
    <>
      <Navbar dark={dark} toggle={() => setDark(!dark)} onHost={() => setHosting(true)} />
      <Hero events={events} onOpen={setSelected} />
      <section id="events" className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-3xl font-bold tracking-tight">Find your next event</h2>
        <Filters f={filters} set={setFilters} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {visible.map((e) => <EventCard key={e.id} e={e} rsvped={rsvps.has(e.id)} onOpen={setSelected} onRsvp={toggleRsvp} />)}
          </AnimatePresence>
        </div>
        {!visible.length && <p className="mt-10 text-center text-zinc-500">No events match. Clear a filter or host one yourself.</p>}
      </section>
      <Community />
      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">Built for students, by students.</footer>
      <AnimatePresence>
        {selected && <EventDetail e={selected} rsvped={rsvps.has(selected.id)} onRsvp={toggleRsvp} onClose={() => setSelected(null)} />}
        {hosting && <HostForm onClose={() => setHosting(false)} onSubmit={(e) => { setEvents([e, ...events]); setHosting(false); }} />}
      </AnimatePresence>
    </>
  );
}
