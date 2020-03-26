import filterAsync from 'node-filter-async';
import { hasLabel } from '../common';

export default async (opts, prs) => {
  const { args } = opts;

  const prsToClose = await filterAsync(
    prs,
    async (p) =>
      hasLabel(p, args.autoCloseLabel) &&
      hasLabel(p, args.closingSoonLabel) &&
      (await getLatestCommentAgeSecs(opts, p.number)) >
        args.autoCloseAfterWarnSecs,
  );
  await prsToClose.forEach(async (p) => await closePr(opts, p));
};

const closePr = async ({ context, client, args }, p) => {
  await client.pulls.update({
    ...context.repo,
    pull_number: p.number,
    state: 'closed',
  });
  if (args.deleteOnClose) {
    await client.git.deleteRef({ ...context.repo, ref: p.head.ref });
  }
};

const getLatestCommentAgeSecs = async (
  { client, context, args },
  issueNumber,
) => {
  const comments = await client.issues.listComments({
    ...context.repo,
    issue_number: issueNumber,
  });
  const latestCommentDate =
    comments.data
      .filter(
        (c) =>
          c.body.indexOf(
            args.closingSoonComment.replace(/\@.*/, ''),
          ) === 0,
      )
      .reduce((latest, i) => {
        const created = new Date(i.created_at);
        if (!latest || created > latest) {
          return created;
        }
        return latest;
      }, undefined) || new Date(0);

  return (new Date().getTime() - latestCommentDate.getTime()) / 1000;
};
