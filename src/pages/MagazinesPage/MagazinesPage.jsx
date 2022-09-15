import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { Input } from 'antd';
import { getFromLocalStorage, writeToLocalStorage } from '../../global/helpers';
import { useGetMagazinesListQuery } from '../../global/services/magazinesService';
import { MAGAZINES_PAGE } from './constants';
import './MagazinesPage.scss';

const MagazinesPage = props => {
  const navigate = useNavigate();

  const [gridRef, setGridRef] = useState(null)
  const [searchValue, setSearchValue] = useState('');

  const { data: magazinesData, isLoading: isMagazinesLoading, isFetching: isMagazinesFetching, error: magazinesError } = useGetMagazinesListQuery();

  const handleChangeSelectionIndex = useCallback(({ selected: selectedId }) => {
    navigate(`/magazines/${selectedId}`)
  }, []);

  const handleChangeActiveRowIndex = (index) => {
    writeToLocalStorage('magazines_active_row', index);
  }

  useEffect(() => {
    const activeRow = getFromLocalStorage('magazines_active_row');
    if (activeRow && gridRef) {
      gridRef.current.focus();
    }
  }, [gridRef]);

  return (
    <div className="magazines-page--wrapper">
      <div className="magazines-search--wrapper">
        <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      <ReactDataGrid
        idProperty="_id"
        onReady={setGridRef}
        columns={MAGAZINES_PAGE.table.columns}
        groups={MAGAZINES_PAGE.table.groups}
        style={MAGAZINES_PAGE.table.gridStyle}
        loading={isMagazinesLoading || isMagazinesFetching || (!magazinesData && !magazinesError)}
        dataSource={magazinesData || []}
        defaultActiveIndex={Number(getFromLocalStorage('magazines_active_row') || 0)}
        enableSelection
        pagination
        livePagination
        scrollThreshold={0.7}
        // defaultSelected={selectedRowIndex}
        onSelectionChange={handleChangeSelectionIndex}
        onActiveIndexChange={handleChangeActiveRowIndex}
      />
    </div>
  );
};

MagazinesPage.propTypes = {

};

export default MagazinesPage;
