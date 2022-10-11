export default {
  shortcuts: {
    table: {
      row: {
        editStart: {
          key: 'e',
          ctrl: true,
        },
        moveNext: 'ArrowDown',
        movePrev: 'ArrowUp',
      },
      cell: {
        moveNext: 'ArrowRight',
        movePrev: 'ArrowLeft',
        moveUp: 'ArrowUp',
        moveDown: 'ArrowDown',
        editStart: {
          key: 'Enter',
          ctrl: false,
        },
        editEnd: {
          key: 'Enter',
          ctrl: false,
        }
      }
    },
  },
};