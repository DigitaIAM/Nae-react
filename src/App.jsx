import React from 'react';
import { Routes as Switch, Route } from 'react-router-dom';
import InitPage from './pages/InitPage';
import './global/styles/index.scss';

const App = () => {
  return (
    <Switch>
      <Route path="*" element={<InitPage />} />
    </Switch>
  );
};

export default App;
