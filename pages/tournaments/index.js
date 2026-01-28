import Nav from '@/components/Nav';

export default function Tournaments(){
  return (
    <>
      <Nav />
      <div className="container">
        <h1 className="h1">Tournaments</h1>
        <div className="card">
          <p>Explore national and regional Deaf schools tournaments.</p>
          <ul>
            <li>Clerc Classic – national (Division I focus) – <a href="/clerc">view records</a></li>
            <li>GPSD – regional (Division II) – <i>coming soon</i></li>
            <li>ESDAA – regional (Division II) – <i>coming soon</i></li>
            <li>CSSD / CSAD – regional (Division II) – <i>coming soon</i></li>
          </ul>
        </div>
      </div>
    </>
  );
}
``
