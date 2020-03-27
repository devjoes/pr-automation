import filter from '@async-generators/filter';
import { hasLabel, updatedInTheLastSecs, nowPlusSecs } from '../common';

const markForClosure = async ({ client, context, args }, pr) => {
  await client.issues.addLabels({
    ...context.repo,
    issue_number: pr.number,
    labels: [...pr.labels.map(l => l.name), args.closingSoonLabel],
  });
  await client.issues.createComment({
    ...context.repo,
    issue_number: pr.number,
    body: args.closingSoonComment.replace(/\@closeTime/g, nowPlusSecs(args.autoCloseAfterWarnSecs)),
  });
};

export default opts => async prs => {
  const { args } = opts;
  const toMark = filter(
    prs,
    p =>
      p.labels &&
      hasLabel(p, args.autoCloseLabel) &&
      !hasLabel(p, args.closingSoonLabel) &&
      !updatedInTheLastSecs(p, args.warnClosingAfterSecs),
  );
  for await (let pr of toMark) {
    await markForClosure(opts, pr);
  }
};
