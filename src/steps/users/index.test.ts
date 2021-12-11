import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildUserGroupRelationships, fetchUsers } from '.';
import { integrationConfig } from '../../../test/config';
import { setupZendeskRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships } from '../constants';
import { fetchGroups } from '../groups';

describe('#fetchUsers', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'fetchUsers',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchUsers(context);

    const users = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.USER._type),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(users.length).toBeGreaterThan(0);
    expect(users).toMatchGraphObjectSchema({
      _class: Entities.USER._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.USER._type },
          _class: { const: Entities.USER._class },
          _key: { type: 'string' },
          active: { type: 'boolean' },
          username: { type: 'string' },
          chatOnly: { type: 'boolean' },
          createdAt: { type: 'string' },
          customRoleId: { type: 'string' },
          defaultGroupId: { type: 'number' },
          email: { type: 'string' },
          ianaTimeZone: { type: 'string' },
          id: { type: 'string' },
          locale: { type: 'string' },
          localeId: { type: 'number' },
          moderator: { type: 'boolean' },
          name: { type: 'string' },
          notes: { type: 'array' },
          organizationId: { type: 'number' },
          phone: { type: 'string' },
          photoUrl: { type: 'string' },
          restrictedAgent: { type: 'boolean' },
          role: { type: 'string' },
          shared: { type: 'boolean' },
          suspended: { type: 'boolean' },
          timeZone: { type: 'string' },
          updatedAt: { type: 'string' },
          url: { type: 'string' },
          verified: { type: 'boolean' },
        },
      },
    });
  });
});

describe('#buildUserGroupRelationships', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'buildUserGroupRelationships',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchGroups(context);
    await fetchUsers(context);
    await buildUserGroupRelationships(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.GROUP_HAS_USER._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'zendesk_group_has_user',
          },
        },
      },
    });
  });
});
