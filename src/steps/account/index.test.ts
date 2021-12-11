import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchAccount } from '.';
import { integrationConfig } from '../../../test/config';
import { setupZendeskRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { Entities } from '../constants';

describe('#fetchAccount', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'fetchAccount',
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

    const accounts = context.jobState.collectedEntities.filter((e) =>
      e._class.includes(Entities.ACCOUNT._class[0]),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(accounts.length).toEqual(1);
    expect(accounts).toMatchGraphObjectSchema({
      _class: Entities.ACCOUNT._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.ACCOUNT._type },
          _class: { const: Entities.ACCOUNT._class },
          _key: { type: 'string' },
          email: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          username: { type: 'string' },
        },
      },
    });
  });
});
