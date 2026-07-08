import { OperatorFunction, Subscription } from "rxjs";


/**
 * GraphQL page info
 */
export interface IShGraphQLPageInfo {
  /**
   * Specifies whether or not there is a page after the current one
   */
  hasNextPage?: boolean;
  /**
   * Specifies whether or not there is a page before the current one
   */
  hasPreviousPage?: boolean;
  /**
   * Specifies the query total count
   */
  totalCount?: number;
  /**
   * Specifies the pagination cursor end
   */
  endCursor?: string;
  /**
   * Specifies the pagination cursor start
   */
  startCursor?: string;
}


/**
 * GraphQL page edge
 */
export interface IShGraphQLEdge<T> {
  /**
   * Cursor state
   */
  cursor?: string;
  /**
   * Matched node
   */
  node?: T;
}

/**
 * GraphQL query response
 */
export interface IShGraphQLResponse<T> {
  /**
   * Page info
   */
  pageInfo?: IShGraphQLPageInfo;
  /**
   * List of page edges
   */
  edges?: IShGraphQLEdge<T>[];
  /**
   * Query total count
   */
  totalCount?: number;
  /**
   * Query actual result
   */
  data: T;
}

/**
 * GraphQL query options
 */
export interface IShGraphQLQueryOptions {
  /**
   * Specifies whether to receive page informations into the query response
   */
  pageInfo?: boolean;
  /**
   * Specifies whether to receive cursor informations into the query response
   */
  cursorInfo?: boolean;
  /**
   * Specifies whether to receive current cursored node informations into the query response
   */
  cursorNode?: boolean;
  /**
   * Specifies whether to receive total count into the query response
   */
  totalCount?: boolean;
}

/**
 * GraphQL field definition (fieldName or callback)
 */
export type ShGraphQLField<T> = keyof T | ((obj: T) => ShGraphQLAllowedQueryTypes);

/**
 * Forbidden properties
 */
export type ShGraphQLOmitFields = 'propertyChanged' | 'subscriptions' | 'status';

/**
 * Allowed query types
 */
export type ShGraphQLAllowedQueryTypes = number | string | boolean | Date | bigint | undefined | null;

/**
 * Query or Mutation payload
 */
export type ShGraphQLActionPayload = { [key: string]: any };

/**
 * GraphQL query builder
 */
export interface IShGraphQLBuilder<T, R> {
  /**
   * Table name
   */
  readonly table: string;
  /**
   * Query fields
   */
  readonly fields: Array<ShGraphQLField<T>>;
  /**
   * Query filter
   */
  readonly filtering?: ShGraphQLFilter<T> | ShGraphQLFilter<T>[];
  /**
   * Query sort
   */
  readonly sorting?: ShGraphQLSortBy<T>;
  /**
   * Query filter operator
   */
  readonly filterOperator?: ShGraphQLFilterOperator;
  /**
   * Query operators
   */
  readonly operators?: OperatorFunction<IShGraphQLResponse<R>, any>[];
  /**
   * Query options
   */
  readonly options?: IShGraphQLQueryOptions;
  /**
   * Specifies whether to compose query with pagination
   */
  readonly paging?: IShGraphQLPaging;
  /**
   * Query or Mutation payload
   */
  readonly parameters?: ShGraphQLActionPayload;
  /**
   * Specifies a query where clause (default value of filterOperator is ShGraphQLFilterOperator.And)
   */
  where?(options: ShGraphQLFilter<T> | ShGraphQLFilter<T>[], filterOperator?: ShGraphQLFilterOperator): IShGraphQLBuilder<T, R>;
  /**
   * Specifies a query sorting
   */
  sortBy(options: ShGraphQLSortBy<T>): IShGraphQLBuilder<T, R>;
  /**
   * Specifies whether to compose query with pagination
   */
  paginate?(options?: IShGraphQLPaging): IShGraphQLBuilder<T, R>;
  /**
   * Includes some query options
   */
  includeOptions?(options: IShGraphQLQueryOptions): IShGraphQLBuilder<T, R>;
  /**
   * Observable pipes
   */
  pipe?(...operators: OperatorFunction<IShGraphQLResponse<R>, any>[]): IShGraphQLBuilder<T, R>;
  /**
   * Subscribes to query source
   */
  subscribe(next?: (value: IShGraphQLResponse<R>) => void, error?: (error: any) => void, complete?: () => void): Subscription;
  /**
   * Returns promise from query source
   */
  toPromise(): Promise<IShGraphQLResponse<R>>
}

/**
 * GraphQL mutation builder
 */
export interface IShGraphQLMutationBuilder<R> {
  /**
   * Mutation return value query fields
   */
  readonly fields?: Array<ShGraphQLField<R extends Array<infer U> ? U : R>>;
  /**
   * Mutation return value query filter
   */
  readonly filtering?: ShGraphQLFilter<R extends Array<infer U> ? U : R>;
  /**
   * Mutation return value query sort
   */
  readonly sorting?: ShGraphQLSortBy<R extends Array<infer U> ? U : R>;
  /**
   * Mutation return value query filter operator
   */
  readonly filterOperator?: ShGraphQLFilterOperator;
  /**
   * Mutation operators
   */
  readonly operators?: OperatorFunction<IShGraphQLResponse<R>, any>[];
  /**
   * Mutation return value query options
   */
  readonly options?: IShGraphQLQueryOptions;
  /**
   * Specifies whether to compose mutation return value query with pagination
   */
  readonly paging?: IShGraphQLPaging;
  /**
   * Specifies a mutation return value query where clause (default value of filterOperator is ShGraphQLFilterOperator.And)
   */
  where?(options: ShGraphQLFilter<R extends Array<infer U> ? U : R>, filterOperator?: ShGraphQLFilterOperator): IShGraphQLMutationBuilder<R>;
  /**
   * Specifies a mutation return value query sorting
   */
  sortBy(options: ShGraphQLSortBy<R extends Array<infer U> ? U : R>): IShGraphQLMutationBuilder<R>;
  /**
   * Specifies whether to compose mutation return value query with pagination
   */
  paginate?(options?: IShGraphQLPaging): IShGraphQLMutationBuilder<R>;
  /**
   * Includes some mutation return value query options
   */
  includeOptions?(options: IShGraphQLQueryOptions): IShGraphQLMutationBuilder<R>;
  /**
   * Mutation parameters
   */
  readonly parameters?: ShGraphQLActionPayload;
  /**
   * Observable pipes
   */
  pipe?(...operators: OperatorFunction<IShGraphQLResponse<R>, any>[]): IShGraphQLMutationBuilder<R>;
  /**
   * Subscribes to mutation source
   */
  subscribe(next?: (value: IShGraphQLResponse<R>) => void, error?: (error: any) => void, complete?: () => void): Subscription;
  /**
   * Returns promise from mutation source
   */
  toPromise(): Promise<IShGraphQLResponse<R>>
}

/**
 * GraphQL where clause operator
 */
export enum ShGraphQLWhereOperator {
  Contains = 'contains',
  EndsWith = 'endsWith',
  Equal = 'eq',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  In = 'in',
  Like = 'like',
  LowerThan = 'lt',
  LowerThanOrEqual = 'lte',
  StartsWith = 'startsWith',
  NotContains = 'ncontains',
  NotEndsWith = 'nendsWith',
  NotEqual = 'neq',
  NotGreaterThan = 'ngt',
  NotGreaterThanOrEqual = 'ngte',
  NotIn = 'nin',
  NotLowerThan = 'nlt',
  NotLowerThanOrEqual = 'nlte',
  NotStartsWith = 'nstartsWith'
}

/**
 * GraphQL where clause definition
 */
export interface IShGraphQLQueryWhereCondition<T> {
  /**
   * Where clause operator
   */
  operator: ShGraphQLWhereOperator;
  /**
   * Where clause value
   */
  value: T;
}

/**
 * GraphQL filter definition
 */
export type ShGraphQLFilter<TObject> = {
  fieldName?: keyof TObject;
  operator?: ShGraphQLWhereOperator;
  value?: TObject[keyof TObject];
  and?: ShGraphQLFilter<TObject>[];
  or?: ShGraphQLFilter<TObject>[];
} & {
  [k in keyof TObject]?: {
    operator: ShGraphQLWhereOperator;
    value: TObject[k];
  }
};

/**
 * GraphQL Sort by definition
 */
export type ShGraphQLSortBy<TObject> = {
  [k in keyof TObject]?: ShGraphQLSortDirection;
};

/**
 * GraphQL Sort by direction
 */
export enum ShGraphQLSortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
};

/**
 * GraphQL filter operator
 */
export enum ShGraphQLFilterOperator {
  And = 'and',
  Or = 'or'
};

/**
 * GraphQL pagination criteria
 */
export interface IShGraphQLPaging {
  /**
   * Number of records to be returned per-page
   */
  pageSize: number;
  /**
   * The page index is multiplied by the current page size to determine which elements to return
   */
  pageIndex?: number;
}

/**
 * GraphQL projection
 */
export interface IShGraphQLProjection {
  /**
   * Field name
   */
  name: string;
  /**
   * List of related fields
   */
  fields: Array<string | IShGraphQLProjection>;
}

/**
 * Start escape for enum value
 */
export const ShGraphQLEnumStartEscape = '««';
/**
 * End escape for enum value
 */
export const ShGraphQLEnumEndEscape = '»»';