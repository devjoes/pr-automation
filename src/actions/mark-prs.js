import {hasLabel,updatedInTheLastSecs, nowPlusSecs} from '../common';

const markForClosure = async ({ client, context, args }, pr) => {
  await client.issues.addLabels({
    ...context.repo,
    issue_number: pr.number,
    labels: [...pr.labels.map((l) => l.name), args.closingSoonLabel],
  });
  await client.issues.createComment({
    ...context.repo,
    issue_number: pr.number,
    body: args.closingSoonComment.replace(
      /\@closeTime/g,
      nowPlusSecs(args.autoCloseAfterWarnSecs),
    ),
  });
};

export default async (opts, prs) => {
  const { args } = opts;
  const toMark = prs.filter(
    (p) =>
      p.labels &&
      hasLabel(p, args.autoCloseLabel) &&
      !hasLabel(p, args.closingSoonLabel) &&
      !updatedInTheLastSecs(p, args.warnClosingAfterSecs),
  );
  await toMark.forEach(async (i) => await markForClosure(opts, i));
};
