import mockClient from '../mock-client';
import closePrs from './close-prs';
import { args, context, yesterday, fnAssert, logInfoNotErrors } from '../common-test.js';

let logger;
beforeEach(() => {
  logger = logInfoNotErrors();
});
afterEach(() => {
  logger.assert();
});

it('Ignores unlabeled PRs', async () => {
  const client = new mockClient(args, yesterday(), [args.autoCloseLabel]);

  await closePrs({ client, context, args, logger })(client.fakePrs);
  fnAssert(client.pulls.update, {}, true);
  fnAssert(client.git.deleteRef, {}, true);
});

it('Ignores PRs that are not ready to be closed', async () => {
  const client = new mockClient(args, yesterday(), [args.autoCloseLabel, args.closingSoonLabel]);
  client.issues.listComments = () => {
    const data = client.getFakeComments().data.map(c => ({
      ...c,
      created_at: new Date().toISOString(),
    }));
    return { data };
  };
  await closePrs({ client, context, args, logger })(client.fakePrs);
  fnAssert(client.pulls.update, {}, true);
  fnAssert(client.git.deleteRef, {}, true);
});

it('Closes PRs that have been labeled and have expired', async () => {
  const client = new mockClient(args, yesterday(), [args.autoCloseLabel, args.closingSoonLabel]);

  await closePrs({ client, context, args, logger })(client.fakePrs);
  fnAssert(client.pulls.update, {
    pull_number: 123,
    state: 'closed',
  });
  fnAssert(client.git.deleteRef, {}, true);
});

it('Deletes PRs that have been labeled and have expired', async () => {
  const client = new mockClient(args, yesterday(), [args.autoCloseLabel, args.closingSoonLabel]);

  const processedPrNumbers = await closePrs({
    client,
    context,
    args: { ...args, deleteOnClose: true },
    logger,
  })(client.fakePrs);
  expect(processedPrNumbers).toEqual([123]);
  fnAssert(client.git.deleteRef, { ref: 'refs/heads/testpr' });
});
