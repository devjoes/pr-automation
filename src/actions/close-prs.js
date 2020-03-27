import { hasLabel } from '../common';
import filter from '@async-generators/filter';

export default opts => async prs => {
  const { args } = opts;

  const prsToClose = filter(
    prs,
    p => hasLabel(p, args.autoCloseLabel) && hasLabel(p, args.closingSoonLabel),
  );

  for await (let pr of prsToClose) {
    if ((await getLatestCommentAgeSecs(opts, pr.number)) > args.autoCloseAfterWarnSecs) {
      await closePr(opts, pr);
    }
  }
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

const getLatestCommentAgeSecs = async ({ client, context, args }, issueNumber) => {
  const comments = await client.issues.listComments({
    ...context.repo,
    issue_number: issueNumber,
  });
  const latestCommentDate =
    comments.data
      .filter(c => c.body.indexOf(args.closingSoonComment.replace(/\@.*/, '')) === 0)
      .reduce((latest, i) => {
        const created = new Date(i.created_at);
        if (!latest || created > latest) {
          return created;
        }
        return latest;
      }, undefined) || new Date(0);

  return (new Date().getTime() - latestCommentDate.getTime()) / 1000;
};
