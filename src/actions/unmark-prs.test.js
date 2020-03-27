import mockClient from '../mock-client';
import unmarkPrs from './unmark-prs';
import { args, context, fnAssert, yesterday } from '../common-test.js';

// it('Ignores unlabeled PRs', async () => {
//   const client = new mockClient(args, new Date(), [args.autoCloseLabel]);
//   await unmarkPrs({ client, context, args })(client.fakePrs);
//   fnAssert(client.issues.removeLabel, {}, true);
//   fnAssert(client.issues.listComments, {}, true);
//   fnAssert(client.issues.deleteComment, {}, true);
// });

// it('Ignores old PRs', async () => {
//   const client = new mockClient(args, yesterday(), [args.autoCloseLabel, args.closingSoonLabel]);
//   await unmarkPrs({ client, context, args })(client.fakePrs);
//   fnAssert(client.issues.removeLabel, {}, true);
//   fnAssert(client.issues.listComments, {}, true);
//   fnAssert(client.issues.deleteComment, {}, true);
// });

it('Removes labels from updated PRs', async () => {
  const client = new mockClient(args, new Date(), [args.autoCloseLabel, args.closingSoonLabel]);
  await unmarkPrs({ client, context, args })(client.fakePrs);
  fnAssert(client.issues.removeLabel, {
    issue_number: 123,
    name: args.closingSoonLabel,
  });
  fnAssert(client.issues.listComments, { issue_number: 123 });
  fnAssert(client.issues.deleteComment, { comment_id: 321 });
});
