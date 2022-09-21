import * as lodash from 'lodash';

export const compareRows = (row, compareRow) => {
  const _row = lodash.cloneDeep(row);
  const _compareRow = lodash.cloneDeep(compareRow);

  delete _row['_id'];
  delete _compareRow['_id'];

  const rowJSON = JSON.stringify(_row);
  const compareRowJSON = JSON.stringify(_compareRow);

  return rowJSON === compareRowJSON;
}
