import React, {useCallback, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { Input } from 'antd';
import { getFromLocalStorage, writeToLocalStorage } from '../../global/helpers';
import { useGetMagazinesListQuery } from '../../global/services/magazinesService';
import { MAGAZINES_PAGE } from './constants';
import './MagazinesPage.scss';

const MagazinesPage = () => {
  const navigate = useNavigate();

  const [gridRef, setGridRef] = useState(null)
  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(Number(getFromLocalStorage('magazines_active_row') || 0))

  const { data: magazinesData, isLoading: isMagazinesLoading, isFetching: isMagazinesFetching, error: magazinesError } = useGetMagazinesListQuery();

  const handleChangeSelectionIndex = useCallback(({ selected: selectedId }) => {
    navigate(`/magazines/${selectedId}`)
  }, [navigate]);

  const handleChangeActiveRowIndex = (index) => {
    writeToLocalStorage('magazines_active_row', index);
    setActiveIndex(index)
  }

  useEffect(() => {
    if (gridRef?.current?.domRef?.current && document.body.clientWidth === getFromLocalStorage('magazines_window_width')) {
      // Scroll table to the prev value
      gridRef.current.domRef.current.querySelector('.inovua-react-scroll-container__wrapper').firstChild.scrollTop = getFromLocalStorage('magazines_table_scroll');

      // Set table active row according to prev
      const activeRow = getFromLocalStorage('magazines_active_row');

      if (activeRow && gridRef) {
        gridRef.current.focus();
      }
    }

    return () => {
      writeToLocalStorage('magazines_window_width', document.body.clientWidth);
    }
  }, [gridRef]);

  // Update the last scroll position every time when table was scrolled
  useEffect(() => {
    if (gridRef) {
      // Get table scrollable element
      const element = gridRef?.current?.domRef?.current?.querySelector('.inovua-react-scroll-container__wrapper').firstChild;

      const onHandleScroll = (e) => {
        writeToLocalStorage('magazines_table_scroll', e.target.scrollTop)
      }

      element.addEventListener('scroll', onHandleScroll);

      return () => {
        element.removeEventListener('scroll', onHandleScroll)
      }
    }
  }, [gridRef])

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
        activeIndex={activeIndex}
        enableSelection
        pagination
        livePagination
        scrollThreshold={0.7}
        onSelectionChange={handleChangeSelectionIndex}
        onActiveIndexChange={handleChangeActiveRowIndex}
      />
    </div>
  );
};

export default MagazinesPage;
