import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { getGroupKey } from '../groups/converters';
import { createUserEntity } from './converters';

// Oauth scope: 'read'
export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    await jobState.addEntity(userEntity);
  });
}

export async function buildUserGroupRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      if (!userEntity.defaultGroupId) {
        return;
      }

      const groupEntity = await jobState.findEntity(
        getGroupKey(userEntity.defaultGroupId.toString()),
      );

      if (!groupEntity) {
        return;
      }

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: groupEntity,
          to: userEntity,
        }),
      );
    },
  );
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUsers,
  },
  {
    id: IntegrationSteps.BUILD_USER_GROUP_RELATIONSHIPS,
    name: 'Build User Group Relationships',
    entities: [],
    relationships: [Relationships.GROUP_HAS_USER],
    dependsOn: [IntegrationSteps.GROUPS, IntegrationSteps.USERS],
    executionHandler: buildUserGroupRelationships,
  },
];
