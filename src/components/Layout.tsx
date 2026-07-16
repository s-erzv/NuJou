import { NavLink, Outlet, Link } from 'react-router-dom';
import GlassSurface from './reactbits/GlassSurface';

const navItem = 'px-3 py-2 rounded-full text-sm font-semibold transition hover:bg-sky-50';
const active = 'text-sky-700 bg-sky-50';
const idle = 'text-slate-600';

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="sticky top-4 z-20 px-4">
        <GlassSurface radius={9999} className="container-academic !max-w-5xl">
          <div className="flex h-14 items-center justify-between px-5">
            <Link to="/" className="font-serif text-xl font-bold tracking-tight text-slate-900">
              NuJou
            </Link>
            <nav className="flex items-center gap-1">
              <NavLink to="/" className={({ isActive }) => `${navItem} ${isActive ? active : idle}`}>
                Roadmap
              </NavLink>
              <NavLink
                to="/papan-tulis"
                className={({ isActive }) => `${navItem} ${isActive ? active : idle}`}
              >
                Papan Tulis
              </NavLink>
              <NavLink
                to="/ekosistem"
                className={({ isActive }) => `${navItem} ${isActive ? active : idle}`}
              >
                Ekosistem
              </NavLink>
            </nav>
          </div>
        </GlassSurface>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-sky-100 bg-sky-50/40">
        <div className="container-academic py-6 text-center text-sm text-slate-500">
          created by claude n nuza
        </div>
      </footer>
    </div>
  );
}
