// pages/about.js
import Nav from '@/components/Nav';

export default function About() {
  return (
    <>
      <Nav />
      <div className="container">
        <h1 className="h1">About • National Prep DeafSports (Division I)</h1>

        <div className="card">
          Curated, Deaf schools only analytics for the Big 6:
          CSD Fremont, CSD Riverside, MSD, MSSD, TSD, ISD.
          <br /><br />
          This platform powers historical rankings, Clerc Classic history,
          tournament results, and player search (coming soon).
        </div>
      </div>
    </>
  );
}
