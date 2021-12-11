import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { User } from '../../types';
import { Entities } from '../constants';

function getAccountKey(id: string): string {
  return `zendesk_account:${id}`;
}

export function createAccountEntity(data: User) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.ACCOUNT._class,
        _type: Entities.ACCOUNT._type,
        _key: getAccountKey(data.id as string),
        email: data.email,
        name: data.name,
        id: data.id?.toString(),
        username: data.email,
      },
    },
  });
}
