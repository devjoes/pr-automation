import mockClient from '../mock-client';
import { args, context, yesterday, fnAssert, logInfoNotErrors } from '../common-test.js';
import updatePrs from './update-prs';

let logger;
beforeEach(() => {
  logger = logInfoNotErrors();
});
afterEach(() => {
  logger.assert();
});

it('Ignores unlabeled PRs', async () => {
  const client = new mockClient(args, yesterday(), []);
  await updatePrs({ client, context, args, logger })(client.fakePrs);
  fnAssert(client.pulls.get, {}, true);
  fnAssert(client.pulls.updateBranch, {}, true);
});

it('Ignores PRs that do not need updating', async () => {
  const client = new mockClient(args, yesterday(), [args.autoMergeLabel]);
  client.pulls.get = jest.fn(() => ({
    data: { ...client.fakePrs[0], mergeable: true, mergeable_state: 'clean' },
  }));
  await updatePrs({ client, context, args, logger })(client.fakePrs);
  fnAssert(client.pulls.get, { pull_number: 123 });
  fnAssert(client.pulls.updateBranch, {}, true);
});

it('Updates PRs that need updating', async () => {
  const client = new mockClient(args, yesterday(), [args.autoMergeLabel]);
  client.pulls.get = jest.fn(() => ({
    data: { ...client.fakePrs[0], mergeable: true, mergeable_state: 'behind' },
  }));
  const processedPrNumbers = await updatePrs({ client, context, args, logger })(client.fakePrs);
  expect(processedPrNumbers).toEqual([123]);
  fnAssert(client.pulls.get, { pull_number: 123 });
  fnAssert(client.pulls.updateBranch, { pull_number: 123 });
});
