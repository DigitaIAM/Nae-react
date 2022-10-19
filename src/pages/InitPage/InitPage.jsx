import React from 'react';
import PropTypes from 'prop-types';
import { Routes as Switch, Route } from 'react-router-dom';
import MagazinesPage from '../MagazinesPage';
import MagazineDetailsPage from '../MagazineDetailsPage';
import DocumentsPage from '../DocumentsPage';
import DocumentPage from '../DocumentsPage/components/DocumentPage';

const InitPage = props => {
  return (
    <Switch>
      <Route exact path="/documents" element={<DocumentsPage />} />
      <Route exact path="/documents/:id" element={<DocumentPage />} />
      <Route exact path="/magazines" element={<MagazinesPage />} />
      <Route exact path="/magazines/:id" element={<MagazineDetailsPage />} />
    </Switch>
  );
};

InitPage.propTypes = {

};

export default InitPage;
