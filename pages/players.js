// pages/players.js
import fs from 'fs';
import path from 'path';
import Nav from '@/components/Nav';
import { useMemo, useState } from 'react';

function loadSeasons() {
  const dir = path.join(process.cwd(), 'data', 'seasons');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      try { return JSON.parse(raw); } catch { return null; }
    })
    .filter(Boolean);
}

function buildIndex(seasons) {
  const byPlayer = new Map();

  for (const s of seasons) {
    const roster = Array.isArray(s.roster) ? s.roster : [];
    const stats = new Map(
      (Array.isArray(s.players_stats) ? s.players_stats : []).map(ps => [ps.player_id, ps])
    );

    for (const r of roster) {
      const pid = r.player_id ||
        `${s.school_id}_${(s.season||'').slice(0,4)}_${(r.number||'xx')}_${(r.player_name||'').toLowerCase().replace(/[^a-z0-9]+/g,'_')}`;

      const entry = byPlayer.get(pid) || {
        player_id: pid,
        name: r.player_name || 'Unknown',
        school_id: s.school_id,
        school_name: (s.school_id || '').toUpperCase(),
        positions: new Set(),
        class_years: new Set(),
        seasons: new Set(),
        jerseys: new Set(),
        career_summary: { gp: 0, pts: 0, reb: 0, ast: 0 }
      };

      entry.positions.add(r.position || '');
      entry.class_years.add(r.grade || '');
      entry.seasons.add(s.season);
      if (r.number != null) entry.jerseys.add(r.number);

      const ps = stats.get(pid);
      if (ps) {
        entry.career_summary.gp += Number(ps.gp || 0);
        entry.career_summary.pts += Number(ps.pts || 0);
        entry.career_summary.reb += Number(ps.reb || 0);
        entry.career_summary.ast += Number(ps.ast || ps.apg || 0);
      }
      byPlayer.set(pid, entry);
    }
  }

  const players = Array.from(byPlayer.values()).map(p => ({
    ...p,
    positions: Array.from(p.positions).filter(Boolean),
    class_years: Array.from(p.class_years).filter(Boolean),
    seasons: Array.from(p.seasons).filter(Boolean),
    jerseys: Array.from(p.jerseys)
  }));

  return { generated_at: new Date().toISOString(), players };
}

export async function getStaticProps() {
  const seasons = loadSeasons();
  const index = buildIndex(seasons);
  return { props: { index } };
}

export default function Players({ index }) {
  const [q, setQ] = useState('');
  const players = index.players || [];

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return players.slice(0, 100);
    return players.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.school_id?.toLowerCase().includes(term) ||
      p.school_name?.toLowerCase().includes(term) ||
      (p.positions||[]).join(' ').toLowerCase().includes(term) ||
      (p.seasons||[]).join(' ').toLowerCase().includes(term)
    ).slice(0, 200);
  }, [q, players]);

  return (
    <>
      <Nav />
      <div className="container">
        <h1 className="h1">Players <span className="badge">{players.length}</span></h1>
        <p className="h2">Search by name, school, position, or season.</p>

        <div className="card">
          <input
            type="search"
            placeholder="Search players… (e.g., 'Rivera MSD 2014' or 'G SR')"
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px',
              borderRadius: 8, border: '1px solid rgba(255,255,255,.12)',
              background: 'var(--surface2)', color: 'var(--text)'
            }}
            aria-label="Search players"
          />
        </div>

        <div className="card">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>School</th><th>Seasons</th><th>Pos</th><th>Career PTS</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.player_id}>
                  <td>{p.name}</td>
                  <td>{(p.school_name || p.school_id).toUpperCase()}</td>
                  <td>{(p.seasons || []).join(', ')}</td>
                  <td>{(p.positions || []).join('/')}</td>
                  <td>{p.career_summary?.pts ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{color:'var(--muted)'}}>Tip: Combine terms (e.g., <i>“msd 2016 g”</i>).</p>
        </div>
      </div>
    </>
  );
}
``
