import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchGroups } from '.';
import { integrationConfig } from '../../../test/config';
import { setupZendeskRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { fetchAccount } from '../account';
import { Entities } from '../constants';

describe('#fetchGroups', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'fetchGroups',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAccount(context);
    await fetchGroups(context);

    const groups = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.GROUP._type),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(groups.length).toBeGreaterThan(0);
    expect(groups).toMatchGraphObjectSchema({
      _class: Entities.GROUP._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.GROUP._type },
          _class: { const: Entities.GROUP._class },
          _key: { type: 'string' },
          createdAt: { type: 'string' },
          deleted: { type: 'boolean' },
          description: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          updatedAt: { type: 'string' },
          url: { type: 'string' },
        },
      },
    });
  });
});
