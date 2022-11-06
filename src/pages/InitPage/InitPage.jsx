import React from 'react';
import {Routes as Switch, Route, NavLink, useLocation} from 'react-router-dom';
import Search from '../../components/Search';
import DocumentsPage from '../DocumentsPage';
import DocumentPage from '../DocumentsPage/components/DocumentPage';
import { routes } from './routes';
import './InitPage.scss';

const InitPage = () => {
  const location = useLocation();

  return (
    <div className="application-wrapper">
      <div className="application-header">
        <Search
          suggestions={[
            {
              id: 1,
              value: 'Test'
            }
          ]}
          baseUrl="documents"
          placeholder="Я ищу..."
        />
      </div>
      <div className="application-body">
        <div className="application-navigation">
          {routes.map((route) => (
            <div
              key={route.id}
              className={`application-navigation--item ${location.pathname === route.url ? 'active' : ''}`}
            >
              <NavLink
                to={route.url}
                tabIndex={0}
                className="application-navigation--item__link"
              >
                {route.icon}
              </NavLink>
            </div>
          ))}
        </div>
        <div className="application-content">
          <Switch>
            <Route exact path="/documents" element={<DocumentsPage />} />
            <Route exact path="/documents/:id" element={<DocumentPage />} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

InitPage.propTypes = {

};

export default InitPage;
