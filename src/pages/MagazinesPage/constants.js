import moment from 'moment';

export const MAGAZINES_PAGE = {
  table: {
    gridStyle: {
      minHeight: '100vh',
    },
    groups: [
      {
        name: 'sum',
        header: 'Сумма',
      }
    ],
    columns: [
      {
        name: 'date',
        header: 'Дата',
        defaultFlex: 2,
        render: (dataObject) => moment(dataObject.data.date).format("DD.MM.YYYY"),
      },
      {
        name: 'counterparty',
        header: 'Контрагент',
        defaultFlex: 2,
        render: (dataObject) => `${dataObject.data.counterparty.company.label}`,
      },
      {
        name: 'sum_amount',
        header: null,
        group: 'sum',
        defaultFlex: 2,
        render: (dataObject) => dataObject.data?.goods?.reduce((acc, item) => (acc + item.cost.number), 0),
      },
      {
        name: 'sum_currency',
        header: null,
        group: 'sum',
        defaultFlex: 2,
        render: (dataObject) => dataObject.data.goods[0]?.cost.currency,
      },
      {
        name: 'comment',
        header: 'Комментарий',
        defaultFlex: 2,
        render: null,
      },
    ],
  },
};
