import { GRAPHQL_HOST_URL } from './host-url.token';
import { GRAPHQL_RUNTIMETYPE } from './runtimetype.token';
import { SerializerService } from '@ca-webstack/ng-serializer';
import { Inject, Injectable, NgZone } from "@angular/core";
import { Apollo, APOLLO_OPTIONS, gql } from "apollo-angular";
import { ApolloClient, CombinedGraphQLErrors } from "@apollo/client";
import { map, take } from "rxjs/operators";
import { ShGraphQLField, IShGraphQLBuilder, IShGraphQLMutationBuilder, IShGraphQLPaging, ShGraphQLFilter, ShGraphQLFilterOperator, ShGraphQLSortBy, IShGraphQLResponse, IShGraphQLPageInfo, IShGraphQLEdge, ShGraphQLActionPayload } from '../models';
import { ShGraphQL } from '../features';

/**
 * GraphQL service
 */
@Injectable()
export class ShGraphQLService {
  /**
   * GraphQL service
   */
  constructor(
    private _serializer: SerializerService,
    private _ngZone: NgZone,
    @Inject(GRAPHQL_HOST_URL) private _hostUrl: string,
    @Inject(GRAPHQL_RUNTIMETYPE) _runtimeType: boolean,
    @Inject(APOLLO_OPTIONS) private _apolloOptions: ApolloClient.Options,
  ) {
    ShGraphQL.runtimeType = _runtimeType;
  }

  /**
   * Creates GraphQL query for a entity, with specific options and queryable fields
   * @param table Entity name
   * @param options Query options
   * @param fields Query fields
   * @returns The query
   */
  public query<T, R>(api: string, table: string, payload: ShGraphQLActionPayload, ...fields: Array<ShGraphQLField<T>>): IShGraphQLBuilder<T, R> {
    let queryBuilder: IShGraphQLBuilder<T, R> = {
      table,
      fields,
      parameters: payload,
      paginate: (paging: IShGraphQLPaging = {} as any) => queryBuilder = { ...queryBuilder, paging },
      where: (filtering: ShGraphQLFilter<T>, filterOperator = ShGraphQLFilterOperator.And) => queryBuilder = { ...queryBuilder, filtering, filterOperator },
      sortBy: (sorting: ShGraphQLSortBy<T>) => queryBuilder = { ...queryBuilder, sorting },
      pipe: (...operators) => queryBuilder = { ...queryBuilder, operators: operators },
      includeOptions: (options) => queryBuilder = { ...queryBuilder, options, paging: queryBuilder.paging || { pageSize: undefined } },
      subscribe: (next, error, complete) => {
        const query = ShGraphQL.buildQuery(table, queryBuilder, ...fields);
        const apollo = this.getClient(api);
        let observable = apollo.query({
          query: gql`${query}`
        }).pipe(
          map(response => this.deserialize(response, table, queryBuilder as any)),
          take(1)
        );
        queryBuilder.operators?.forEach(operator => {
          observable = observable.pipe(operator as any);
        });
        return observable.subscribe({next, error, complete});
      },
      toPromise: () => {
        const query = ShGraphQL.buildQuery(table, queryBuilder, ...fields);
        const apollo = this.getClient(api);
        let observable = apollo.query({
          query: gql`${query}`
        }).pipe(
          map(response => this.deserialize(response, table, queryBuilder as any)),
          take(1)
        );
        queryBuilder.operators?.forEach(operator => {
          observable = observable.pipe(operator as any);
        });
        return observable.toPromise() as Promise<any>;
      },
    };
    return queryBuilder;
  }

  /**
   * Creates GraphQL mutation
   * @param name Mutation name
   * @param payload Mutation payload
   * @param fields Mutation return value query fields
   * @returns The mutation
   */
  public mutation<R>(api: string, name: string, payload: ShGraphQLActionPayload, ...fields: Array<ShGraphQLField<R extends Array<infer U> ? U : R>>): IShGraphQLMutationBuilder<R> {
    let mutationBuilder: IShGraphQLMutationBuilder<R> = {
      pipe: (...operators) => mutationBuilder = { ...mutationBuilder, operators: operators },
      parameters: payload,
      fields,
      paginate: (paging = {} as any) => mutationBuilder = { ...mutationBuilder, paging },
      where: (filtering, filterOperator = ShGraphQLFilterOperator.And) => mutationBuilder = { ...mutationBuilder, filtering, filterOperator },
      sortBy: sorting => mutationBuilder = { ...mutationBuilder, sorting },
      includeOptions: (options) => mutationBuilder = { ...mutationBuilder, options, paging: mutationBuilder.paging || { pageSize: undefined } },
      subscribe: (next, error, complete) => {
        const mutation = ShGraphQL.buildMutation(name, mutationBuilder, ...fields);
        const apollo = this.getClient(api);
        let observable = apollo.mutate({
          mutation: gql`${mutation}`
        }).pipe(
          map(response => this.deserializeMutation(response, name, mutationBuilder)),
          take(1)
        );
        mutationBuilder.operators?.forEach(operator => {
          observable = observable.pipe(operator as any);
        });
        return observable.subscribe({next, error, complete});
      },
      toPromise: () => {
        const mutation = ShGraphQL.buildMutation(name, mutationBuilder, ...fields);
        const apollo = this.getClient(api);
        let observable = apollo.mutate({
          mutation: gql`${mutation}`
        }).pipe(
          map(response => this.deserializeMutation(response, name, mutationBuilder)),
          take(1)
        );
        mutationBuilder.operators?.forEach(operator => {
          observable = observable.pipe(operator as any);
        });
        return observable.toPromise() as Promise<any>;
      },
    };
    return mutationBuilder;
  }

  /**
   * Resets cache
   */
  public resetCache() {
    this._apolloOptions.cache.reset();
  }

  /**
   * Returns new instance of Apollo client
   * @param api Api URL
   */
  private getClient(api: string) {
    const options = { ...this._apolloOptions };
    options.link['options'].uri = `${this._hostUrl}/${api}`;
    return new Apollo(this._ngZone, options)
  }

  /**
   * Deserializes GraphQL response
   * @param response GraphQL response
   * @param table Table name
   * @param options Query options
   * @returns Deserialized GraphQL response
   */
  private deserialize<T, R>(response: Apollo.QueryResult<T>, table: string, options: IShGraphQLBuilder<T, R>): IShGraphQLResponse<R> {
    let data: R[];
    let pageInfo: IShGraphQLPageInfo;
    let edges: IShGraphQLEdge<R>[];
    let totalCount: number;
    let errors: any;
    if (response) {
      data = response.data[table];
      if (CombinedGraphQLErrors.is(response.error)) {
        errors = response.error.errors;
      }
      if (data) {
        if (options.options?.pageInfo) {
          pageInfo = (<any>data).pageInfo;
        }
        if (options.options?.cursorInfo) {
          edges = (<any>data).edges;
        }
        if (options.options?.totalCount) {
          totalCount = (<any>data).totalCount;
        }
        if (options.paging) {
          data = (<any>data).nodes || [];
        }
      }
    }
    let retval = this._serializer.serialize({ data, errors, pageInfo, edges, totalCount }) as string;
    retval = retval.replace(/runtimeType/g, '$type');
    return this._serializer.deserialize(retval);
  }

  /**
   * Deserializes GraphQL response
   * @param response GraphQL response
   * @param table Table name
   * @param options Mutation options
   * @returns Deserialized GraphQL response
   */
  private deserializeMutation<T, R>(response: Apollo.MutateResult<T>, name: string, options: IShGraphQLMutationBuilder<R>): IShGraphQLResponse<R> {
    let data: R[];
    let errors: any;
    let pageInfo: IShGraphQLPageInfo;
    let edges: IShGraphQLEdge<R>[];
    let totalCount: number;
    if (response) {
      data = response.data[name];
      if (CombinedGraphQLErrors.is(response.error)) {
        errors = response.error.errors;
      }
      if (options.options?.pageInfo) {
        pageInfo = (<any>data).pageInfo;
      }
      if (options.options?.cursorInfo) {
        edges = (<any>data).edges;
      }
      if (options.options?.totalCount) {
        totalCount = (<any>data).totalCount;
      }
      if (options.paging) {
        data = (<any>data).nodes || [];
      }
    }
    let retval = this._serializer.serialize({ data, errors, pageInfo, edges, totalCount }) as string;
    retval = retval.replace(/runtimeType/g, '$type');
    return this._serializer.deserialize(retval);
  }
}
