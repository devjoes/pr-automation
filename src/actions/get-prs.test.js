import mockClient from '../mock-client';
import getPrs from './get-prs';
import { args, context, yesterday, generatorToArray, logInfoNotErrors } from '../common-test.js';

let disableAssert = false;
let logger;
beforeEach(() => {
  logger = logInfoNotErrors();
});
afterEach(() => {
  if (!disableAssert) {
    logger.assert();
  }
});

it('Gets PRs', async () => {
  const client = new mockClient(args, yesterday(), [args.autoCloseLabel]);
  const prs = await generatorToArray(await getPrs({ client, context, logger, args })());
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
    .mockReturnValue({ data: [] });

  const prs = await generatorToArray(await getPrs({ client, context, logger, args })());
  expect(prs).not.toBeUndefined();
  expect(prs.length).toEqual(250);
  prs.forEach((pr, i) => expect(pr.title).toEqual('Test PR ' + i));
});

it('Ignore PRs to/from blacklisted branches', async () => {
  disableAssert = true;
  const client = new mockClient(args, yesterday(), [args.autoCloseLabel]);
  const prTemplate = client.fakePrsArray[0];
  args.branchBlackListLowerCase = ['foo', 'bar'];
  client.pulls.list
    .mockReturnValueOnce({
      data: [
        { ...prTemplate, head: { ref: 'refs/heads/foo' } },
        { ...prTemplate, head: { ref: 'refs/heads/bAr' }, base: { ref: 'FOO' } },
        { ...prTemplate, base: { ref: 'bar' } },
        { ...prTemplate, head: { ref: 'baz' } },
      ],
    })
    .mockReturnValue({ data: [] });
  const prs = await generatorToArray(await getPrs({ client, context, logger, args })());
  expect(prs).not.toBeUndefined();
  console.log(prs);
  expect(prs.length).toEqual(1);
  expect(prs[0].head.ref).toEqual('baz');
  expect(logger.warning).toBeCalledTimes(3);
});
