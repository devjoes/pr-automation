"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePrBranch = exports.getLatestClosingCommentAgeSecs = exports.branchNameFromRef = exports.describePr = exports.hasLabel = exports.updatedInTheLastSecs = exports.nowPlusSecs = void 0;

const nowPlusSecs = secs => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + secs);
  return date.toDateString() + ' ' + date.toTimeString();
};

exports.nowPlusSecs = nowPlusSecs;

const updatedInTheLastSecs = (p, secs) => (new Date().getTime() - new Date(p.updated_at).getTime()) / 1000 < secs;

exports.updatedInTheLastSecs = updatedInTheLastSecs;

const hasLabel = (p, label) => label === '*' || p.labels.filter(l => l.name === label).length > 0;

exports.hasLabel = hasLabel;

const describePr = pr => `PR #${pr.number} '${pr.title}'`;

exports.describePr = describePr;

const branchNameFromRef = ref => ref.toLowerCase().split(/\//g).slice(-1)[0];

exports.branchNameFromRef = branchNameFromRef;

const getLatestClosingCommentAgeSecs = async ({
  client,
  context,
  args
}, issueNumber) => {
  const comments = await client.issues.listComments({ ...context.repo,
    issue_number: issueNumber
  });
  const latestCommentDate = comments.data.filter(c => c.body.indexOf(args.closingSoonComment.replace(/\@.*/, '')) === 0).reduce((latest, i) => {
    const created = new Date(i.created_at);

    if (!latest || created > latest) {
      return created;
    }

    return latest;
  }, undefined);
  return latestCommentDate ? (new Date().getTime() - latestCommentDate.getTime()) / 1000 : null;
};

exports.getLatestClosingCommentAgeSecs = getLatestClosingCommentAgeSecs;

const deletePrBranch = async ({
  client,
  context,
  logger
}, p) => {
  const ref = `heads/${p.head.ref}`;
  logger.info('Deleting branch ' + ref);
  await client.git.deleteRef({ ...context.repo,
    ref
  });
};

exports.deletePrBranch = deletePrBranch;
//# sourceMappingURL=common.js.map