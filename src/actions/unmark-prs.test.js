import mockClient from '../mock-client';
import unmarkPrs from './unmark-prs';
import { args, context, fnAssert, yesterday, logInfoNotErrors } from '../common-test.js';

let logger;
beforeEach(() => {
  logger = logInfoNotErrors();
});
afterEach(() => {
  logger.assert();
});

it('Ignores unlabeled PRs', async () => {
  const client = new mockClient(args, new Date(), [args.autoCloseLabel]);
  await unmarkPrs({ client, context, args, logger })(client.fakePrs);
  fnAssert(client.issues.removeLabel, {}, true);
  fnAssert(client.issues.listComments, {}, true);
  fnAssert(client.issues.deleteComment, {}, true);
});

it('Ignores old PRs', async () => {
  const client = new mockClient(args, yesterday(), [args.autoCloseLabel, args.closingSoonLabel]);
  await unmarkPrs({ client, context, args, logger })(client.fakePrs);
  fnAssert(client.issues.removeLabel, {}, true);
  fnAssert(client.issues.listComments, {}, true);
  fnAssert(client.issues.deleteComment, {}, true);
});

it('Ignores PRs where the most recent change is our comment', async () => {
  const client = new mockClient(args, new Date(), [args.autoCloseLabel, args.closingSoonLabel]);
  
  await unmarkPrs({ client, context, args, logger })(client.fakePrs);
  fnAssert(client.issues.removeLabel, {}, true);
  fnAssert(client.issues.listComments, { issue_number: 123 });
  fnAssert(client.issues.deleteComment, {}, true);
});

it('Removes labels from marked PRs', async () => {
  const client = new mockClient(args, new Date(), [args.autoCloseLabel, args.closingSoonLabel], yesterday());
  const processedPrNumbers = await unmarkPrs({ client, context, args, logger })(client.fakePrs);
  expect(processedPrNumbers).toEqual([123]);
  fnAssert(client.issues.removeLabel, {
    issue_number: 123,
    name: args.closingSoonLabel,
  });
  fnAssert(client.issues.listComments, { issue_number: 123 });
  fnAssert(client.issues.deleteComment, { comment_id: 321 });
});
