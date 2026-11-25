import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MenuPage } from '../pages/MenuPage';
import { DrawPage } from '../pages/DrawPage';
import { GamePage } from '../pages/GamePage';
import { SummaryPage } from '../pages/SummaryPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/sorteo" element={<DrawPage />} />
      <Route path="/juego" element={<GamePage />} />
      <Route path="/resumen" element={<SummaryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
