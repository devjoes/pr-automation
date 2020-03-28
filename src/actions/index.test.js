import index from './index';
import { args, context, yesterday } from '../common-test';
import mockClient from '../mock-client';

const errMsg = 'Kaboom!!!!';
it('Throws if getPrs errors', () => {
  const logger = {
    info: () => {},
  };
  const client = new mockClient(args, yesterday(), []);
  client.pulls.list = () => Promise.reject(new Error(errMsg));
  const generator = index(args, logger, context, client).getPrs();
  expect(generator.next()).rejects.toThrow(errMsg);
});

it('Warns and suppresses errors on actions other than getPrs', async () => {
  const logger = {
    warning: jest.fn(),
    info: () => {},
  };
  const client = new mockClient(args, yesterday(), [args.autoMergeLabel]);
  client.pulls.get = () => Promise.reject(new Error(errMsg));
  const prIds = await index(args, logger, context, client).mergePrs(client.fakePrs);
  expect(prIds).toEqual([]);
  expect(logger.warning).toBeCalledWith('mergePrs errored. Error: ' + errMsg);
});
