import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-academic grid place-items-center py-24 text-center">
      <div>
        <p className="font-serif text-7xl font-bold text-sky-600">404</p>
        <h1 className="mt-3 font-serif text-2xl font-bold text-slate-900">Halaman Tidak Ditemukan</h1>
        <p className="mt-2 text-slate-500">
          Materi yang Anda cari tidak ada, atau level tersebut masih terkunci.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Kembali ke Roadmap
        </Link>
      </div>
    </div>
  );
}
