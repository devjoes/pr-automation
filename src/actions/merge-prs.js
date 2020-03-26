import asyncFilter from 'node-filter-async';
import { hasLabel } from '../common';

const merge = async ({ client, context }, pr) => 
  await client.pulls.merge({
    ...context.repo,
    pull_number: pr.number,
  });

const isMergable = async ({ client, context }, pr) => {
  const fullPr = await client.pulls.get({
    ...context.repo,
    pull_number: pr.number,
  });
  return fullPr.data.mergeable &&
    (fullPr.data.mergeable_state === 'clean' ||
      fullPr.data.mergeable_state === 'unstable');
};

export default async (opts, prs) =>
  await (
    await asyncFilter(
      prs,
      async (p) =>
        p.labels &&
        hasLabel(p, opts.args.autoMergeLabel) &&
        (await isMergable(opts, p)),
    )
  ).forEach(async (i) => await merge(opts, i));
