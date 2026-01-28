// pages/teams.js
import Nav from '@/components/Nav';
import { getConfig } from '@/lib/load';

export async function getStaticProps() {
  const cfg = getConfig();
  return { props: { schools: cfg.schools?.schools || [] } };
}

export default function Teams({ schools }) {
  return (
    <>
      <Nav />
      <div className="container">
        <h1 className="h1">Division I (Big 6) Teams</h1>

        <div className="card">
          <ul>
            {schools.map(s => (
              <li key={s.id}>
                <b>{s.display_name}</b>
                <span className="badge">{s.short_name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
