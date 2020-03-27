import filter from '@async-generators/filter';
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
  return (
    fullPr.data.mergeable &&
    (fullPr.data.mergeable_state === 'clean' || fullPr.data.mergeable_state === 'unstable')
  );
};

export default opts => async prs => {
  const filtered = filter(prs, p => p.labels && hasLabel(p, opts.args.autoMergeLabel));

  for await (let pr of filtered) {
    if (await isMergable(opts, pr)) {
      await merge(opts, pr);
    }
  }
};
