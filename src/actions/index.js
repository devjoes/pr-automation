import * as github from '@actions/github';
import closePrs from './close-prs';
import getPrs from './get-prs';
import markPrs from './mark-prs';
import mergePrs from './merge-prs';
import unmarkPrs from './unmark-prs';
import updatePrs from './update-prs';

export default (
  args,
  logger,
  context = github.context,
  client = new github.GitHub(args.token),
) => {
  const opts = { args, context, client, logger };
  const handleErrors = (func, funcName) => (...args) =>
    new Promise(r => {
      const promise = func(...args);
      promise.then(r);
      promise.catch(err => {
        logger.warning(`${funcName} errored. ${err}`);
        r([]);
      });
    });

  return {
    getPrs: getPrs(opts),
    closePrs: handleErrors(closePrs(opts), 'closePrs'),
    markPrs: handleErrors(markPrs(opts), 'markPrs'),
    mergePrs: handleErrors(mergePrs(opts), 'mergePrs'),
    unmarkPrs: handleErrors(unmarkPrs(opts), 'unmarkPrs'),
    updatePrs: handleErrors(updatePrs(opts), 'updatePrs'),
  };
};
