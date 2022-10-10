import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {isArray, get as getObjectValue } from 'lodash';
import config from '../../config';
import './Table.scss';

const source = {
  columns: [
    {
      id: 'date',
      name: 'Дата',
      dataKey: 'date',
    },
    {
      id: 'counterparty',
      name: 'Контрагент',
      dataKey: 'counterparty.label',
    },
    {
      id: 'sum',
      name: 'Сумма',
      dataKey: ['cost.number', 'cost.currency']
    },
    {
      id: 'note',
      name: 'Комментарий',
      dataKey: 'note',
    }
  ]
}

const { data } = require('../../__mocks__/Magazines/getMagazinesList.mock.json');

const Table = props => {
  const bodyScrollContainerRef = useRef();
  const focusedRowRef = useRef();
  const focusedCellWrapperRef = useRef();
  const focusedCellRef = useRef();

  const [editableState, setEditableState] = useState({
    rowIndex: undefined,
    cellWrapperIndex: undefined,
    cellIndex: undefined,
  });

  const onFocus = (e) => {
    if (e.target.classList.contains('table--row')) {
      focusedRowRef.current = e.target;
    }
  }

  const onBlur = (e) => {

  }

  const onRowKeyDown = (e) => {
    if (e.ctrlKey === config.shortcuts.table.row.editStart.ctrl) {
      if (e.key === config.shortcuts.table.row.editStart.key) {
        e.preventDefault();
        const focusedCellWrapper = focusedRowRef.current.children[0];

        if (focusedCellWrapper) {
          focusedCellWrapperRef.current = focusedCellWrapper;
          const focusedCell = focusedCellWrapper.children[0];

          if (focusedCell) {
            focusedCellRef.current = focusedCell;
            focusedCell.focus();
          }
        }
      }
    }

    if (e.key === config.shortcuts.table.row.rowMoveNext || e.key === config.shortcuts.table.row.rowMovePrev) {
      e.preventDefault();

      const direction = e.key === config.shortcuts.table.row.rowMoveNext ? 1 : -1;

      const rowsArray = Array.from(bodyScrollContainerRef.current.children || []);
      const indexOfFocusedRow = rowsArray.indexOf(focusedRowRef.current);

      if (rowsArray[indexOfFocusedRow + direction]) {
        const focusedRow = rowsArray[indexOfFocusedRow + direction];
        focusedRowRef.current = focusedRow;
        focusedRow.focus();
      }
    }
  }

  const onCellKeyDown = (e) => {
    if (config.shortcuts.table.row.cellMoveNext === e.key || e.key === 'Tab') {
      e.preventDefault();

      const cellsArray = Array.from(focusedCellWrapperRef.current.children || []);
      const indexOfFocusedCell = cellsArray.indexOf(focusedCellRef.current);

      if (cellsArray[indexOfFocusedCell + 1]) {
        // Next Cell
        const focusedCell = cellsArray[indexOfFocusedCell + 1];
        focusedCellRef.current = focusedCell;
        focusedCell.focus();
      } else {
        // Next Cell Wrapper
        const cellWrappersArray = Array.from(focusedRowRef.current.children || []);
        const indexOfFocusedCellWrapper = cellWrappersArray.indexOf(focusedCellWrapperRef.current);

        if (cellWrappersArray[indexOfFocusedCellWrapper + 1]) {
          // First Cell
          const focusedCellWrapper = cellWrappersArray[indexOfFocusedCellWrapper + 1];
          focusedCellWrapperRef.current = focusedCellWrapper;

          const cellsArray = Array.from(focusedCellWrapper.children || []);
          const focusedCell = cellsArray[0];
          focusedCellRef.current = focusedCell;
          focusedCell.focus();

        }
      }
    }

    if (config.shortcuts.table.row.cellMovePrev === e.key || (e.shiftKey && e.key === 'Tab')) {
      e.preventDefault();

      const cellsArray = Array.from(focusedCellWrapperRef.current.children || []);
      const indexOfFocusedCell = cellsArray.indexOf(focusedCellRef.current);

      if (cellsArray[indexOfFocusedCell - 1]) {
        // Prev Cell
        const focusedCell = cellsArray[indexOfFocusedCell - 1];
        focusedCellRef.current = focusedCell;
        focusedCell.focus();
      } else {
        // Prev Cell Wrapper
        const cellWrappersArray = Array.from(focusedRowRef.current.children || []);
        const indexOfFocusedCellWrapper = cellWrappersArray.indexOf(focusedCellWrapperRef.current);

        if (cellWrappersArray[indexOfFocusedCellWrapper - 1]) {
          // Last Cell
          const focusedCellWrapper = cellWrappersArray[indexOfFocusedCellWrapper - 1];
          focusedCellWrapperRef.current = focusedCellWrapper;

          const cellsArray = Array.from(focusedCellWrapper.children || []);
          const focusedCell = cellsArray[cellsArray.length - 1];
          focusedCellRef.current = focusedCell;
          focusedCell.focus();
        }
      }
    }

    if (config.shortcuts.table.row.cellMoveUp === e.key || config.shortcuts.table.row.cellMoveDown === e.key) {
      e.preventDefault();

      const direction = e.key === config.shortcuts.table.row.cellMoveDown ? 1 : -1;

      const rowsArray = Array.from(bodyScrollContainerRef.current.children || []);
      const indexOfFocusedRow = rowsArray.indexOf(focusedRowRef.current);

      const cellWrappersArray = Array.from(focusedRowRef.current.children || []);
      const indexOfFocusedCellWrapper = cellWrappersArray.indexOf(focusedCellWrapperRef.current);

      const cellsArray = Array.from(focusedCellWrapperRef.current.children || []);
      const indexOfFocusedCell = cellsArray.indexOf(focusedCellRef.current);

      if (rowsArray[indexOfFocusedRow + direction]) {
        const focusedRow = rowsArray[indexOfFocusedRow + direction];
        focusedRowRef.current = focusedRow;

        const focusedCellWrapper = focusedRow.children[indexOfFocusedCellWrapper];
        focusedCellWrapperRef.current = focusedCellWrapper;

        const focusedCell = focusedCellWrapper.children[indexOfFocusedCell];
        focusedCellRef.current = focusedCell;

        focusedCell.focus();
      }
    }
  }

  return (
    <div className="table-wrapper">
      <div className="table-body">
        <div className="table-layout">
          <div className="table--header-layout">
            <div className="table--header-wrapper">
              <div className="table--header">
                {source.columns.map((column) => (
                  <div
                    key={column.id}
                    className="table--header-cell"
                    style={{
                      flex: `0 1 ${100 / source.columns.length}%`,
                      maxWidth: `${100 / source.columns.length}%`,
                    }}
                  >
                    <div className="table--header-cell__content">
                      {column.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="table--virtual-list">
            <div
              ref={bodyScrollContainerRef}
              className="table--scroll-container-wrapper"
            >
              {data.map((item) => (
                <div
                  key={item.id}
                  tabIndex={0}
                  className="table--row"
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onKeyDown={onRowKeyDown}
                >
                  {source.columns.map((column) => (
                    <div
                      key={column.id}
                      className="table--row-cell-wrapper"
                      style={{
                        flex: `0 1 ${100 / source.columns.length}%`,
                        maxWidth: `${100 / source.columns.length}%`,
                      }}
                    >
                      {isArray(column.dataKey) ? (
                        <>
                          {column.dataKey.map((key) => (
                            <div
                              key={key}
                              tabIndex={-1}
                              className="table--row-cell"
                              style={{
                                flex: `0 1 ${100 / column.dataKey.length}%`,
                                maxWidth: `${100 / column.dataKey.length}%`,
                              }}
                              onKeyDown={onCellKeyDown}
                            >
                              <div className="table--row-cell__focus" />
                              <div className="table--row-cell__content">
                                {getObjectValue(item, key)}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div
                          tabIndex={-1}
                          className="table--row-cell"
                          onKeyDown={onCellKeyDown}
                        >
                          <div className="table--row-cell__focus" />
                          <div className="table--row-cell__content">
                            {getObjectValue(item, column.dataKey)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {

};

export default Table;