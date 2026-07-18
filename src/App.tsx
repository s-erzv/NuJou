import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Reading from './pages/Reading';
import Assessment from './pages/Assessment';
import Ecosystem from './pages/Ecosystem';
import NotFound from './pages/NotFound';

// Code-split the whiteboard — it pulls in Konva/react-konva (~300KB), which no
// other route needs, so it should not weigh down the initial bundle.
const Whiteboard = lazy(() => import('./pages/Whiteboard'));

function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-sm font-semibold text-slate-400">
      Memuat…
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/roadmap" element={<Dashboard />} />
        <Route path="/level/:slug" element={<Reading />} />
        <Route path="/level/:slug/quiz" element={<Assessment kind="quiz" />} />
        <Route path="/level/:slug/exam" element={<Assessment kind="exam" />} />
        <Route
          path="/papan-tulis"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Whiteboard />
            </Suspense>
          }
        />
        <Route path="/ekosistem" element={<Ecosystem />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
