import React from 'react';
import PropTypes from 'prop-types';
import {Routes as Switch, Route, NavLink, useLocation} from 'react-router-dom';
import Search from '../../components/Search';
import MagazinesPage from '../MagazinesPage';
import MagazineDetailsPage from '../MagazineDetailsPage';
import DocumentsPage from '../DocumentsPage';
import DocumentPage from '../DocumentsPage/components/DocumentPage';
import { routes } from './routes';
import './InitPage.scss';

const InitPage = props => {
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
            <Route exact path="/magazines" element={<MagazinesPage />} />
            <Route exact path="/magazines/:id" element={<MagazineDetailsPage />} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

InitPage.propTypes = {

};

export default InitPage;
