import { IShGraphQLBuilder, IShGraphQLMutationBuilder, IShGraphQLPaging, IShGraphQLResponse, ShGraphQLFilterOperator, ShGraphQLSortBy, ShGraphQLSortDirection, ShGraphQLWhereOperator } from "src/models";
import { ShGraphQL } from "./graphql";
import { Subscription } from "rxjs";

describe('ShGraphQL', () => {

	enum Sex {
		Male,
		Female
	}

	class Customer {
		id: string;
		name: string;
		age: number;
		sex: Sex;
	}

	describe('buildQuery', () => {
		it('should build a valid query', () => {
			const table = 'customers';
			const queryBuilder: IShGraphQLBuilder<Customer, string> = {
				table: 'customers',
				fields: [],
				sortBy: function (options: ShGraphQLSortBy<Customer>): IShGraphQLBuilder<Customer, string> {
					throw new Error("Function not implemented.");
				},
				subscribe: function (next?: (value: IShGraphQLResponse<string>) => void, error?: (error: any) => void, complete?: () => void): Subscription {
					throw new Error("Function not implemented.");
				},
				toPromise: function (): Promise<IShGraphQLResponse<string>> {
					throw new Error("Function not implemented.");
				}
			};
			const query = ShGraphQL.buildQuery(table, queryBuilder, 'id', 'name');
			expect(query).toEqual('query { customers { id name } }');
		});

		it('should build a valid query with simple where condition', () => {
			const table = 'customers';
			const queryBuilder: IShGraphQLBuilder<Customer, string> = {
				filtering: { id: { operator: ShGraphQLWhereOperator.Equal, value: '123' } },
				filterOperator: ShGraphQLFilterOperator.And,
				table: 'customers',
				fields: [],
				sortBy: function (options: ShGraphQLSortBy<Customer>): IShGraphQLBuilder<Customer, string> {
					throw new Error("Function not implemented.");
				},
				subscribe: function (next?: (value: IShGraphQLResponse<string>) => void, error?: (error: any) => void, complete?: () => void): Subscription {
					throw new Error("Function not implemented.");
				},
				toPromise: function (): Promise<IShGraphQLResponse<string>> {
					throw new Error("Function not implemented.");
				}
			};
			const query = ShGraphQL.buildQuery(table, queryBuilder, 'id', 'name');
			expect(query).toEqual('query { customers( where: {and: [{id: {eq: "123"}}]}) { id name } }');
		});

		it('should build a valid query with sorting', () => {
			const table = 'customers';
			let queryBuilder: IShGraphQLBuilder<Customer, string> = {
				table: 'customers',
				fields: [],
				sortBy: (sorting: ShGraphQLSortBy<Customer>) => queryBuilder = { ...queryBuilder, sorting },
				subscribe: function (next?: (value: IShGraphQLResponse<string>) => void, error?: (error: any) => void, complete?: () => void): Subscription {
					throw new Error("Function not implemented.");
				},
				toPromise: function (): Promise<IShGraphQLResponse<string>> {
					throw new Error("Function not implemented.");
				}
			};
			queryBuilder.sortBy({ name: ShGraphQLSortDirection.ASC });
			const query = ShGraphQL.buildQuery(table, queryBuilder, 'id', 'name');
			expect(query).toEqual('query { customers( order: {name: ASC}) { id name } }');
		});

		it('should build a valid query with pagination', () => {
			const table = 'customers';
			let queryBuilder: IShGraphQLBuilder<Customer, string> = {
				table: 'customers',
				fields: [],
				sortBy: (sorting: ShGraphQLSortBy<Customer>) => queryBuilder = { ...queryBuilder, sorting },
				paginate: (paging: IShGraphQLPaging = {} as any) => queryBuilder = { ...queryBuilder, paging },
				subscribe: function (next?: (value: IShGraphQLResponse<string>) => void, error?: (error: any) => void, complete?: () => void): Subscription {
					throw new Error("Function not implemented.");
				},
				toPromise: function (): Promise<IShGraphQLResponse<string>> {
					throw new Error("Function not implemented.");
				}
			};
			queryBuilder.paginate({ pageIndex: 1, pageSize: 10 })
			const query = ShGraphQL.buildQuery(table, queryBuilder, 'id', 'name');
			expect(query).toEqual('query { customers( first: 10 after: "OQ==") { nodes {  id name } } }');
		});

		it('should build a valid query with enum where condition', () => {
			const table = 'customers';
			const queryBuilder: IShGraphQLBuilder<Customer, string> = {
				filtering: { sex: { operator: ShGraphQLWhereOperator.Equal, value: ShGraphQL.enumValue(Sex, 'Male') } },
				filterOperator: ShGraphQLFilterOperator.And,
				table: 'customers',
				fields: [],
				sortBy: function (options: ShGraphQLSortBy<Customer>): IShGraphQLBuilder<Customer, string> {
					throw new Error("Function not implemented.");
				},
				subscribe: function (next?: (value: IShGraphQLResponse<string>) => void, error?: (error: any) => void, complete?: () => void): Subscription {
					throw new Error("Function not implemented.");
				},
				toPromise: function (): Promise<IShGraphQLResponse<string>> {
					throw new Error("Function not implemented.");
				}
			};
			const query = ShGraphQL.buildQuery(table, queryBuilder, 'id', 'name');
			expect(query).toEqual('query { customers( where: {and: [{sex: {eq: MALE}}]}) { id name } }');
		});

		it('should build a valid query with enum parameter condition', () => {
			const table = 'customers';
			const queryBuilder: IShGraphQLBuilder<Customer, string> = {
				parameters: { sex: ShGraphQL.enumValue(Sex, 'Male') },
				table: 'customers',
				fields: [],
				sortBy: function (options: ShGraphQLSortBy<Customer>): IShGraphQLBuilder<Customer, string> {
					throw new Error("Function not implemented.");
				},
				subscribe: function (next?: (value: IShGraphQLResponse<string>) => void, error?: (error: any) => void, complete?: () => void): Subscription {
					throw new Error("Function not implemented.");
				},
				toPromise: function (): Promise<IShGraphQLResponse<string>> {
					throw new Error("Function not implemented.");
				}
			};
			const query = ShGraphQL.buildQuery(table, queryBuilder, 'id', 'name');
			expect(query).toEqual('query { customers(sex: MALE) { id name } }');
		});
	});

	describe('buildMutation', () => {
		it('should build a valid mutation', () => {
			const name = 'createCustomer';
			const queryBuilder: IShGraphQLMutationBuilder<Customer> = {
				filterOperator: ShGraphQLFilterOperator.And,
				fields: [],
				parameters: { name: 'John Doe', age: 30 },
				sortBy: function (options: ShGraphQLSortBy<Customer>): IShGraphQLMutationBuilder<Customer> {
					throw new Error("Function not implemented.");
				},
				subscribe: function (next?: (value: IShGraphQLResponse<Customer>) => void, error?: (error: any) => void, complete?: () => void): Subscription {
					throw new Error("Function not implemented.");
				},
				toPromise: function (): Promise<IShGraphQLResponse<Customer>> {
					throw new Error("Function not implemented.");
				}
			};
			const mutation = ShGraphQL.buildMutation(name, queryBuilder);
			expect(mutation).toEqual('mutation { createCustomer(name: "John Doe",age: 30) }');
		});

		it('should build a valid mutation with complex data return value', () => {
			const name = 'createCustomer';
			const queryBuilder: IShGraphQLMutationBuilder<Customer> = {
				filterOperator: ShGraphQLFilterOperator.And,
				fields: [],
				parameters: { name: 'John Doe', age: 30 },
				sortBy: function (options: ShGraphQLSortBy<Customer>): IShGraphQLMutationBuilder<Customer> {
					throw new Error("Function not implemented.");
				},
				subscribe: function (next?: (value: IShGraphQLResponse<Customer>) => void, error?: (error: any) => void, complete?: () => void): Subscription {
					throw new Error("Function not implemented.");
				},
				toPromise: function (): Promise<IShGraphQLResponse<Customer>> {
					throw new Error("Function not implemented.");
				}
			};
			const mutation = ShGraphQL.buildMutation(name, queryBuilder, 'id', 'name');
			expect(mutation).toEqual('mutation { createCustomer(name: "John Doe",age: 30) { id name }}');
		});

		it('should build a valid mutation with filtering', () => {
			const name = 'updateCustomer';
			const queryBuilder: IShGraphQLMutationBuilder<Customer> = {
				filterOperator: ShGraphQLFilterOperator.And,
				filtering: { id: { operator: ShGraphQLWhereOperator.Equal, value: '123' } },
				fields: [],
				parameters: { name: 'John Doe', age: 30 },
				sortBy: function (options: ShGraphQLSortBy<Customer>): IShGraphQLMutationBuilder<Customer> {
					throw new Error("Function not implemented.");
				},
				subscribe: function (next?: (value: IShGraphQLResponse<Customer>) => void, error?: (error: any) => void, complete?: () => void): Subscription {
					throw new Error("Function not implemented.");
				},
				toPromise: function (): Promise<IShGraphQLResponse<Customer>> {
					throw new Error("Function not implemented.");
				}
			};
			const mutation = ShGraphQL.buildMutation(name, queryBuilder);
			expect(mutation).toEqual('mutation { updateCustomer(name: "John Doe",age: 30 where: {and: [{id: {eq: "123"}}]}) }');
		});

	});

});
