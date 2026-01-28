// pages/rankings.js
import Nav from '@/components/Nav';
import { getConfig, listSeasons } from '@/lib/load';

export async function getStaticProps() {
  const cfg = getConfig();
  const seasonFiles = listSeasons();
  return { props: { cfg, seasonFiles } };
}

export default function Rankings({ cfg, seasonFiles }) {
  const { rankings } = cfg.rankingsCfg;

  const w = rankings.weights;

  return (
    <>
      <Nav />
      <div className="container">
        <h1 className="h1">Rankings (Deaf Only)</h1>

        <div className="card">
          <div>Window default: {rankings.season_window_default.from} → {rankings.season_window_default.to}</div>
          <div>
            Weights:
            W% {w.overall_win_pct * 100}% •
            H2H {w.big6_head_to_head * 100}% •
            Tournaments {w.tournament_weight * 100}% •
            SOS {w.sos_background * 100}%
          </div>
        </div>

        <div className="card">
          <b>Seasons detected:</b>
          <ul>
            {seasonFiles.map(s => <li key={s}>{s}</li>)}
          </ul>
          <p style={{color:'var(--muted)'}}>
            Rankings engine activates once you add season files in /data/seasons.
          </p>
        </div>
      </div>
    </>
  );
}
