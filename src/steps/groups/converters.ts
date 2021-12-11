import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Group } from '../../types';
import { Entities } from '../constants';

export function getGroupKey(id: string): string {
  return `zendesk_group:${id}`;
}

export function createGroupEntity(group: Group): Entity {
  return createIntegrationEntity({
    entityData: {
      source: group,
      assign: {
        _type: Entities.GROUP._type,
        _class: Entities.GROUP._class,
        _key: getGroupKey(`${group.id}`),
        createdAt: group.created_at,
        deleted: group.deleted,
        description: group.description,
        id: group.id?.toString(),
        name: group.name,
        updatedAt: group.updated_at,
        url: group.url,
      },
    },
  });
}
