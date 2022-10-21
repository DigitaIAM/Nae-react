import React from 'react';
import PropTypes from 'prop-types';
import {isArray} from 'lodash';
import {useGetMagazineQuery} from '../../../../global/services/magazinesService';
import './DocumentPage.scss';
import Table from '../../../../components/Table/Table';
import Input from '../../../../components/Input';

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

const DocumentPage = props => {
  const { data: documentData, isLoading: isDocumentLoading, error: documentError } = useGetMagazineQuery();

  return (
    <div className="document-page-wrapper">
      <div className="document-page--content">
        {source.map((item) => {
          if (isArray(item)) {
            return (
              <div className="input-group">
                {item.map((input) => (
                  <Input
                    type={input.type}
                    placeholder={input.label}
                    style={{
                      flex: `0 1 ${100 / item.length}%`,
                      maxWidth: `${100 / item.length}%`,
                    }}
                  />
                ))}
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
                maxHeight="450"
                isCellSelectable
                isEditable
              />
            )
          }
        })}
      </div>
    </div>
  );
};

DocumentPage.propTypes = {
  
};

export default DocumentPage;