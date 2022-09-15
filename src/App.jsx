import React from 'react';
import { BrowserRouter as Router, Routes as Switch, Route, Navigate } from 'react-router-dom';
import InitPage from './pages/InitPage';

import "antd/dist/antd.css";
import '@inovua/reactdatagrid-enterprise/index.css';
import './global/styles/index.scss';

const App = () => {
  return (
    <Router>
      <InitPage />
    </Router>
  );
};

export default App;
