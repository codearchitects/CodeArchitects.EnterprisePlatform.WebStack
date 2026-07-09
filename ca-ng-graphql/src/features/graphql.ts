import { DateOnly } from '@ca-webstack/data-structures';
import { IShGraphQLBuilder, IShGraphQLMutationBuilder, IShGraphQLProjection, ShGraphQLEnumEndEscape, ShGraphQLEnumStartEscape, ShGraphQLField, ShGraphQLFilter } from '../models';

/**
 * CAEP GraphQL features
 */
export namespace ShGraphQL {

  /**
  * Specifies whether to show entities runtime type
  */
  export let runtimeType = false;

  /**
  * Creates GraphQL query for a entity, with specific options and queryable fields
  * @param table Entity name
  * @param options Query options
  * @param fields Query entity fields
  * @returns Composed GraphQL query
  */
  export function buildQuery<T, R>(table: string, options: IShGraphQLBuilder<T, R>, ...fields: Array<ShGraphQLField<T>>) {
    fields = resolveFields(...fields);
    return `query { ${table}${buildQueryParameters(options)} { ${buildQueryOptions(options, ...fields as Array<keyof T>)} } }`;
  }
  /**
  * Creates GraphQL mutation
  * @param name Mutation name
  * @param options Query options
  * @param fields Mutation return value query entity fields
  * @returns Composed GraphQL query
  */
  export function buildMutation<R>(name: string, options: IShGraphQLMutationBuilder<R>, ...fields: Array<ShGraphQLField<R extends Array<infer U> ? U : R>>) {
    fields = resolveFields(...fields);
    const query = !!fields?.length ? `{ ${buildQueryOptions(options, ...fields as Array<keyof R>)} }` : ''
    return `mutation { ${name}${buildMutationParameters(options)} ${query}}`;
  }

  /**
   * Returns a query string for a field of type array.
   * WARN: USE THIS FUNCTION JUST IN A QUERY CONTEXT
   * (e.g. queryCustomers('name','surname', c => ShGraphQL.queryArray(c.children, 'name', 'age'))
   * @param field Field of type array
   * @param fields Field names of field of type array
   * @returns Composed query string
   */
  export function queryArray<T>(field: Array<T>, ...fields: Array<ShGraphQLField<T>>): any {
    fields = resolveFields(...fields);
    fields = decomposeFields(...fields as Array<keyof T>);
    return composeField(field as unknown as string, ...fields as Array<keyof T>)
  }

  /**
   * Returns the enum value for GraphQL Query
   * @param e Enum type
   * @param value Enum value
   * @returns Enum value for GraphQL Query
   */
  export function enumValue<T>(e: T, value: keyof T): T[keyof T] {
    let retval: any = '';
    if (value in (<any>e)) {
      retval = `${ShGraphQLEnumStartEscape}${String(value).toUpperCase()}${ShGraphQLEnumEndEscape}`;
    }
    return retval;
  }

  /**
   * Specifies whether a parameter value is formatted like a GraphQL Query enum
   * @param value Value to check
   * @returns True if value is formatted like a GraphQL Query enum
   */
  export function isGraphQLEnum(value: any) {
    if (typeof value === 'string') {
      return value.indexOf(ShGraphQLEnumStartEscape) > -1 && value.indexOf(ShGraphQLEnumEndEscape) > -1;
    }
    return false;
  }

  /**
   * Adds where clause or sort by rule to the query
   * @param options Query options
   * @returns Where clause/Sort by rule query
   */
  function buildQueryParameters<T, R>(options: IShGraphQLBuilder<T, R>) {
    let retval: string = '';
    if (options?.filtering || options?.sorting || options?.paging || options?.parameters) {
      if (options.parameters) {
        const parameters = [];
        for (const parameterName in options.parameters) {
          const parameter = options.parameters[parameterName];
          let value = typeof parameter === 'string' ? `"${parameter}"` : parameter;
          if (value !== undefined && value !== null) {
            if (isGraphQLEnum(value)) {
              value = (<string>value).replace(/"/g, '').replace(ShGraphQLEnumStartEscape, '').replace(ShGraphQLEnumEndEscape, '');
            }
            parameters.push(`${parameterName}: ${value}`);
          }
        }
        retval = `${parameters.join(`,`)}`;
      }
      if (options.filtering) {
        const parameters: string[] = [];
        if (Array.isArray(options.filtering)) {
          parameters.push(...buildRecursiveParameters(options.filtering));
        } else {
          // TODO: handle complex object too with and/or!
          for (const fieldName in options.filtering) {
            const filter = options.filtering[fieldName];
            parameters.push(`{${fieldName}: {${filter.operator}: ${getFilterValue(filter)}}}`);
          }
        }
        retval = `${retval} where: {${options.filterOperator}: [${parameters.join(`,`)}]}`;
      }
      if (options.sorting) {
        const parameters = [];
        for (const fieldName in options.sorting) {
          const direction = options.sorting[fieldName];
          parameters.push(`${fieldName}: ${direction}`);
        }
        retval = `${retval} order: {${parameters.join(`,`)}}`;
      }
      if (options.paging) {
        const { pageIndex, pageSize } = options.paging;
        if (pageSize) {
          retval = `${retval} first: ${pageSize}`;
          if (pageIndex) {
            const prevIndex: any = (pageIndex * pageSize) - 1;
            const after = btoa(prevIndex);
            retval = `${retval} after: "${after}"`;
          }
        }
      }
    }
    if (retval.length) {
      retval = `(${retval})`;
    }
    return retval;
  }

  /**
   * Get the processed value of a filter.
   * @param filter The filter object containing a 'value' property.
   * @returns The processed value of the filter.
   */
  function getFilterValue(filter: any) {
    // Extract the 'value' property from the filter object
    let value = typeof filter.value === 'string' ? `"${filter.value}"` : filter.value;

    // Check if the value is a GraphQL enum
    if (isGraphQLEnum(value)) {
      // If it's a GraphQL enum, remove quotes and escape characters
      value = (<string>value)
        .replace(/"/g, '') // Remove double quotes
        .replace(ShGraphQLEnumStartEscape, '') // Remove start escape character
        .replace(ShGraphQLEnumEndEscape, ''); // Remove end escape character
    } else if (value instanceof Date) {
      // value = `"${value.toDateString()}"`;
      const year: string = value.getFullYear().toString();
      const month: string = (value.getMonth() + 1).toString().padStart(2, '0');
      const day: string = value.getDate().toString().padStart(2, '0');
      return `"${year}-${month}-${day}"`;
    }

    // Return the processed value
    return value;
  }

  /**
   * Build recursive parameters for a GraphQL query based on CfGraphQLFilter<T> objects.
   * @param filters An array of CfGraphQLFilter<T> objects.
   * @returns An array of string parameters for a GraphQL query.
   */
  function buildRecursiveParameters<T>(filters: ShGraphQLFilter<T>[]) {
    const parameters: string[] = [];

    for (const filter of filters) {
      if (filter.or?.length) {
        // If 'or' property exists and has length, recursively build parameters for 'or' array
        parameters.push(`{or: [${buildRecursiveParameters(filter.or)}]}`);
      } else if (filter.and?.length) {
        // If 'and' property exists and has length, recursively build parameters for 'and' array
        parameters.push(`{and: [${buildRecursiveParameters(filter.and)}]}`);
      } else {
        // If neither 'or' nor 'and' is present, build a parameter for the current filter
        parameters.push(`{${filter.fieldName as string}: {${filter.operator}: ${getFilterValue(filter)}}}`);
      }
    }

    return parameters;
  }
  /**
   * Adds serialized parameters to the mutation
   * @param options Mutation options
   * @returns Mutation parameters
   */
  function buildMutationParameters<R>(options: IShGraphQLMutationBuilder<R>) {
    let retval: string = '';
    if (options?.parameters) {
      retval = serializeObject(options.parameters, true);
    }
    if (options?.filtering) {
      const parameters = [];
      for (const fieldName in options.filtering) {
        const filter = options.filtering[fieldName];
        const value = typeof filter.value === 'string' ? `"${filter.value}"` : filter.value;
        parameters.push(`{${fieldName}: {${filter.operator}: ${value}}}`);
      }
      retval = `${retval} where: {${options.filterOperator}: [${parameters.join(`,`)}]}`;
    }
    if (options?.sorting) {
      const parameters = [];
      for (const fieldName in options.sorting) {
        const direction = options.sorting[fieldName];
        parameters.push(`${fieldName}: ${direction}`);
      }
      retval = `${retval} order: {${parameters.join(`,`)}}`;
    }
    if (options?.paging) {
      const { pageIndex, pageSize } = options.paging;
      if (pageSize) {
        retval = `${retval} first: ${pageSize}`;
        if (pageIndex) {
          const prevIndex: any = (pageIndex * pageSize) - 1;
          const after = btoa(prevIndex);
          retval = `${retval} after: "${after}"`;
        }
      }
    }
    if (retval.length) {
      retval = `(${retval})`;
    }
    return retval;
  }

  /**
   * Decomposes fields and adds options to GraphQL query
   * @param options Query options
   * @param fields Query fields
   * @returns Query with options
   */
  function buildQueryOptions<T, R>(options: IShGraphQLBuilder<T, R> | IShGraphQLMutationBuilder<R>, ...fields: Array<keyof T>) {
    fields = decomposeFields(...fields);
    let retval: string = options.paging ? composeField('nodes', ...fields) : composeField('', ...fields);
    if (options.options?.pageInfo) {
      retval = `${retval} pageInfo { hasNextPage hasPreviousPage ${options.options.cursorInfo ? 'startCursor endCursor' : ''} }`;
    }
    if (options.options?.totalCount) {
      retval = `${retval} totalCount`;
    }
    if (options.options?.cursorInfo || options.options?.cursorNode) {
      retval = `${retval} edges { cursor ${options.options.cursorNode ? composeField('node', ...fields) : ''} }`;
    }
    return retval;
  }

  /**
   * Returns list of calculated field names to query.
   * @param fields List of fields
   * @returns Calculated field names
   */
  function resolveFields<T>(...fields: Array<ShGraphQLField<T>>) {
    return fields.map(f => {
      if (typeof f === 'function') {
        const stringFunction = f.toString();
        if (stringFunction.indexOf('.queryArray') > -1) {
          const fieldName = stringFunction.match(/(?<=queryArray\(.*\.).*?(?=,)/)[0];
          f = f({ [fieldName]: fieldName } as any) as keyof T;
        } else {
          f = stringFunction.replace(/.*\=\>.*?\./, '') as keyof T;
        }
      }
      return f;
    });
  }

  /**
   * Composes query for specific field
   * @param field Field name for which to compose the query
   * @param fields List of fields needed to compose the query
   * @returns The composed field query
   */
  function composeField<T, K>(field?: keyof T, ...fields: Array<keyof K | IShGraphQLProjection>): keyof T {
    fields = fields.map(fieldName => {
      if (typeof fieldName !== 'string') {
        const projection = fieldName as IShGraphQLProjection;
        fieldName = composeField(projection.name as keyof T, ...projection.fields) as unknown as keyof K;
      }
      return fieldName;
    });
    let query = `${fields.join(' ')}`;
    if (runtimeType) {
      query = `${query} runtimeType`;
    }
    return (field ? `${String(field)} {  ${query} }` : query) as keyof T;
  }

  /**
   * Decomposes fields, returning projections whether fields are composed, otherwise the fields themselves
   * @param fields Fields to be decomposed
   * @returns The fields themselves and/or the projections
   */
  function decomposeFields<T>(...fields: Array<keyof T>): Array<keyof T> {
    fields = fields.sort();
    const retval: Array<keyof T | IShGraphQLProjection> = [];
    fields.forEach(field => {
      field = decomposeField(field, retval) as keyof T;
      if (field) {
        retval.push(field);
      }
    });
    return retval as Array<keyof T>;
  }

  /**
   * Decomposes field, returning projections whether field is composed, otherwise the field itself
   * @param field Field to be decomposed
   * @param projections Reference of current projections list
   * @returns The field itself or the new projection
   */
  function decomposeField<T>(field: keyof T, projections: Array<keyof T | IShGraphQLProjection>) {
    if ((<string>field).indexOf('.') > -1) {
      const projectionNames = (<string>field).split('.');
      const projectionName = projectionNames.splice(0, 1)[0];
      let projection = projections.find((prj: IShGraphQLProjection) => prj.name === projectionName) as IShGraphQLProjection;
      let retval: IShGraphQLProjection;
      if (!projection) {
        projection = { name: projectionName, fields: [] };
        retval = projection;
      }
      if (projectionNames.length > 1) {
        const prj = decomposeField(projectionNames.join('.'), (<IShGraphQLProjection>projection).fields) as IShGraphQLProjection;
        if (prj) {
          projection.fields.push(prj);
        }
      } else {
        projection.fields.push(projectionNames[0]);
      }
      return retval;
    } else {
      return field;
    }
  }

  /**
   * Serializes a CAEP DTO
   * @param obj CAEP DTO
   * @param removeBrackets Specifies whether to remove brackets from serialized result
   * @returns Serialized Object
   */
  function serializeObject(obj: Object, removeBrackets = false) {
    let retval: string = '';
    const fields = [];
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key === 'status' || key === '_changeTracker' || key === '_propertyChanged') {
          continue;
        }
        let value = obj[key];
        if (value !== undefined && value !== null) {
          if (value instanceof DateOnly) {
            value = value.toISOString().replace(/T.*/, '');
          } else if (value instanceof Date) {
            value = value.toISOString();
          }
          switch (typeof value) {
            case 'string':
              value = `"${value}"`;
              break;
            case 'object':
              if (Array.isArray(value)) {
                let temp = '[';
                value.forEach((item, index) => {
                  temp = `${temp}${index > 0 ? ',' : ''}${serializeObject(item)}`;
                });
                value = `${temp}]`;
              } else {
                value = serializeObject(value);
              }
              break;
            default:
              break;
          }
          if (key.startsWith('_')) {
            key = key.replace('_', '');
          }
          fields.push(`${key}: ${value}`);
        }
      }
    }
    if (obj['trackingState'] !== undefined && obj['trackingState'] !== null) {
      let trackingState: string;
      switch (obj['trackingState']) {
        case 0:
        default:
          trackingState = 'DETACHED';
          break;
        case 1:
          trackingState = 'UNCHANGED';
          break;
        case 2:
          trackingState = 'ADDED';
          break;
        case 4:
          trackingState = 'MODIFIED';
          break;
        case 8:
          trackingState = 'REMOVED';
          break;
      }
      fields.push(`trackingState: ${trackingState}`);
    }
    retval = `${fields.join(`,`)}`;
    if (retval.length) {
      retval = removeBrackets ? retval : `{${retval}}`;
    }
    return retval;
  }
}
