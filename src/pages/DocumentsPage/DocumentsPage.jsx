import React from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import Table from '../../components/Table/Table';
import Search from '../../components/Search';
import { checkEventKey } from '../../components/Table/helpers';
import './DocumentsPage.scss';
import config from '../../config';

const { data } = require('../../__mocks__/Magazines/getMagazinesList.mock.json');

const DocumentsPage = props => {
  const navigate = useNavigate();

  const onTableRowKeyDown = (e, id) => {
    e.preventDefault();

    if(checkEventKey(e, config.shortcuts.table.row.open)) {
      e.preventDefault();
      navigate(`/documents/${id}`);
    }
  }

  return (
    <div className="documents-page-wrapper">
      <div className="documents-page--header">
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
      <div className="documents-page--body">
        <div className="documents-page--navigation">

        </div>
        <div className="documents-page--content">
          <Table
            idProperty="_id"
            tableId="documents_table"
            data={data}
            onRowKeyDown={onTableRowKeyDown}
            isCellSelectable
            isEditable
          />
        </div>
      </div>
    </div>
  );
};

DocumentsPage.propTypes = {

};

export default DocumentsPage;