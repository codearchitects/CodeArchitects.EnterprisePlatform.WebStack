import { GRAPHQL_RUNTIMETYPE } from './runtimetype.token';
import { inject, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideApollo } from 'apollo-angular';
import { ApolloCache, InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-angular/http';
import { ShGraphQLService } from './graphql.service';
import { GRAPHQL_HOST_URL } from '../public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ShGraphQLModule {
  static forRoot(hostUrl: string, runtimeType = true, cache: ApolloCache = new InMemoryCache()): ModuleWithProviders<ShGraphQLModule> {
    return {
      ngModule: ShGraphQLModule,
      providers: [
        { provide: GRAPHQL_HOST_URL, useValue: hostUrl },
        { provide: GRAPHQL_RUNTIMETYPE, useValue: runtimeType },
        provideApollo(() => {
          const httpLink = inject(HttpLink);
          return {
            cache,
            link: httpLink.create({
              uri: hostUrl
            })
          };
        }),
        ShGraphQLService
      ]
    };
  }

  static forChild(hostUrl: string, runtimeType = true, cache: ApolloCache = new InMemoryCache()): ModuleWithProviders<ShGraphQLModule> {
    return {
      ngModule: ShGraphQLModule,
      providers: [
        { provide: GRAPHQL_HOST_URL, useValue: hostUrl },
        { provide: GRAPHQL_RUNTIMETYPE, useValue: runtimeType },
        provideApollo(() => {
          const httpLink = inject(HttpLink);
          return {
            cache,
            link: httpLink.create({
              uri: hostUrl
            })
          };
        }),
        ShGraphQLService
      ]
    };
  }
}
