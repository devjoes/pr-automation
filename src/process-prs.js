import cacheExcludeProcessed from './cache-exclude-processed';

export default async (args,actions) => {
    const prs = await actions.getPrs();
    const cache = await cacheExcludeProcessed(prs);
    //console.log(args);
    //console.log(cache);
    if (args.autoMergeLabel && args.autoMergeLabel != ''){
        await cache.runAction(actions.updatePrs);
        await cache.runAction(actions.mergePrs);
        await cache.runAction(actions.updatePrs);
    }
    if (args.autoCloseLabel && args.autoCloseLabel != ''){
        await cache.runAction(actions.unmarkPrs);
        await cache.runAction(actions.markPrs);
        await cache.runAction(actions.closePrs);
    }
}