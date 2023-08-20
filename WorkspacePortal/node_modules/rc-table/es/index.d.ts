import { EXPAND_COLUMN, INTERNAL_HOOKS } from './constant';
import { FooterComponents as Summary } from './Footer';
import Column from './sugar/Column';
import ColumnGroup from './sugar/ColumnGroup';
import type { TableProps } from './Table';
import Table, { genTable } from './Table';
import { INTERNAL_COL_DEFINE } from './utils/legacyUtil';
export { genTable, Summary, Column, ColumnGroup, TableProps, INTERNAL_COL_DEFINE, EXPAND_COLUMN, INTERNAL_HOOKS, };
export default Table;
