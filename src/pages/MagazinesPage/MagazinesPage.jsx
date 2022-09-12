import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { Input } from 'antd';
import { getFromLocalStorage, writeToLocalStorage } from '../../global/helpers';
import { MAGAZINES_PAGE } from './constants';
import './MagazinesPage.scss';

const dataSource = require('../../__mocks__/data.json');

const MagazinesPage = props => {
  const [searchValue, setSearchValue] = useState('');
  const [activeRowId, setActiveRowId] = useState(getFromLocalStorage('magazines_active_row') || null);

  const handleChangeActiveIndex = useCallback((index) => {
    setActiveRowId(index);
  }, []);

  useEffect(() => {
    writeToLocalStorage('magazines_active_row', activeRowId);
  }, [activeRowId]);

  return (
    <div className="magazines-page--wrapper">
      <div className="magazines-search--wrapper">
        <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      <ReactDataGrid
        idProperty="id"
        columns={MAGAZINES_PAGE.table.columns}
        groups={MAGAZINES_PAGE.table.groups}
        style={MAGAZINES_PAGE.table.gridStyle}
        dataSource={dataSource}
        activeIndex={activeRowId}
        enableSelection
        onActiveIndexChange={handleChangeActiveIndex}
      />
    </div>
  );
};

MagazinesPage.propTypes = {

};

export default MagazinesPage;
