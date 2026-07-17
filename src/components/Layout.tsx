import { NavLink, Outlet, Link } from 'react-router-dom';
import GlassSurface from './reactbits/GlassSurface';
import { HomeIcon, MapIcon, PenIcon, EcosystemIcon } from './icons';

const navLinks = [
  { to: '/', label: 'Beranda', end: true, icon: HomeIcon },
  { to: '/roadmap', label: 'Roadmap', end: false, icon: MapIcon },
  { to: '/papan-tulis', label: 'Papan Tulis', end: false, icon: PenIcon },
  { to: '/ekosistem', label: 'Ekosistem', end: false, icon: EcosystemIcon },
];

export default function Layout() {
  return (
    <div className="min-h-full bg-white">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-4 left-4 z-20 hidden md:block">
        <GlassSurface borderRadius={28} width={72} height="100%">
          <div className="flex h-full flex-col items-center py-5">
            <Link
              to="/"
              aria-label="NuJou — beranda"
              className="mb-6 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-600 font-serif text-sm font-bold text-white"
            >
              N
            </Link>
            <nav className="flex flex-1 flex-col items-center gap-2">
              {navLinks.map(({ to, label, end, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `group relative grid h-11 w-11 place-items-center rounded-full transition ${
                      isActive ? 'bg-sky-600 text-white' : 'text-slate-500 hover:bg-sky-50 hover:text-sky-700'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                    {label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        </GlassSurface>
      </aside>

      {/* Mobile top strip (brand only, no nav controls) */}
      <header className="fixed inset-x-0 top-0 z-20 flex h-12 items-center justify-center bg-white/80 backdrop-blur md:hidden">
        <Link to="/" className="font-serif text-lg font-bold tracking-tight text-slate-900">
          NuJou
        </Link>
      </header>

      <div className="flex min-h-full flex-col pb-24 pt-12 md:pb-0 md:pl-28 md:pt-0">
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="hidden border-t border-sky-100 bg-sky-50/40 md:block">
          <div className="container-academic py-6 text-center text-sm text-slate-500">
            created by claude n nuza
          </div>
        </footer>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-4 z-20 md:hidden"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <GlassSurface borderRadius={24}>
          <div className="flex h-16 items-center justify-around px-2">
            {navLinks.map(({ to, label, end, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-semibold transition ${
                    isActive ? 'text-sky-700' : 'text-slate-500'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full transition ${
                        isActive ? 'bg-sky-600 text-white' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </GlassSurface>
      </nav>
    </div>
  );
}
