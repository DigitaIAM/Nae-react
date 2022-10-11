import React from 'react';
import PropTypes from 'prop-types';
import Table from '../../components/Table/Table';

const { data } = require('../../__mocks__/Magazines/getMagazinesList.mock.json');

const ListPage = props => {
  return (
    <div style={{padding: '25px'}}>
      <Table data={data} />
    </div>
  );
};

ListPage.propTypes = {

};

export default ListPage;