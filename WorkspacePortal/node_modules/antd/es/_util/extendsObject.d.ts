type RecordType = Record<string, any>;
declare function extendsObject<T extends RecordType>(...list: T[]): RecordType;
export default extendsObject;
