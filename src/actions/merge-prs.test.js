import mockClient from '../mock-client';
import { args, context, yesterday, fnAssert } from '../common-test.js';
import mergePrs from './merge-prs';

it('Ignores unlabeled PRs', async () => {
  const client = new mockClient(args, yesterday(), []);
  await mergePrs({ client, context, args })(client.fakePrs);
  fnAssert(client.pulls.get, {}, true);
  fnAssert(client.pulls.merge, {}, true);
  fnAssert(client.git.deleteRef, {}, true);
});

it('Ignores umergable PRs', async () => {
  const client = new mockClient(args, yesterday(), [args.autoMergeLabel]);
  client.pulls.get = jest.fn(() => ({
    data: { ...client.fakePrs[0], mergeable: false },
  }));
  await mergePrs({ client, context, args })( client.fakePrs);
  fnAssert(client.pulls.get, { pull_number: 123 });
  fnAssert(client.pulls.merge, {}, true);
  fnAssert(client.git.deleteRef, {}, true);
});

it('Ignores umergable "dirty" PRs', async () => {
  const client = new mockClient(args, yesterday(), [args.autoMergeLabel]);
  client.pulls.get = jest.fn(() => ({
    data: { ...client.fakePrsArray[0], mergeable_state: 'dirty' },
  }));
  await mergePrs({ client, context, args })( client.fakePrs);
  fnAssert(client.pulls.get, { pull_number: 123 });
  fnAssert(client.pulls.merge, {}, true);
  fnAssert(client.git.deleteRef, {}, true);
});

it('Merges PRs', async () => {
  const client = new mockClient(args, yesterday(), [args.autoMergeLabel]);
  client.pulls.get = jest.fn(() => ({
    data: {
      ...client.fakePrs[0],
      mergeable_state: 'clean',
      mergeable: true,
    },
  }));
  await mergePrs({ client, context, args })( client.fakePrs);
  fnAssert(client.pulls.get, { pull_number: 123 });
  fnAssert(client.pulls.merge, { pull_number: 123 });
  fnAssert(client.git.deleteRef, {}, true);
});
