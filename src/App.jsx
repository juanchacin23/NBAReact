
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import TeamDetailsPage from './pages/TeamDetailsPage';

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:id" element={<TeamDetailsPage />} />
    </Routes>
  )
}

export default App
