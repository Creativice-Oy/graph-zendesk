import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { User } from '../../types';
import { Entities } from '../constants';

export function getUserKey(id: string): string {
  return `zendesk_user:${id}`;
}

export function createUserEntity(user: User): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.id?.toString() as string),
        active: user.active,
        username: user.email,
        chatOnly: user.chat_only,
        createdAt: user.created_at,
        defaultGroupId: user.default_group_id || undefined,
        email: user.email,
        ianaTimeZone: user.iana_time_zone,
        id: user.id?.toString(),
        locale: user.locale,
        localeId: user.locale_id,
        moderator: user.moderator,
        name: user.name,
        organizationId: user.organization_id || undefined,
        phone: user.phone || undefined,
        photoUrl: user.photo?.content_url,
        restrictedAgent: user.restricted_agent,
        role: user.role,
        shared: user.shared,
        suspended: user.suspended,
        timeZone: user.time_zone,
        updatedAt: user.updated_at,
        url: user.url,
        verified: user.verified,
      },
    },
  });
}
