import { Route, Routes } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  );
}

export default App;
