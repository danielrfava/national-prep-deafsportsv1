// pages/teams.js
import Link from 'next/link';
import Nav from '@/components/Nav';
import { getConfig } from '@/lib/load';

export async function getStaticProps(){
  const cfg = getConfig();
  return { props: { schools: cfg.schools?.schools || [] } };
}

export default function Teams({ schools }) {
  return (
    <>
      <Nav />
      <div className="container">
        <h1 className="h1">Division I (Big 6) — Boys Basketball</h1>
        <div className="card">
          <ul>
            {schools.map(s => (
              <li key={s.id}>
                <b>{s.display_name}</b>
                <span className="badge">{s.short_name}</span>
                {' '}— <Link href={`/teams/${s.id}`}>View team page</Link>
              </li>
            ))}
          </ul>
        </div>
        <p style={{color:'var(--muted)'}}>
          Team pages list seasons (2008–present). Add rosters/schedules/stats inside each season JSON to light up details.
        </p>
      </div>
    </>
  );
}
