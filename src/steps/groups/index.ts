import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { createGroupEntity } from './converters';
import { Entities, IntegrationSteps } from '../constants';

// Oauth scope: 'read'
export async function fetchGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateGroups(async (group) => {
    const groupEntity = createGroupEntity(group);
    await jobState.addEntity(groupEntity);
  });
}

export const groupSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.GROUPS,
    name: 'Fetch Groups',
    entities: [Entities.GROUP],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchGroups,
  },
];
