import React from 'react';
import PropTypes from 'prop-types';
import { Routes as Switch, Route } from 'react-router-dom';
import MagazinesPage from '../MagazinesPage';
import MagazineDetailsPage from '../MagazineDetailsPage';

const InitPage = props => {
  return (
    <Switch>
      <Route exact path="/magazines" element={<MagazinesPage />} />
      <Route exact path="/magazines/:id" element={<MagazineDetailsPage />} />
    </Switch>
  );
};

InitPage.propTypes = {

};

export default InitPage;
