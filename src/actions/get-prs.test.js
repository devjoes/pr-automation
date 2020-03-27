import mockClient from '../mock-client';
import getPrs from './get-prs';
import { args, context, yesterday, generatorToArray } from '../common-test.js';

it('Gets PRs', async () => {
  const client = new mockClient(args, yesterday(), [args.autoCloseLabel]);
  const prs = await generatorToArray(await getPrs({ client, context })());

  expect(prs).not.toBeUndefined();
  expect(prs.length).toEqual(1);
  expect(prs[0].title).toEqual('Test PR');
});

it('Gets pages of PRs', async () => {
  const client = new mockClient(args, yesterday(), [args.autoCloseLabel]);

  const prTemplate = client.fakePrsArray[0];
  const makePageOfPrs = (start, end) =>
    [...Array(end - start).keys()].map(i => ({
      ...prTemplate,
      title: 'Test PR ' + (start + i),
    }));
  client.pulls.list
    .mockReturnValueOnce({ data: makePageOfPrs(0, 100) })
    .mockReturnValueOnce({ data: makePageOfPrs(100, 200) })
    .mockReturnValueOnce({ data: makePageOfPrs(200, 250) })
    .mockReturnValueOnce({ data: [] });

  const prs = await generatorToArray(await getPrs({ client, context })());
  expect(prs).not.toBeUndefined();
  expect(prs.length).toEqual(250);
  prs.forEach((pr, i) => expect(pr.title).toEqual('Test PR ' + i));
});

//TODO: branch black/white list
