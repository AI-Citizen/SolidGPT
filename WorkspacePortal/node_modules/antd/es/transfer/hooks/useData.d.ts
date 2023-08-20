import type { KeyWise, TransferProps } from '..';
declare function useData<RecordType extends object>(dataSource?: RecordType[], rowKey?: TransferProps<RecordType>['rowKey'], targetKeys?: string[]): KeyWise<RecordType>[][];
export default useData;
