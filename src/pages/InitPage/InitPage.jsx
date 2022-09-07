import React from 'react';
import PropTypes from 'prop-types';
import Table from '../../components/Table';

const tableSettings = {
  columns: [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 100,
    },
  ]
}

const dataSource = require('../../__mocks__/data.json');

const InitPage = props => {
  return (
    <div>
      <Table
        dataSource={dataSource}
        settings={tableSettings}
      />
    </div>
  );
};

InitPage.propTypes = {

};

export default InitPage;
