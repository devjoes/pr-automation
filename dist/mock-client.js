"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _common = require("./common");

var _commonTest = require("./common-test");

function _default(args, date, labels, commentDate) {
  this.getFakePrs = _commonTest.getFakePrs;

  this.getFakeComments = () => ({
    data: [{
      id: 321,
      created_at: (commentDate || date).toISOString(),
      body: args.closingSoonComment.replace(/\@closeTime/g, (0, _common.nowPlusSecs)(args.autoCloseAfterWarnSecs))
    }]
  });

  this.fakePrsArray = (0, _commonTest.getFakePrs)(date, labels);
  this.fakePrs = (0, _commonTest.arrayToGenerator)(this.fakePrsArray);
  setupMocks(this);
}

const setupMocks = client => {
  client.pulls = {
    list: jest.fn(({
      page
    }) => ({
      data: page == 1 ? client.fakePrsArray : []
    })),
    get: jest.fn(),
    update: jest.fn(),
    merge: jest.fn(),
    updateBranch: jest.fn()
  };
  client.git = {
    deleteRef: jest.fn()
  };
  client.issues = {
    addLabels: jest.fn(),
    createComment: jest.fn(),
    removeLabel: jest.fn(),
    deleteComment: jest.fn(),
    listComments: jest.fn(() => client.getFakeComments())
  };
  client.git = {
    deleteRef: jest.fn()
  };
};
//# sourceMappingURL=mock-client.js.map