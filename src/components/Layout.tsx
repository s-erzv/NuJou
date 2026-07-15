import { NavLink, Outlet, Link } from 'react-router-dom';

const navItem =
  'px-3 py-2 rounded-md text-sm font-semibold transition hover:bg-sky-50';
const active = 'text-sky-700 bg-sky-50';
const idle = 'text-slate-600';

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="sticky top-0 z-20 border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="container-academic flex h-16 items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-slate-900">
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
