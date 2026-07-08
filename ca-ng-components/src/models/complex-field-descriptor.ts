export interface IShComplexFieldDescriptor {
    name: string;
    fields?: Array<string | IShComplexFieldDescriptor>;
    isArray?: boolean;
}