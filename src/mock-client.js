import { nowPlusSecs } from './common';
import { arrayToGenerator } from './common-test';

const getFakePrs = (date, labels) => [
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
      ref: 'refs/heads/testpr',
    },
  },
];

export default function (args, date, labels, transformClient) {
  this.getFakePrs = getFakePrs;
  this.getComments = () => ({
    data: [
      {
        id: 321,
        created_at: date.toISOString(),
        body: args.closingSoonComment.replace(
          /\@closeTime/g,
          nowPlusSecs(args.autoCloseAfterWarnSecs),
        ),
      },
    ],
  });
  this.fakePrsArray = getFakePrs(date, labels);
  this.fakePrs = arrayToGenerator(this.fakePrsArray);

  if (transformClient) {
    setupMocks(transformClient(this));
  } else {
    setupMocks(this);
  }
}

const setupMocks = client => {
  client.pulls = {
    list: jest.fn(({ page }) => ({ data: page == 0 ? client.fakePrsArray : [] })),
    get: jest.fn(),
    update: jest.fn(),
    merge: jest.fn(),
  };
  client.git = {
    deleteRef: jest.fn(),
  };

  client.issues = {
    addLabels: jest.fn(),
    createComment: jest.fn(),
    removeLabel: jest.fn(),
    deleteComment: jest.fn(),
    listComments: jest.fn(() => client.getComments()),
  };
  client.git = {
    deleteRef: jest.fn(),
  };
};
