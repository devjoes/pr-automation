import mockClient from '../mockClient';
import markPrs from './mark-prs';
import { args, context, yesterday, fnAssert } from '../common-test.js';

it('Ignores PRs that are new', async () => {
  const client = new mockClient(
    args,
    Date(),
    [args.autoCloseLabel]
  );
  await markPrs({ client, context, args }, client.prs);
  fnAssert(client.issues.addLabels, {}, true);
  fnAssert(client.issues.createComment, { }, true);
});

it('Ignores PRs that have been processed', async () => {
  const client = new mockClient(
    args,
    yesterday(),
    [args.autoCloseLabel, args.closingSoonLabel]
  );
  await markPrs({ client, context, args }, client.prs);
  fnAssert(client.issues.addLabels, {}, true);
  fnAssert(client.issues.createComment, { }, true);
});

it('Marks PRs to close when they are old and havent already been processed', async () => {
  const client = new mockClient(
    args,
    yesterday(),
    [args.autoCloseLabel]
  );
  await markPrs({ client, context, args }, client.prs);
  fnAssert(client.issues.addLabels, {
    labels: [args.autoCloseLabel, args.closingSoonLabel],
  });
  fnAssert(client.issues.createComment, { issue_number: 123 });
});
