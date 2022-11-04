import React, {useEffect} from 'react';
import {isArray} from 'lodash';
import {useNavigate} from 'react-router-dom';
import {useGetMagazineQuery} from '../../../../global/services/magazinesService';
import Table from '../../../../components/Table/Table';
import Input from '../../../../components/Input';
import config from '../../../../config';
import {checkEventKey} from '../../../../components/Table/helpers';
import './DocumentPage.scss';
import Select from '../../../../components/Select';

const source = [
  [
    {
      "id": "name",
      "label": "Расход",
      "type": "text"
    },
    {
      "id": "number",
      "label": "#...",
      "type": "number"
    },
    {
      "id": "date",
      "label": "от 19/10/22",
      "type": "date"
    }
  ],
  [
    {
      "id": "counterparty",
      "label": "counterparty",
      "type": "combobox",
      "context": ["company"]
    },
    {
      "id": "contract",
      "label": "contract",
      "type": "combobox",
      "context": ["contract", "this.counterparty"]
    }
  ],
  {
    "id": "goods",
    "type": "table",
    "columns": [
      {
        id: 'label',
        name: 'Изделие',
        dataKey: ['label'],
      },
      {
        id: 'qty',
        name: 'Количество',
        dataKey: ['qty.uom', 'qty.number']
      },
      {
        id: 'cost',
        name: 'Сумма',
        dataKey: ['cost.currency', 'cost.number']
      },
      {
        id: 'note',
        name: 'Комментарий',
        dataKey: ['note'],
      }
    ]
  }
];

const DocumentPage = () => {
  const navigate = useNavigate();

  const { data: documentData, isLoading: isDocumentLoading, error: documentError } = useGetMagazineQuery();

  // Go back to documents page
  useEffect(() => {
    const handleGoBackOnKeyDown = (e) => {
      if(checkEventKey(e, config.shortcuts.document.goBack)) {
        e.preventDefault();

        navigate('/documents');
      }
    }

    document.addEventListener('keydown', handleGoBackOnKeyDown);

    return () => {
      document.removeEventListener('keydown', handleGoBackOnKeyDown);
    }
  }, [navigate]);

  useEffect(() => {
    const handleChangeFocus = (e) => {
      if (e.target.classList.contains('MuiButtonBase-root') || e.target.classList.contains('table--row-cell') || e.target.classList.contains('btn')) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const focusableElements = config.shortcuts.document.focusableElementsByEnter;

        const focusable = Array.prototype.filter.call(document.body.querySelectorAll(focusableElements), (element) => element.offsetWidth > 0 || element.offsetHeight || document.activeElement === element);

        const isRowActive = document.activeElement.classList.contains('table--row') || document.activeElement.classList.contains('table--row-cell');

        if (isRowActive) {
          return;
        }

        const activeIndex = document.activeElement ? focusable.indexOf(document.activeElement) : 0;
        const direction = 1;

        if ((activeIndex + direction < focusable.length)) {
          const nextElement = focusable[activeIndex + direction];

          if (nextElement.classList.contains('table--scroll-container-wrapper')) {
            const rowsArray = Array.from(nextElement.children || []);
            const firstRow = rowsArray[0];

            firstRow.focus();
            return;
          }

          nextElement.focus();
        }
      }
    }

    document.body.addEventListener('keydown', handleChangeFocus);

    return () => {
      document.body.removeEventListener('keydown', handleChangeFocus);
    }
  }, []);

  // Focus first input of the document
  useEffect(() => {
    const focusableElements = config.shortcuts.document.focusableElementsByEnter;

    const [focusedItem] = Array.prototype.filter.call(document.body.querySelectorAll(focusableElements), (element) => element.offsetWidth > 0 || element.offsetHeight || document.activeElement === element);

    focusedItem.focus();
  }, []);

  return (
    <div className="document-page-wrapper">
      <div className="document-page--content">
        {source.map((item) => {
          if (isArray(item)) {
            return (
              <div className="input-group">
                {item.map((input) => {
                  if (input.type === 'combobox') {
                    return (
                      <Select
                        key={item.id}
                        context={input.context}
                      />
                    )
                  }

                  return (
                    <Input
                      key={item.id}
                      type={input.type}
                      placeholder={input.label}
                      style={{
                        flex: `0 1 ${100 / item.length}%`,
                        maxWidth: `${100 / item.length}%`,
                      }}
                    />
                  )
                })}
              </div>
            );
          }

          if (item.type === 'table') {
            return (
              <Table
                key={item.id}
                idProperty="_id"
                tableId={`document_table_${item.id}`}
                source={{
                  columns: item.columns,
                }}
                data={(documentData || [])[item.id]}
                loading={isDocumentLoading}
                error={documentError}
                isCellSelectable
                isEditable
                savePosition={false}
              />
            )
          }

          return null;
        })}

        <div className="document--footer">
          <button
            type="button"
            className="btn btn-primary"
          >
            Создать
          </button>
          <button
            type="button"
            className="btn btn-secondary"
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
