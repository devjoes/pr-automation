import prsCache from './cache-exclude-processed';
import { generatorToArray } from './common-test';

const counter = () => {
  let invocationCount = 0;
  return async function* () {
    invocationCount++;
    for (let i = 0; i < 10; i++) {
      yield { number: i, invocationCount };
    }
  };
};

const assertCounterResults = async (gen, elemCount, invokeCount) => {
  const arr = await generatorToArray(gen);
  expect(arr.length).toEqual(elemCount);
  arr.forEach((x, i) => {
    expect(x.invocationCount).toEqual(invokeCount);
    expect(x.number).toEqual(i);
  });
};

it('Caches the results of a generator', async () => {
  const toIterate = counter();
  const cache = await prsCache(toIterate());
  const runAction = async () =>
    await cache.runAction(async prs => {
      await assertCounterResults(prs, 10, 1);
      return [];
    });

  const firstRun = await runAction();
  await assertCounterResults(firstRun, 10, 1);
  const secondRun = await runAction();
  await assertCounterResults(secondRun, 10, 1);
});

it('Caches the results of each generator seperately', async () => {
  const toIterate = counter();
  const cache1 = await prsCache(toIterate());
  const results1 = await cache1.runAction(async () => []);
  await assertCounterResults(results1, 10, 1);

  const cache2 = await prsCache(toIterate());
  const results2 = await cache2.runAction(async () => []);
  await assertCounterResults(results2, 10, 2);
});

it('Removes PRs that have been modified, excluding them from subsequent processing', async () => {
    const toIterate = counter();
    const cache = await prsCache(toIterate());
    const runAction = async (removeIndex, count) =>
    await cache.runAction(async prs => {
      await assertCounterResults(prs, count, 1);
      return [removeIndex];
    });

    const tenItems = await runAction(-1, 10);
    await assertCounterResults(tenItems, 10, 1);
    const nineItems = await runAction(9, 10);
    await assertCounterResults(nineItems, 9, 1);
    const eightItems = await runAction(8, 9);
    await assertCounterResults(eightItems, 8, 1);
    const stillEightItems = await runAction(-2, 8);
    await assertCounterResults(stillEightItems, 8, 1);
});