import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Reading from './pages/Reading';
import Assessment from './pages/Assessment';
import Whiteboard from './pages/Whiteboard';
import Ecosystem from './pages/Ecosystem';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/roadmap" element={<Dashboard />} />
        <Route path="/level/:slug" element={<Reading />} />
        <Route path="/level/:slug/quiz" element={<Assessment kind="quiz" />} />
        <Route path="/level/:slug/exam" element={<Assessment kind="exam" />} />
        <Route path="/papan-tulis" element={<Whiteboard />} />
        <Route path="/ekosistem" element={<Ecosystem />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
