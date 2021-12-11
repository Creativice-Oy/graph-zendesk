import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import {
  buildTicketAssigneeRelationships,
  buildTicketGroupRelationships,
  buildTicketRequesterRelationships,
  fetchTickets,
} from '.';
import { integrationConfig } from '../../../test/config';
import { setupZendeskRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships } from '../constants';
import { fetchGroups } from '../groups';
import { fetchUsers } from '../users';
import { mapTypeToClass } from './converters';

describe('#fetchTickets', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'fetchTickets',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchTickets(context);

    const tickets = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.TICKET._type),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(tickets.length).toBeGreaterThan(0);

    // The _class is dynamic so we need to process it
    const ticketExampleClasses = [Entities.TICKET._class[0]];
    const ticketExampleAdditionalClass = mapTypeToClass(
      tickets[0].type as string,
    );
    if (ticketExampleAdditionalClass) {
      ticketExampleClasses.push(ticketExampleAdditionalClass);
    }

    expect(tickets[0]).toMatchGraphObjectSchema({
      _class: ticketExampleClasses,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.TICKET._type },
          _class: { const: Entities.TICKET._class },
          _key: { type: 'string' },
          active: { type: 'boolean' },
          assigneeEmail: { type: 'string' },
          assigneeId: { type: 'number' },
          brandId: { type: 'number' },
          collaboratorIds: { type: 'array', items: { type: 'number' } },
          createdAt: { type: 'string' },
          description: { type: 'string' },
          dueAt: { type: 'string' },
          emailCcIds: { type: 'array', items: { type: 'number' } },
          followerIds: { type: 'array', items: { type: 'number' } },
          forumTopicId: { type: 'number' },
          groupId: { type: 'number' },
          hasIncidents: { type: 'boolean' },
          id: { type: 'string' },
          name: { type: 'string' },
          organizationId: { type: 'number' },
          priority: { type: 'string' },
          problemId: { type: 'number' },
          recipient: { type: 'string' },
          requestedId: { type: 'number' },
          requesterId: { type: 'number' },
          status: { type: 'string' },
          submitterId: { type: 'number' },
          type: { type: 'string' },
          url: { type: 'string' },
          queries: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    });
  });
});

describe('#buildTicketRequesterRelationships', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'buildTicketRequesterRelationships',
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
    await fetchTickets(context);
    await buildTicketRequesterRelationships(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.USER_OPENED_TICKET._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'OPENED' },
          _type: {
            const: 'zendesk_user_opened_ticket',
          },
        },
      },
    });
  });
});

describe('#buildTicketAssigneeRelationships', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'buildTicketAssigneeRelationships',
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
    await fetchTickets(context);
    await buildTicketAssigneeRelationships(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.USER_ASSIGNED_TICKET._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'ASSIGNED' },
          _type: {
            const: 'zendesk_user_assigned_ticket',
          },
        },
      },
    });
  });
});

describe('#buildTicketGroupRelationships', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'buildTicketGroupRelationships',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchTickets(context);
    await fetchGroups(context);
    await buildTicketGroupRelationships(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.GROUP_HAS_TICKET._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'zendesk_group_has_ticket',
          },
        },
      },
    });
  });
});
