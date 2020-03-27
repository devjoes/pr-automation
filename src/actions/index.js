import * as github from '@actions/github';
import closePrs from './close-prs';
import getPrs from './get-prs';
import markPrs from './mark-prs';
import mergePrs from './merge-prs';
import unmarkPrs from './unmark-prs';

export default args => {
  const opts = {
      args,
      context: github.context,
      client: new github.GitHub(args.token),
      //todo: add logger
  };
  return {
    closePrs: closePrs(opts),
    getPrs: getPrs(opts),
    markPrs: markPrs(opts),
    mergePrs: mergePrs(opts),
    unmarkPrs: unmarkPrs(opts),
  };
};