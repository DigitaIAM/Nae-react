import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {getFromLocalStorage, writeToLocalStorage} from '../../global/helpers';
import './Table.scss';

const Table = ({ dataSource, settings }) => {
  const [visibleRows, setVisibleRows] = useState({
    start: 0,
    end: 0,
  });

  const tableWrapperRef = useRef();

  const tableBodyContainerRef = useRef();
  const tableRef = useRef();
  const tableBodyRef = useRef();

  const focusedRowRef = useRef();
  const focusedCellRef = useRef();

  const handleUpdateFocusedIndexes = (rowIndex, cellIndex) => {
    writeToLocalStorage('tableActiveRowIndex', rowIndex);
    writeToLocalStorage('tableActiveCellIndex', cellIndex);
  }

  const handleUpdateShowedRows = (nextRow, nextRowIndex) => {
    const nextRowHeight = nextRow.offsetHeight;

    const prevMarginTop = Number(tableRef.current.style.marginTop.replace('px', ''));
    console.log(nextRowIndex)
    if (nextRowIndex > visibleRows.end) {
      tableRef.current.style.marginTop = `${prevMarginTop - nextRowHeight}px`;

      setVisibleRows((prev) => ({
        start: prev.start + 1,
        end: prev.end + 1,
      }));
    }
    if (nextRowIndex < visibleRows.start) {
      console.log(prevMarginTop - nextRowHeight)
      tableRef.current.style.marginTop = `${prevMarginTop + nextRowHeight}px`;

      setVisibleRows((prev) => ({
        start: prev.start - 1,
        end: prev.end - 1,
      }));
    }
  }

  const handleFocusCell = (e) => {
    const focusedCellIndex = Array.prototype.indexOf.call(e.target.parentElement.children, e.target);
    const focusedRowIndex = Array.prototype.indexOf.call(tableBodyRef.current.children, e.target.parentElement);

    focusedCellRef.current = e.target;
    focusedRowRef.current = e.target.parentElement;

    e.target.focus();

    handleUpdateFocusedIndexes(focusedRowIndex, focusedCellIndex);
  }

  useEffect(() => {
    const handleArrowChangeDirection = (e) => {
      if (!focusedCellRef.current) {
        return;
      }

      const arrowKeyCodes = {
        // Arrow Left
        '37': 'previousElementSibling',
        // Arrow Top
        '38': 'previousElementSibling',
        // Arrow Right
        '39': 'nextElementSibling',
        // Arrow Bottom
        '40': 'nextElementSibling',
      }

      // Arrow Left & Arrow Right
      if (e.keyCode === 37 || e.keyCode === 39) {
        const sibling = focusedCellRef.current[arrowKeyCodes[e.keyCode]];

        if (sibling) {
          const focusedCellIndex = Array.prototype.indexOf.call(sibling.parentElement.children, sibling);
          const focusedRowIndex = Array.prototype.indexOf.call(tableBodyRef.current.children, focusedRowRef.current);

          focusedCellRef.current = sibling;
          sibling.focus();

          handleUpdateFocusedIndexes(focusedRowIndex, focusedCellIndex);
        }
      }

      // Arrow Top & Arrow Bottom
      if (e.keyCode === 38 || e.keyCode === 40) {
        const sibling = focusedRowRef.current[arrowKeyCodes[e.keyCode]];

        if (sibling) {
          const focusedCellIndex = Array.prototype.indexOf.call(focusedRowRef.current.children, focusedCellRef.current);
          const focusedRowIndex = Array.prototype.indexOf.call(tableBodyRef.current.children, sibling);

          focusedRowRef.current = sibling;
          focusedCellRef.current = sibling.children[focusedCellIndex];
          sibling.children[focusedCellIndex].focus();

          handleUpdateFocusedIndexes(focusedRowIndex, focusedCellIndex);
          handleUpdateShowedRows(sibling, focusedRowIndex);
        }
      }
    }

    if (tableWrapperRef.current) {
      tableBodyRef.current.addEventListener('keydown', handleArrowChangeDirection, false);
    }

    return () => {
      tableBodyRef.current.removeEventListener('keydown', handleArrowChangeDirection, false);
    }
  });

  useEffect(() => {
    const focusedRowIndex = getFromLocalStorage('tableActiveRowIndex');
    const focusedCellIndex = getFromLocalStorage('tableActiveCellIndex');

    if (focusedRowIndex && focusedCellIndex) {
      const focusedRow = tableBodyRef.current.children[focusedRowIndex];
      const focusedCell = focusedRow.children[focusedCellIndex];

      focusedRowRef.current = focusedRow;
      focusedCellRef.current = focusedCell;

      focusedCell.focus();
    }
  }, []);

  useEffect(() => {
    const onKeyDownScrollDisable = (e) => {
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    }

    document.addEventListener('keydown', onKeyDownScrollDisable, false);

    return () => {
      document.removeEventListener('keydown', onKeyDownScrollDisable, false);
    }
  }, []);

  useEffect(() => {
    if (tableBodyContainerRef.current) {
      const containerHeight = tableBodyContainerRef.current.clientHeight;

      const { index: lastVisibleItemIndex } = Array.from(tableBodyRef.current?.children || []).reduce((obj, tr, index) => {
        const newHeight = obj.height + tr.offsetHeight;

        if (newHeight <= containerHeight) {
          return {
            item: tr,
            height: newHeight,
            index,
          }
        }

        return obj;
      }, {
        item: null,
        height: 0,
        index: 0,
      });

      setVisibleRows((prev) => ({
        ...prev,
        end: lastVisibleItemIndex,
      }));
    }
  }, [tableBodyContainerRef.current])

  console.log(visibleRows)

  return (
    <div className="table-container">
      <div className="table-wrapper" ref={tableWrapperRef}>
        <table className="table">
          <colgroup>
            {settings.columns.map((column) => (
              <col style={{ width: column.width }} />
            ))}
          </colgroup>
          <thead className="table-header">
            <tr>
              {settings.columns.map((column) => (
                <th
                  key={column.key}
                  className="table-cell"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div ref={tableBodyContainerRef} className="table-body">
          <table ref={tableRef}>
            <colgroup>
              {settings.columns.map((column) => (
                <col style={{ width: column.width }} />
              ))}
            </colgroup>
            <tbody ref={tableBodyRef} className="table-tbody">
            {dataSource.map((item, rowIndex) => (
              <tr key={item.id}>
                {settings.columns.map((column,cellIndex) => (
                  <td
                    key={column.key}
                    tabIndex={rowIndex * settings.columns.length + (cellIndex + 1)}
                    onClick={handleFocusCell}
                    onFocus={handleFocusCell}
                  >
                    {item[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {
  dataSource: PropTypes.arrayOf((PropTypes.shape({}))),
  settings: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
      key: PropTypes.string.isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
  }).isRequired,
};

export default Table;
