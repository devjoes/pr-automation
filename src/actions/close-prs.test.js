import mockClient from '../mockClient';
import closePrs from './close-prs';
import { args, context, yesterday, fnAssert } from '../common-test.js';

it('Ignores unlabeled PRs', async () => {
  const client = new mockClient(args, yesterday(), [
    args.autoCloseLabel,
  ]);

  await closePrs({ client, context, args }, client.prs);
  fnAssert(client.pulls.update, {}, true);
  fnAssert(client.git.deleteRef, {}, true);
});

it('Ignores PRs that are not ready to be closed', async () => {
  const client = new mockClient(
    args,
    yesterday(),
    [args.autoCloseLabel, args.closingSoonLabel],
    (client) => {
      const origGetComments = client.getComments;
      client.getComments = () => {
        const data = origGetComments().data.map((c) => ({
          ...c,
          created_at: new Date().toISOString(),
        }));
        return {data}
      };
      return client;
    },
  );
  await closePrs({ client, context, args }, client.prs);
  fnAssert(client.pulls.update, {}, true);
  fnAssert(client.git.deleteRef, {}, true);
});

it('Closes PRs that have been labeled and have expired', async () => {
    const client = new mockClient(args, yesterday(), [
      args.autoCloseLabel,
      args.closingSoonLabel,
    ]);
  
    await closePrs({ client, context, args }, client.prs);
    fnAssert(client.pulls.update, {
      pull_number: 123,
      state: 'closed',
    });
    fnAssert(client.git.deleteRef, {}, true);
  });

  
it('Deletes PRs that have been labeled and have expired', async () => {
    const client = new mockClient(args, yesterday(), [
      args.autoCloseLabel,
      args.closingSoonLabel,
    ]);
  
    await closePrs({ client, context, args: {...args, deleteOnClose: true} }, client.prs);
    fnAssert(client.git.deleteRef, {ref:'refs/heads/testpr'});
  });
  