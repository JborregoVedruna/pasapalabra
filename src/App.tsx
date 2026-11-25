import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { GameProvider } from './infrastructure/ui/context/GameContext';
import { AppRouter } from './infrastructure/ui/routes/AppRouter';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
