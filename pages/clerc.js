import Nav from '@/components/Nav';
import { getConfig } from '@/lib/load';
import { readJson } from '@/lib/load';
import { useRouter } from 'next/router';

export async function getStaticProps(){
  const cfg = getConfig();
  const sub = readJson('11_clerc_ui_nav.json');
  return { props: { cfg, sub } };
}

export default function Clerc({ cfg, sub }) {
  const router = useRouter();
  const view = (router?.query?.view || sub?.clercc_nav?.default_view || 'records').toString();

  const rows = cfg?.clercSeed?.clerc_all_time_boys?.schools || [];

  const SubNav = () => (
    <div className="card" style={{display:'flex', gap:12, flexWrap:'wrap'}}>
      {(sub?.clercc_nav?.tabs || []).map(t => {
        const active = view === t.view;
        return (
          <a key={t.id}
             href={`/clerc?view=${t.view}`}
             className="badge"
             style={{
               background: active ? 'var(--primary)' : 'var(--surface2)',
               color: active ? '#001018' : 'var(--text)',
               textDecoration: 'none'
             }}>
            {t.label}
          </a>
        );
      })}
    </div>
  );

  return (
    <>
      <Nav />
      <div className="container">
        <h1 className="h1">Clerc Classic</h1>
        <SubNav />

        {view === 'records' && (
          <div className="card">
            <b>All-Time Records (Boys)</b>
            <table className="table">
              <thead>
                <tr><th>School</th><th>Tourn</th><th>Games</th><th>W</th><th>L</th><th>W%</th></tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.school_id}>
                    <td>{r.school_id.toUpperCase()}</td>
                    <td>{r.tournaments}</td>
                    <td>{r.games}</td>
                    <td>{r.wins}</td>
                    <td>{r.losses}</td>
                    <td>{(r.win_pct*100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{color:'var(--muted)'}}>Source: “Clerc Classic All‑Time Records” (user doc). Verification and additions coming soon.</p>
          </div>
        )}

        {view !== 'records' && (
          <div className="card">
            <b>{(sub?.clercc_nav?.tabs || []).find(t => t.view === view)?.label || 'Coming soon'}</b>
            <p style={{color:'var(--muted)'}}>This section is a placeholder to invite collaboration from schools and historians. Data before 2008 is especially welcome.</p>
          </div>
        )}
      </div>
    </>
  );
}
