import { nowPlusSecs } from './common';
import { arrayToGenerator, getFakePrs } from './common-test';

export default function (args, date, labels, commentDate) {
  this.getFakePrs = getFakePrs;
  this.getFakeComments = () => ({
    data: [
      {
        id: 321,
        created_at: (commentDate||date).toISOString(),
        body: args.closingSoonComment.replace(
          /\@closeTime/g,
          nowPlusSecs(args.autoCloseAfterWarnSecs),
        ),
      },
    ],
  });
  this.fakePrsArray = getFakePrs(date, labels);
  this.fakePrs = arrayToGenerator(this.fakePrsArray);

  setupMocks(this);
}

const setupMocks = client => {
  client.pulls = {
    list: jest.fn(({ page }) => ({ data: page == 1 ? client.fakePrsArray : [] })),
    get: jest.fn(),
    update: jest.fn(),
    merge: jest.fn(),
    updateBranch: jest.fn(),
  };
  client.git = {
    deleteRef: jest.fn(),
  };

  client.issues = {
    addLabels: jest.fn(),
    createComment: jest.fn(),
    removeLabel: jest.fn(),
    deleteComment: jest.fn(),
    listComments: jest.fn(() => client.getFakeComments()),
  };
  client.git = {
    deleteRef: jest.fn(),
  };
};
