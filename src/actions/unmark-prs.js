import { hasLabel, updatedInTheLastSecs } from '../common';

const unMarkForClosure = async (opts, pr) => {
  const { context, client, args } = opts;
  await client.issues.removeLabel({
    ...context.repo,
    issue_number: pr.number,
    name: args.closingSoonLabel,
  });
  await deleteComments(opts, pr.number);
};
const deleteComments = async (
  { client, context, args },
  issueNumber,
) => {
  const comments = (
    await client.issues.listComments({
      ...context.repo,
      issue_number: issueNumber,
    })
  ).data.filter(
    (c) =>
      c.body.indexOf(args.closingSoonComment.replace(/\@.*/, '')) ===
      0,
  );

  await comments.forEach(async (c) => {
    await client.issues.deleteComment({
      ...context.repo,
      comment_id: c.id,
    });
  });
};

export default async (opts, prs) =>
await prs
    .filter(
      (p) =>
        p.labels &&
        hasLabel(p, opts.args.autoCloseLabel) &&
        hasLabel(p, opts.args.closingSoonLabel) &&
        updatedInTheLastSecs(p, opts.args.warnClosingAfterSecs),
    )
    .forEach(async (i) => await unMarkForClosure(opts, i));
