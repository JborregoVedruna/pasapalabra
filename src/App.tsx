import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { GameProvider } from './infrastructure/adapters/inbound/ui/context/GameContext';
import { AppRouter } from './infrastructure/adapters/inbound/ui/routes/AppRouter';

function App() {
  return (
    <GameProvider>
      {/* basename: "/pasapalabra/" en GitHub Pages, "/" en desarrollo */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRouter />
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
