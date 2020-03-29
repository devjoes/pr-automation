import getLogger from './logger';

export const args = {
  autoCloseLabel: 'automated-pr',
  autoMergeLabel: 'auto-merge',
  warnClosingAfterSecs: 60 * 60 * 3,
  autoCloseAfterWarnSecs: 60 * 60 * 6,
  closingSoonComment: 'This pull request is inactive and will be closed at @closeTime',
  closingSoonLabel: 'closing-soon',
  deleteOnMerge: false,
  deleteOnClose: false,
  branchBlackListLowerCase: ['master']
};

export const context = {
  repo: {
    owner: 'AcmeSoftwareCo',
    repo: 'test-repo',
  },
};
export const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

export const fnAssert = (fn, props, invert) =>
  (invert ? expect(fn).not : expect(fn)).toBeCalledWith(
    expect.objectContaining({
      ...context.repo,
      ...(props || {}),
    }),
  );

export const generatorToArray = async gen => {
  const arr = [];
  for await (let i of gen) {
    arr.push(i);
  }
  return arr;
};

export async function* arrayToGenerator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}

export const getFakePrs = (date, labels) => [
  {
    url: 'https://api.github.com/repos/TestOrg/TestApp/pulls/123',
    id: 123456789,
    number: 123,
    state: 'open',
    title: 'Test PR',
    body: 'test',
    created_at: date,
    updated_at: date,
    closed_at: null,
    merged_at: null,
    merge_commit_sha: 'c1eb94186b1e0ee36d84a3ab97636455b9b62db8',
    assignee: null,
    assignees: [],
    requested_reviewers: [],
    requested_teams: [],
    labels: labels.map(name => ({ name })),
    milestone: null,
    draft: false,
    base: {
      label: 'TestOrg:test',
      ref: 'test',
      sha: '1fc9196bb7e56d0b0869035e77fcaf397d70d537',
    },
    _links: {},
    author_association: 'COLLABORATOR',
    head: {
      ref: 'testpr',
    },
  },
];

export const logInfoNotErrors = () => {
  const logger = getLogger(true);
  logger.debug = () => {};
  logger.info = () => {};
  const info = jest.spyOn(logger, 'info');
  const warning = jest.spyOn(logger, 'warning');
  const error = jest.spyOn(logger, 'error');
  logger.assert = () => {
    expect(info).toBeCalled();
    expect(warning).not.toBeCalled();
    expect(error).not.toBeCalled();
  };
  return logger;
};
