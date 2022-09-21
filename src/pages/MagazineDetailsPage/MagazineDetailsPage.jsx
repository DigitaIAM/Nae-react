import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import * as lodash from 'lodash';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
// import {useGetMagazineQuery} from '../../global/services/magazinesService';
import { compareRows } from './helpers';
import './MagazineDetailsPage.scss';

const { data: mockData } = require('../../__mocks__/Magazines/getMagazineById.mock.json');

const MagazineDetailsPage = () => {
  const navigate = useNavigate();

  const [gridRef, setGridRef] = useState(null);
  const [dataSource, setDataSource] = useState(mockData);

  const cellDOMProps = (cellProps) => ({
    onClick: () => {
      gridRef.current.startEdit({ columnId: cellProps.id, rowIndex: cellProps.rowIndex, value: lodash.get(cellProps.data, cellProps.name) })
    },
    onFocus: () => {
      gridRef.current.startEdit({ columnId: cellProps.id, rowIndex: cellProps.rowIndex, value: lodash.get(cellProps.data, cellProps.name) })
    },
  })

  // Page Document Settings
  const MAGAZINE_DETAILS_PAGE = {
    table: {
      groups: [
        { name: 'qty', header: 'Количество' },
        { name: 'cost', header: 'Сумма' }
      ],
      columns: [
        { name: 'label', header: 'Изделие', defaultFlex: 2, render: (dataObject) => dataObject.data.label, cellDOMProps },
        { name: 'qty.number', header: null, defaultFlex: 2, group: 'qty', render: (dataObject) => dataObject.data.qty.number, cellDOMProps },
        { name: 'qty.uom', header: null, defaultFlex: 2, group: 'qty', render: (dataObject) => dataObject.data.qty.uom, cellDOMProps },
        { name: 'cost.number', header: null, defaultFlex: 2, group: 'cost', render: (dataObject) => dataObject.data.cost.number, cellDOMProps },
        { name: 'cost.currency', header: null, defaultFlex: 2, group: 'cost', render: (dataObject) => dataObject.data.cost.currency, cellDOMProps },
        { name: 'note', header: 'Комментарий', defaultFlex: 2, render: (dataObject) => dataObject.data.note },
      ],
      emptyRow: {
        '_id': 'empty_row',
        label: undefined,
        qty: {
          number: undefined,
          uom: undefined,
        },
        price: {
          number: undefined,
          currency: undefined,
          per: {
            number: undefined,
            uom: undefined,
          },
        },
        cost: {
          number: undefined,
          currency: undefined,
        },
        note: undefined,
      }
    }
  }

  const onEditComplete = useCallback((data) => {
    const { rowId, columnId, value } = data;

    const _data = lodash.cloneDeep(dataSource);
    const row = rowId === MAGAZINE_DETAILS_PAGE.table.emptyRow['_id'] ?
      lodash.cloneDeep(MAGAZINE_DETAILS_PAGE.table.emptyRow) :
      _data.goods.find((item) => item['_id'] === rowId);

    lodash.update(row, columnId, () => value === '' ? undefined : value);

    const isRowEmpty = compareRows(row, MAGAZINE_DETAILS_PAGE.table.emptyRow);

    if (rowId === MAGAZINE_DETAILS_PAGE.table.emptyRow['_id'] && !isRowEmpty) {
      row['_id'] = lodash.uniqueId();
      _data.goods.push(row);
    }

    if (isRowEmpty && rowId !== MAGAZINE_DETAILS_PAGE.table.emptyRow['_id']) {
      lodash.remove(_data.goods, (n) => n['_id'] === rowId);
    }

    setDataSource(_data);
  }, [dataSource.goods]);

  const handleChangeComment = (e) => {
    setDataSource((prevData) => ({
      ...prevData,
      node: e.target.value,
    }));
  };

  useEffect(() => {
    const onEscPressGoBack = (e) => {
      if (e.key === 'Escape') {
        navigate('/magazines');
      }
    }

    document.addEventListener('keydown', onEscPressGoBack);

    return () => {
      document.removeEventListener('keydown', onEscPressGoBack);
    }
  }, []);

  return (
    <div className="magazine-page--wrapper">
      <div className="document--header">
        <p>Подразделение</p>
        <p>Автор</p>
      </div>
      <h1 className="document--name">Название документа № номет от дата</h1>
      <div className="document--body">
        <div className="body--information">
          <input type="text" className="information--input w-50" />
          <input type="text" className="information--input w-50" />
        </div>
        <div className="body--information">
          <input type="text" className="information--input w-100" />
        </div>
        <ReactDataGrid
          className="body--data-grid"
          idProperty="_id"
          editable
          onReady={setGridRef}
          onEditComplete={onEditComplete}
          // loading={isLoading || isFetching || (!data && !error)}
          groups={MAGAZINE_DETAILS_PAGE.table.groups}
          columns={MAGAZINE_DETAILS_PAGE.table.columns}
          dataSource={[
            ...(dataSource?.goods || []),
            MAGAZINE_DETAILS_PAGE.table.emptyRow,
          ]}
        />
        <div className="body--information">
          <input
            type="text"
            className="information--input w-100"
            value={dataSource.node}
            onChange={handleChangeComment}
          />
        </div>
        <div className="document--footer">
          <button
            type="button"
            className="footer--btn"
          >
            Cоздать
          </button>
          <button
            type="button"
            className="footer--btn"
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagazineDetailsPage;
