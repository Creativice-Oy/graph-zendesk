import fetch from 'node-fetch';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { Account, Group, Organization, Ticket, User } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;
export type PageIteratee<T> = (page: T[]) => Promise<void>;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private readonly baseUrl = `${this.config.zendeskSubdomain}.zendesk.com/api/v2`;
  private readonly paginateEntitiesPerPage = 100;

  async apiRequestWithErrorHandling(
    path: string,
    attemptCounter = 1,
  ): Promise<any> {
    if (attemptCounter >= 10) {
      throw new Error('Max API request attempts reached.');
    }
    try {
      const res = await fetch(`https://${this.baseUrl}${path}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.config.zendeskAccessToken}`,
        },
      });
      const status = res.status;
      if (status === 429) {
        // Rate limit exceeded
        const retryAfter = res.headers.get('Retry-After');
        // We want to wait for the necessary time + 3s and then retry
        const retryAfterMs = Number(retryAfter || 5) * 1000 + 3000;
        await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
        return this.apiRequestWithErrorHandling(path, attemptCounter + 1);
      }
      if (status === 500) {
        if (attemptCounter > 1) {
          throw new Error('Internal server error.');
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return this.apiRequestWithErrorHandling(path, 2);
      }
      const body = await res.json();
      return body;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: path,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  async apiRequestWithPagination<T>(
    path: string,
    pageIteratee: PageIteratee<T>,
  ): Promise<void> {
    try {
      let nextPageQueryString: string | null = null;
      do {
        let response;
        if (nextPageQueryString) {
          response = await this.apiRequestWithErrorHandling(
            `${path}.json?${nextPageQueryString}`,
          );
        } else {
          response = await this.apiRequestWithErrorHandling(
            `${path}.json?page[size]=${this.paginateEntitiesPerPage}`,
          );
        }
        const resource = path.split('/')[1];
        if (response?.meta?.has_more) {
          nextPageQueryString = response?.links?.next?.split('?')[1];
        } else {
          nextPageQueryString = null;
        }
        await pageIteratee(response[resource]);
      } while (nextPageQueryString);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: path,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      const users = (await this.apiRequestWithErrorHandling('/users.json'))
        .users;
      if (!users) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: '/users',
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(iteratee: ResourceIteratee<User>): Promise<void> {
    await this.apiRequestWithPagination<User>('/users', async (users) => {
      for (const user of users) {
        await iteratee(user);
      }
    });
  }

  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroups(iteratee: ResourceIteratee<Group>): Promise<void> {
    await this.apiRequestWithPagination<Group>('/groups', async (groups) => {
      for (const group of groups) {
        await iteratee(group);
      }
    });
  }

  /**
   * Iterates each organization resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateOrganizations(
    iteratee: ResourceIteratee<Organization>,
  ): Promise<void> {
    await this.apiRequestWithPagination<Organization>(
      '/organizations',
      async (organizations) => {
        for (const organization of organizations) {
          await iteratee(organization);
        }
      },
    );
  }

  /**
   * Iterates each ticket resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateTickets(
    iteratee: ResourceIteratee<Ticket>,
  ): Promise<void> {
    await this.apiRequestWithPagination<Ticket>('/tickets', async (tickets) => {
      for (const ticket of tickets) {
        await iteratee(ticket);
      }
    });
  }

  public async getCurrentUser(): Promise<User> {
    return (await this.apiRequestWithErrorHandling(`/users/me.json`)).user;
  }

  public async getCurrentAccount(): Promise<Account> {
    return (await this.apiRequestWithErrorHandling(`/account`)).account;
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
