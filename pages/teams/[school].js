// pages/teams/[school].js
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { readJson } from '@/lib/load';

export async function getStaticPaths() {
  const schools = (readJson('01_schools.json')?.schools) || [];
  const paths = schools.map(s => ({ params: { school: s.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const schoolId = params.school;
  const schools = readJson('01_schools.json')?.schools || [];
  const school = schools.find(s => s.id === schoolId) || { id: schoolId, display_name: schoolId.toUpperCase() };

  // Collect all season files for this school
  const dir = path.join(process.cwd(), 'data', 'seasons');
  const exists = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const seasonFiles = exists.filter(f => f.startsWith(`${schoolId}_`) && f.endsWith('.json'));

  // Parse minimal info
  const seasons = seasonFiles.map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
    try {
      const j = JSON.parse(raw);
      return {
        file: f,
        season: j.season,
        coach: j.coach || '',
        wins: j.overall_record?.wins ?? 0,
        losses: j.overall_record?.losses ?? 0,
        rosterCount: Array.isArray(j.roster) ? j.roster.length : 0,
        scheduleCount: Array.isArray(j.schedule) ? j.schedule.length : 0
      };
    } catch {
      return { file: f, season: '(invalid json)', coach: '', wins: 0, losses: 0, rosterCount: 0, scheduleCount: 0 };
    }
  }).sort((a,b) => (a.season > b.season ? -1 : 1));

  return { props: { school, seasons } };
}

export default function TeamPage({ school, seasons }) {
  return (
    <>
      <Nav />
      <div className="container">
        <h1 className="h1">{school.display_name} <span className="badge">Boys Varsity</span></h1>

        <div className="card">
          <b>Seasons (2008–present)</b>
          <table className="table">
            <thead>
              <tr><th>Season</th><th>Coach</th><th>Record</th><th>Roster</th><th>Games</th></tr>
            </thead>
            <tbody>
              {seasons.map(s => (
                <tr key={s.file}>
                  <td>{s.season}</td>
                  <td>{s.coach || '—'}</td>
                  <td>{s.wins}-{s.losses}</td>
                  <td>{s.rosterCount}</td>
                  <td>{s.scheduleCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{color:'var(--muted)'}}>
            Add roster entries and games to each season JSON to populate counts and enable player search.
          </p>
        </div>

        <div className="card" style={{color:'var(--muted)'}}>
          Tip: Use <code>roster_entry_template.json</code> and <code>game_entry_template.json</code> for copy/paste.
        </div>

        <p><Link href=\"/teams\">← Back to Teams</Link></p>
      </div>
    </>
  );
}
