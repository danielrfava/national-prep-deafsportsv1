// pages/index.js
import Nav from '@/components/Nav';
import { getConfig } from '@/lib/load';

export async function getStaticProps() {
  const cfg = getConfig();
  return { props: { cfg } };
}

export default function HeadToHead({ cfg }) {
  const { h2hCfg, sample } = cfg;
  const sampleGames = sample?.games || [];

  return (
    <>
      <Nav />
      <div className="container">
        <h1 className="h1">
          Head to Head <span className="badge">Big 6</span>
        </h1>

        <p className="h2">
          Scope: Deaf schools only • 
          {h2hCfg?.default_time_window?.from ?? 'All time'} → Present
        </p>

        <div className="card">
          <b>Sample (from 10_sample_minimum.json)</b>

          <table className="table">
            <thead>
              <tr>
                <th>Date</th><th>Comp</th><th>Round</th>
                <th>Home</th><th>Score</th><th>Away</th>
              </tr>
            </thead>
            <tbody>
              {sampleGames.map(g => (
                <tr key={g.id}>
                  <td>{g.date}</td>
                  <td>{g.competition}</td>
                  <td>{g.round}</td>
                  <td>{g.home_id.toUpperCase()}</td>
                  <td>{g.home_score} - {g.away_score}</td>
                  <td>{g.away_id.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{color:'var(--muted)'}}>
            Real H2H matrix will fill once season/game JSON files begin populating.
          </p>
        </div>
      </div>
    </>
  );
}
