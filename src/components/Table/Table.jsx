import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { get as getObjectValue, cloneDeep, update as updateObjectValue } from 'lodash';
import { checkEventKey, createEmptyObjectCopy, isObjectEmpty } from './helpers';
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

const Table = ({ idProperty, data, isCellSelectable, isEditable, onRowKeyDown: onRowKeyDownProps }) => {
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

      if (isEditable) {
        dataClone.push(createEmptyObjectCopy(dataClone[0]));
      }

      setCopiedData(dataClone);
    }
  }, [data]);

  // Empty row controller.
  useEffect(() => {
    if (copiedData) {
      if (isObjectEmpty(copiedData[copiedData.length - 1]) && isObjectEmpty(copiedData[copiedData.length - 2])) {
        setCopiedData((prevData) => {
          const data = cloneDeep(prevData);

          data.pop();

          return data;
        });
      }

      if (!isObjectEmpty(copiedData[copiedData.length - 1])) {
        setCopiedData((prevData) => {
          const data = cloneDeep(prevData);

          data.push(
            createEmptyObjectCopy(copiedData[0]),
          );

          return data;
        });
      }
    }
  }, [copiedData]);

  // Set focus on editable cell input
  useEffect(() => {
    if (editableState.rowIndex !== undefined && editableState.cellIndex !== undefined && editableState.cellWrapperIndex !== undefined) {
      if (focusedCellRef.current) {
        const input = focusedCellRef.current.querySelector('input.table--row-cell__input');
        input.focus();
      }
    }
  }, [editableState.rowIndex, editableState.cellIndex, editableState.cellWrapperIndex]);

  const cellSwitchToEditableMode = (cellValue) => {
    if (editableState?.cellIndex === undefined && editableState?.rowIndex === undefined && editableState?.cellWrapperIndex === undefined) {
      const rowsArray = Array.from(bodyScrollContainerRef?.current?.children || []);
      const indexOfFocusedRow = rowsArray.indexOf(focusedRowRef?.current);

      const cellWrapperArray = Array.from(focusedRowRef?.current?.children || []);
      const indexOfFocusedCellWrapper = cellWrapperArray.indexOf(focusedCellWrapperRef.current);

      const cellsArray = Array.from(focusedCellWrapperRef?.current?.children || []);
      const indexOfFocusedCell = cellsArray.indexOf(focusedCellRef?.current);

      setEditableState({
        rowIndex: indexOfFocusedRow,
        cellWrapperIndex: indexOfFocusedCellWrapper,
        cellIndex: indexOfFocusedCell,
      });

      setCellData(cellValue);
    }
  };

  const changeNavigationToCells = (e, autoSwitch = false) => {
    // Row editing start. Will change navigation from rows only to cells.
    if (isCellSelectable) {
      if (checkEventKey(e, config.shortcuts.table.row.editStart) || autoSwitch) {
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
  }

  const rowNavigate = (e, direction) => {
    e.preventDefault();

    const directionIndex = direction === 'up' ? -1 : 1;

    const rowsArray = Array.from(bodyScrollContainerRef?.current?.children || []);
    const indexOfFocusedRow = rowsArray.indexOf(focusedRowRef?.current);

    if (rowsArray[indexOfFocusedRow + directionIndex]) {
      const focusedRow = rowsArray[indexOfFocusedRow + directionIndex];
      focusedRowRef.current = focusedRow;
      focusedRow.focus();
    }
  };

  const cellNavigate = (event, direction, rowJump = false) => {
    event.preventDefault();

    const cellsArray = Array.from(focusedCellWrapperRef?.current?.children || []);
    const indexOfFocusedCell = cellsArray.indexOf(focusedCellRef?.current);

    if (direction === 'left' || direction === 'right') {
      const directionIndex = direction === 'left' ? -1 : 1;
      // Previous or Next Cell
      if (cellsArray[indexOfFocusedCell + directionIndex]) {
        const focusedCell = cellsArray[indexOfFocusedCell + directionIndex];
        focusedCellRef.current = focusedCell;
        focusedCell.focus();
      } else {
        // Previous or Next Cell Wrapper
        const cellWrappersArray = Array.from(focusedRowRef?.current?.children || []);
        const indexOfFocusedCellWrapper = cellWrappersArray.indexOf(focusedCellWrapperRef?.current);

        if (cellWrappersArray[indexOfFocusedCellWrapper + directionIndex]) {
          // Last Cell
          const focusedCellWrapper = cellWrappersArray[indexOfFocusedCellWrapper + directionIndex];
          focusedCellWrapperRef.current = focusedCellWrapper;

          const cellsArray = Array.from(focusedCellWrapper?.children || []);
          const focusedCell = cellsArray[direction === 'right' ? 0 : cellsArray.length - 1];
          focusedCellRef.current = focusedCell;
          focusedCell.focus();
        } else {
          if (rowJump) {
            rowNavigate(event, 'down');
            changeNavigationToCells(event, true);
          }
        }
      }
    }

    if (direction === 'top' || direction === 'down') {
      const directionIndex = direction === 'up' ? -1 : 1;

      const rowsArray = Array.from(bodyScrollContainerRef?.current?.children || []);
      const indexOfFocusedRow = rowsArray.indexOf(focusedRowRef?.current);

      const cellWrappersArray = Array.from(focusedRowRef?.current?.children || []);
      const indexOfFocusedCellWrapper = cellWrappersArray.indexOf(focusedCellWrapperRef?.current);

      const cellsArray = Array.from(focusedCellWrapperRef?.current.children || []);
      const indexOfFocusedCell = cellsArray.indexOf(focusedCellRef?.current);

      if (rowsArray[indexOfFocusedRow + directionIndex]) {
        const focusedRow = rowsArray[indexOfFocusedRow + directionIndex];
        focusedRowRef.current = focusedRow;

        const focusedCellWrapper = focusedRow.children[indexOfFocusedCellWrapper];
        focusedCellWrapperRef.current = focusedCellWrapper;

        const focusedCell = focusedCellWrapper.children[indexOfFocusedCell];
        focusedCellRef.current = focusedCell;

        focusedCell.focus();
      }
    }
  };

  const onFocus = (e) => {
    if (e.target.classList.contains('table--row')) {
      focusedRowRef.current = e.target;
    }
  }

  const onRowKeyDown = (e, itemId) => {
    // Call event function from props.
    if (onRowKeyDownProps) {
      onRowKeyDownProps(e, itemId);
    }

    // Prevent focus change
    if (cellData) {
      return;
    }

    // Row editing start. Will change navigation from rows only to cells.
    if (isCellSelectable) {
      changeNavigationToCells(e);
    }

    // Move to the next row.
    if (checkEventKey(e, config.shortcuts.table.row.moveNext)) {
      rowNavigate(e, 'down');
    }

    // Move to the previous row.
    if (checkEventKey(e, config.shortcuts.table.row.movePrev)) {
      rowNavigate(e, 'up');
    }
  }

  const onCellKeyDown = (e, cellValue) => {
    // Prevent focus change
    if (cellData) {
      return;
    }

    // Move to the next cell
    if (checkEventKey(e, config.shortcuts.table.cell.moveNext)) {
      cellNavigate(e, 'right');
    }

    // Move to the prev cell
    if (checkEventKey(e, config.shortcuts.table.cell.movePrev)) {
      cellNavigate(e,'left');
    }

    // Move to the up cell
    if (checkEventKey(e, config.shortcuts.table.cell.moveUp)) {
      cellNavigate(e, 'up');
    }

    // Move to the down cell
    if (checkEventKey(e, config.shortcuts.table.cell.moveDown)) {
      cellNavigate(e, 'down');
    }

    // Switch cell to editable mode.
    if (checkEventKey(e, config.shortcuts.table.cell.editStart) && isEditable) {
      cellSwitchToEditableMode(cellValue);
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
    if (checkEventKey(e, config.shortcuts.table.cell.editEnd)) {
      e.preventDefault();

      const rowsArray = Array.from(bodyScrollContainerRef.current.children || []);
      const cellWrappersArray = Array.from(rowsArray[editableState.rowIndex]?.children || []);
      const cellsArray = Array.from(cellWrappersArray[editableState.cellWrapperIndex]?.children || []);

      setCopiedData((prevData) => {
        const data = cloneDeep(prevData);
        return updateObjectValue(data, `[${editableState.rowIndex}].${cellKey}`, () => cellData);
      });

      focusedRowRef.current = rowsArray[editableState.rowIndex];
      focusedCellWrapperRef.current = cellWrappersArray[editableState.cellWrapperIndex];
      focusedCellRef.current = cellsArray[editableState.cellIndex];

      setEditableState({
        rowIndex: undefined,
        cellWrapperIndex: undefined,
        cellIndex: undefined,
      });

      setCellData(null);

      cellNavigate(e, 'right', true);
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
                  key={item[idProperty]}
                  tabIndex={0}
                  className="table--row"
                  onFocus={onFocus}
                  onKeyDown={(e) => {
                    onRowKeyDown(e, item[idProperty])
                  }}
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
                      {column.dataKey.map((cellDataKey, cellIndex) => (
                        <div
                          key={cellDataKey}
                          tabIndex={-1}
                          className="table--row-cell"
                          style={{
                            flex: `0 1 ${100 / column.dataKey.length}%`,
                            maxWidth: `${100 / column.dataKey.length}%`,
                          }}
                          onKeyDown={(e) => {
                            onCellKeyDown(e, getObjectValue(item, cellDataKey))
                          }}
                          onClick={onCellClick}
                        >
                          {editableState.cellIndex === cellIndex && editableState.cellWrapperIndex === cellWrapperIndex && editableState.rowIndex === rowIndex ? (
                            <input
                              className="table--row-cell__input"
                              type="text"
                              value={cellData}
                              onChange={handleChangeCellValue}
                              onKeyDown={(e) => {
                                onInputKeyDown(e, cellDataKey);
                              }}
                            />
                          ) : (
                            <div className="table--row-cell__content">
                              {getObjectValue(item, cellDataKey)}
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
  idProperty: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isCellSelectable: PropTypes.bool,
  isEditable: PropTypes.bool,
};

Table.defaultProps = {
  isCellSelectable: false,
  isEditable: false,
}

export default Table;