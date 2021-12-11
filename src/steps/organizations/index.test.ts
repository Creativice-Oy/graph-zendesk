import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildOrganizationGroupRelationships, fetchOrganizations } from '.';
import { integrationConfig } from '../../../test/config';
import { setupZendeskRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { fetchAccount } from '../account';
import { Entities, Relationships } from '../constants';
import { fetchGroups } from '../groups';

describe('#fetchOrganizations', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'fetchOrganizations',
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
    await fetchOrganizations(context);

    const organizations = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.ORGANIZATION._type),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(organizations.length).toBeGreaterThan(0);
    expect(organizations).toMatchGraphObjectSchema({
      _class: Entities.ORGANIZATION._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.ORGANIZATION._type },
          _class: { const: Entities.ORGANIZATION._class },
          _key: { type: 'string' },
          createdAt: { type: 'string' },
          details: { type: 'array' },
          domainNames: { type: 'array' },
          groupId: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          notes: { type: 'array' },
          sharedComments: { type: 'boolean' },
          sharedTickets: { type: 'boolean' },
          updatedAt: { type: 'string' },
          url: { type: 'string' },
        },
      },
    });
  });
});

describe('#buildOrganizationGroupRelationships', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'buildOrganizationGroupRelationships',
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
    await fetchOrganizations(context);
    await buildOrganizationGroupRelationships(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.ORGANIZATION_HAS_GROUP._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'zendesk_organization_has_group',
          },
        },
      },
    });
  });
});
