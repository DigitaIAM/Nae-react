import React from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import Table from '../../components/Table/Table';
import Search from '../../components/Search';
import { checkEventKey } from '../../components/Table/helpers';
import {useGetMagazinesListQuery} from '../../global/services/magazinesService';
import config from '../../config';
import './DocumentsPage.scss';

const source = {
  columns: [
    {
      id: 'date',
      name: 'Дата',
      dataKey: ['date'],
    },
    {
      id: 'counterparty',
      name: 'Контрагент',
      dataKey: ['counterparty.company.label'],
    },
    {
      id: 'sum',
      name: 'Сумма',
      dataKey: ['cost.number', 'cost.currency']
    },
    {
      id: 'note',
      name: 'Комментарий',
      dataKey: ['note'],
    }
  ]
}

const DocumentsPage = props => {
  const navigate = useNavigate();

  const { data: documentsData, isLoading: isDocumentsDataLoading, error: documentsError } = useGetMagazinesListQuery();

  const onTableRowKeyDown = (e, id) => {
    e.preventDefault();

    if(checkEventKey(e, config.shortcuts.table.row.open)) {
      navigate(`/documents/${id}`);
    }
  }

  const onRowClick = (e, id) => {
    if (e.detail === 2) {
      e.preventDefault();
      navigate(`/documents/${id}`);
    }
  }

  return (
    <div className="documents-page-wrapper">
      <div className="documents-page--content">
        <Table
          idProperty="_id"
          tableId="documents_table"
          source={source}
          data={documentsData}
          loading={isDocumentsDataLoading}
          error={documentsError}
          onRowKeyDown={onTableRowKeyDown}
          onRowClick={onRowClick}
          maxHeight="450"
        />
      </div>
    </div>
  );
};

DocumentsPage.propTypes = {

};

export default DocumentsPage;