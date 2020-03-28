export default async function (iter) {
  let cache = await hydrateCache(iter);
  return {
    runAction: async action => {
      const cachedIterator = iterateFromCache(cache);
      const modifiedPrNumbers = await action(cachedIterator);
      // If we have done something to a PR then we don't want to process it in subsequent steps wait till next run.
      // TODO:
      //    Be a bit more clever about cache invalidation
      //    Some actions are atomic and should trigger a full refresh of the (latest and now correct) data.
      //    Some actions can still process PRs that we currently filter out.
      if (modifiedPrNumbers && modifiedPrNumbers.length) {
        cache = cache.filter(pr => modifiedPrNumbers.indexOf(pr.number));
      }
      return iterateFromCache(cache);
    },
  };
}

async function* iterateFromCache(cache) {
  //TODO: It would be nice if we hydrated the cache whilst providing results, would use less RAM & be faster for initial PRs
  for (let i = 0; i < cache.length; i++) {
    // Whilst this doesn't actaully need to be async we should really be able to use the output
    // of getPrs anywhere that we use prsCache. Also see todo above.
    yield cache[i];
  }
}

async function hydrateCache(iter) {
  const cache = [];
  for await (let i of iter) {
    cache.push(i);
  }
  return cache;
}
