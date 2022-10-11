import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { get as getObjectValue, cloneDeep, update as updateObjectValue } from 'lodash';
import config from '../../config';
import './Table.scss';

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



const Table = ({ data }) => {
  const bodyScrollContainerRef = useRef();
  const focusedRowRef = useRef();
  const focusedCellWrapperRef = useRef();
  const focusedCellRef = useRef();

  const [copiedData, setCopiedData] = useState(null);
  const [editableState, setEditableState] = useState({
    rowIndex: undefined,
    cellWrapperIndex: undefined,
    cellIndex: undefined,
  });
  const [cellData, setCellData] = useState(null);

  // Make the deep copy of the data array
  useEffect(() => {
    if (data) {
      const dataClone = cloneDeep(data);

      setCopiedData(dataClone);
    }
  }, [data]);

  // Set focus on editable cell input
  useEffect(() => {
    if (editableState.rowIndex !== undefined && editableState.cellIndex !== undefined && editableState.cellWrapperIndex !== undefined) {
      if (focusedCellRef.current) {
        const input = focusedCellRef.current.querySelector('input.table--row-cell__input');
        input.focus();
      }
    }
  }, [editableState.rowIndex, editableState.cellIndex, editableState.cellWrapperIndex])

  const onFocus = (e) => {
    if (e.target.classList.contains('table--row')) {
      focusedRowRef.current = e.target;
    }
  }

  const onBlur = (e) => {

  }

  const onRowKeyDown = (e) => {
    // Row editing start. Will change navigation from rows only to cells.
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

    // Move throw rows up and down.
    if (e.key === config.shortcuts.table.row.moveNext || e.key === config.shortcuts.table.row.movePrev) {
      e.preventDefault();

      const direction = e.key === config.shortcuts.table.row.moveNext ? 1 : -1;

      const rowsArray = Array.from(bodyScrollContainerRef.current.children || []);
      const indexOfFocusedRow = rowsArray.indexOf(focusedRowRef.current);

      if (rowsArray[indexOfFocusedRow + direction]) {
        const focusedRow = rowsArray[indexOfFocusedRow + direction];
        focusedRowRef.current = focusedRow;
        focusedRow.focus();
      }
    }
  }

  const onCellKeyDown = (e, cellValue) => {
    // Move to the next cell
    if (config.shortcuts.table.cell.moveNext === e.key || e.key === 'Tab') {
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

    // Move to the prev cell
    if (config.shortcuts.table.cell.movePrev === e.key || (e.shiftKey && e.key === 'Tab')) {
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

    // Move to the down and up cell
    if (config.shortcuts.table.cell.moveUp === e.key || config.shortcuts.table.cell.moveDown === e.key) {
      e.preventDefault();

      const direction = e.key === config.shortcuts.table.cell.moveDown ? 1 : -1;

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

    // Switch cell to editable mode.
    if (config.shortcuts.table.cell.editStart.key === e.key && e.ctrlKey === config.shortcuts.table.cell.editStart.ctrl) {
      if (editableState.cellIndex === undefined && editableState.rowIndex === undefined && editableState.cellWrapperIndex === undefined) {
        const rowsArray = Array.from(bodyScrollContainerRef.current.children || []);
        const indexOfFocusedRow = rowsArray.indexOf(focusedRowRef.current);

        const cellWrapperArray = Array.from(focusedRowRef.current.children || []);
        const indexOfFocusedCellWrapper = cellWrapperArray.indexOf(focusedCellWrapperRef.current);

        const cellsArray = Array.from(focusedCellWrapperRef.current.children || []);
        const indexOfFocusedCell = cellsArray.indexOf(focusedCellRef.current);

        setEditableState({
          rowIndex: indexOfFocusedRow,
          cellWrapperIndex: indexOfFocusedCellWrapper,
          cellIndex: indexOfFocusedCell,
        });

        setCellData(cellValue);
      }
    }
  }

  const onCellClick = (e) => {
    const focusedCell = e.target.parentElement;
    const focusedCellWrapper = focusedCell.parentElement;
    const focusedRow = focusedCellWrapper.parentElement;

    focusedRowRef.current = focusedRow;
    focusedCellWrapperRef.current = focusedCellWrapper;
    focusedCellRef.current = focusedCell;
  }

  const onInputKeyDown = (e, cellKey) => {
    if (config.shortcuts.table.cell.editEnd.key === e.key && config.shortcuts.table.cell.editEnd.ctrl === e.ctrlKey) {
      const rowsArray = Array.from(bodyScrollContainerRef.current.children || []);
      const cellWrappersArray = Array.from(rowsArray[editableState.rowIndex]?.children || []);
      const cellsArray = Array.from(cellWrappersArray[editableState.cellWrapperIndex]?.children || []);

      updateObjectValue(copiedData, `[${editableState.rowIndex}].${cellKey}`, () => cellData);

      focusedRowRef.current = rowsArray[editableState.rowIndex];
      focusedCellWrapperRef.current = cellWrappersArray[editableState.cellWrapperIndex];
      focusedCellRef.current = cellsArray[editableState.cellIndex];

      setEditableState({
        rowIndex: undefined,
        cellWrapperIndex: undefined,
        cellIndex: undefined,
      });

      setCellData(null);

      focusedCellRef.current?.focus();
    }
  }

  const handleChangeCellValue = (e) => {
    setCellData(e.target.value);
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
              {copiedData?.map((item, rowIndex) => (
                <div
                  key={item.id}
                  tabIndex={0}
                  className="table--row"
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onKeyDown={onRowKeyDown}
                >
                  {source.columns.map((column, cellWrapperIndex) => (
                    <div
                      key={column.id}
                      className="table--row-cell-wrapper"
                      style={{
                        flex: `0 1 ${100 / source.columns.length}%`,
                        maxWidth: `${100 / source.columns.length}%`,
                      }}
                    >
                      {column.dataKey.map((key, cellIndex) => (
                        <div
                          key={key}
                          tabIndex={-1}
                          className="table--row-cell"
                          style={{
                            flex: `0 1 ${100 / column.dataKey.length}%`,
                            maxWidth: `${100 / column.dataKey.length}%`,
                          }}
                          onKeyDown={(e) => {
                            onCellKeyDown(e, getObjectValue(item, key))
                          }}
                          onClick={onCellClick}
                        >
                          {editableState.cellIndex === cellIndex && editableState.cellWrapperIndex === cellWrapperIndex && editableState.rowIndex === rowIndex ? (
                            <input
                              className="table--row-cell__input"
                              type="text"
                              value={cellData}
                              onChange={(e) => {
                                handleChangeCellValue(e, rowIndex, key);
                              }}
                              onKeyDown={(e) => {
                                onInputKeyDown(e, key);
                              }}
                            />
                          ) : (
                            <div className="table--row-cell__content">
                              {getObjectValue(item, key)}
                            </div>
                          )}
                          <div className="table--row-cell__focus" />
                        </div>
                      ))}
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
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Table;