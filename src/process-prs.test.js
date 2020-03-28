import processPrs from './process-prs';
import { arrayToGenerator, getFakePrs } from './common-test';

const getActions = () => {
  const prs = arrayToGenerator(getFakePrs(new Date(), []));
  return {
    actions: {
      getPrs: jest.fn(() => prs),
      closePrs: jest.fn(),
      markPrs: jest.fn(),
      mergePrs: jest.fn(),
      unmarkPrs: jest.fn(),
      updatePrs: jest.fn()
    },
    prs,
  };
};

test('Gets PRs', async () => {
  const { actions } = getActions();
  await processPrs({}, actions);
  expect(actions.getPrs.mock.calls.length).toEqual(1);
});

test('Gets PRs and does nothing else if labels arent set', async () => {
  const { actions } = getActions();
  await processPrs({}, actions);
  expect(actions.getPrs.mock.calls.length).toEqual(1);
  expect(actions.closePrs.mock.calls.length).toEqual(0);
  expect(actions.markPrs.mock.calls.length).toEqual(0);
  expect(actions.mergePrs.mock.calls.length).toEqual(0);
  expect(actions.unmarkPrs.mock.calls.length).toEqual(0);
});

test('Merges PRs if label is set', async () => {
  const { actions, prs } = getActions();
  await processPrs({ autoMergeLabel: 'auto-merge' }, actions);
  expect(actions.getPrs.mock.calls.length).toEqual(1);
  expect(actions.closePrs.mock.calls.length).toEqual(0);
  expect(actions.markPrs.mock.calls.length).toEqual(0);
  expect(actions.mergePrs).toBeCalledWith(expect.objectContaining({...prs}));
  expect(actions.unmarkPrs.mock.calls.length).toEqual(0);
});

test('Closes PRs if label is set', async () => {
  const { actions, prs } = getActions();
  await processPrs({ autoCloseLabel: 'auto-close' }, actions);
  expect(actions.getPrs.mock.calls.length).toEqual(1);
  expect(actions.mergePrs.mock.calls.length).toEqual(0);
  expect(actions.closePrs).toBeCalledWith(expect.objectContaining({...prs}));
  expect(actions.markPrs).toBeCalledWith(expect.objectContaining({...prs}));
  expect(actions.unmarkPrs).toBeCalledWith(expect.objectContaining({...prs}));
});
