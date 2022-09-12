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
        name: 'name',
        header: 'Контрагент',
        defaultFlex: 2,
      },
      {
        name: 'sum_amount',
        header: null,
        group: 'sum',
        defaultFlex: 2,
        render: (dataObject) => dataObject.data.sum.amount,
      },
      {
        name: 'sum_currency',
        header: null,
        group: 'sum',
        defaultFlex: 2,
        render: (dataObject) => dataObject.data.sum.currency,
      },
      {
        name: 'comment',
        header: 'Комментарий',
        defaultFlex: 2,
      },
    ],
  },
};
