export const nowPlusSecs = secs => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + secs);
  return date.toDateString() + ' ' + date.toTimeString();
};

export const updatedInTheLastSecs = (p, secs) =>
  (new Date().getTime() - new Date(p.updated_at).getTime()) / 1000 < secs;

export const hasLabel = (p, label) => label === '*' || p.labels.filter(l => l.name === label).length > 0;

export const describePr = pr => `PR #${pr.number} '${pr.title}'`;

export const branchNameFromRef = ref => ref.toLowerCase().split(/\//g).slice(-1)[0];

export const getLatestClosingCommentAgeSecs = async ({ client, context, args }, issueNumber) => {
  const comments = await client.issues.listComments({
    ...context.repo,
    issue_number: issueNumber,
  });
  const latestCommentDate = comments.data
    .filter(c => c.body.indexOf(args.closingSoonComment.replace(/\@.*/, '')) === 0)
    .reduce((latest, i) => {
      const created = new Date(i.created_at);
      if (!latest || created > latest) {
        return created;
      }
      return latest;
    }, undefined);

  return latestCommentDate ? (new Date().getTime() - latestCommentDate.getTime()) / 1000 : null;
};

export const deletePrBranch = async ({client, context, logger}, p) => {
  const ref = `heads/${p.head.ref}`;
  logger.info('Deleting branch ' + ref);
  await client.git.deleteRef({ ...context.repo, ref });
}