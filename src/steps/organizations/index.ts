import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { createOrganizationEntity } from './converters';
import { RelationshipClass } from '@jupiterone/data-model';
import {
  Entities,
  Relationships,
  IntegrationSteps,
  ACCOUNT_ENTITY_KEY,
} from '../constants';
import { getGroupKey } from '../groups/converters';

// Oauth scope: 'read'
export async function fetchOrganizations({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateOrganizations(async (organization) => {
    const organizationEntity = createOrganizationEntity(organization);
    await jobState.addEntity(organizationEntity);

    if (accountEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: organizationEntity,
        }),
      );
    }
  });
}

export async function buildOrganizationGroupRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    {
      _type: Entities.ORGANIZATION._type,
    },
    async (organizationEntity) => {
      const groupId = (organizationEntity as any).groupId?.toString();
      const groupEntity = await jobState.findEntity(getGroupKey(groupId));

      if (groupEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: organizationEntity,
            to: groupEntity,
            _class: RelationshipClass.HAS,
          }),
        );
      }
    },
  );
}

export const organizationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ORGANIZATIONS,
    name: 'Fetch Organizations',
    entities: [Entities.ORGANIZATION],
    relationships: [Relationships.ACCOUNT_HAS_ORGANIZATION],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchOrganizations,
  },
  {
    id: IntegrationSteps.BUILD_ORGANIZATION_GROUP_RELATIONSHIPS,
    name: 'Build Organization Group Relationships',
    entities: [],
    relationships: [Relationships.ORGANIZATION_HAS_GROUP],
    dependsOn: [IntegrationSteps.ORGANIZATIONS, IntegrationSteps.GROUPS],
    executionHandler: buildOrganizationGroupRelationships,
  },
];
