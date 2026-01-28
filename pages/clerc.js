import Nav from '@/components/Nav';
import { getConfig, readJson } from '@/lib/load';
import { useRouter } from 'next/router';

export async function getStaticProps() {
  const cfg = getConfig();
  const sub = readJson('11_clerc_ui_nav.json');
  const championsDoc = readJson('12_clerc_champions.json') || { clerc_champions_boys: [] };
  const tourneyRecs = readJson('13_clerc_records_boys.json') || { clerc_records_boys: {} };

  return {
    props: {
      cfg,
      sub,
      champions: championsDoc.clerc_champions_boys,
      recs: tourneyRecs.clerc_records_boys,
      recsAsOf: tourneyRecs.as_of || null
    }
  };
}

export default function Clerc({ cfg, sub, champions, recs, recsAsOf }) {
  const router = useRouter();
  const defaultView = sub?.clercc_nav?.default_view || 'records';
  const view = (router?.query?.view || defaultView).toString();

  const allTimeRows = cfg?.clercSeed?.clerc_all_time_boys?.schools || [];
  const tabs = sub?.clercc_nav?.tabs || [];

  const SubNav = () => (
    <div className="card" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {tabs.map(t => {
        const active = view === t.view;
        return (
          <a
            key={t.id}
            href={`/clerc?view=${t.view}`}
            className="badge"
            style={{
              background: active ? 'var(--primary)' : 'var(--surface2)',
              color: active ? '#001018' : 'var(--text)',
              textDecoration: 'none'
            }}
          >
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
            <b>All‑Time Records (Boys) — By School</b>
            <table className="table">
              <thead>
                <tr>
                  <th>School</th><th>Tourn</th><th>Games</th><th>W</th><th>L</th><th>W%</th>
                </tr>
              </thead>
              <tbody>
                {allTimeRows.map(r => (
                  <tr key={r.school_id}>
                    <td>{r.school_id.toUpperCase()}</td>
                    <td>{r.tournaments}</td>
                    <td>{r.games}</td>
                    <td>{r.wins}</td>
                    <td>{r.losses}</td>
                    <td>{(r.win_pct * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'champions' && (
          <div className="card">
            <b>Champions by Year (Boys)</b>
            <table className="table">
              <thead>
                <tr><th>Year</th><th>Champion</th><th>Coach</th><th>Second</th><th>Third</th><th>Host</th></tr>
              </thead>
              <tbody>
                {champions.map(c => (
                  <tr key={c.year}>
                    <td>{c.year}</td>
                    <td>{c.champion ?? '—'}</td>
                    <td>{c.coach ?? '—'}</td>
                    <td>{c.second ?? '—'}</td>
                    <td>{c.third ?? '—'}</td>
                    <td>{c.host ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'tourney_records_boys' && (
          <div className="card">
            <b>Clerc Classic — Tournament Records (Boys)</b>
            <p style={{ color: 'var(--muted)' }}>As of {recsAsOf || 'latest provided'}</p>
            {/* Render detailed records here (you already have the JSON) */}
          </div>
        )}
      </div>
    </>
  );
}
