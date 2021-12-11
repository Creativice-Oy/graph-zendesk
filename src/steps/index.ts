import { accountSteps } from './account';
import { groupSteps } from './groups';
import { organizationSteps } from './organizations';
import { ticketSteps } from './tickets';
import { userSteps } from './users';

const integrationSteps = [
  ...accountSteps,
  ...userSteps,
  ...groupSteps,
  ...organizationSteps,
  ...ticketSteps,
];

export { integrationSteps };
