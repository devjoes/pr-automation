"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var core = _interopRequireWildcard(require("@actions/core"));

var _process = _interopRequireDefault(require("process"));

var _parseDuration = _interopRequireWildcard(require("parse-duration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = logger => {
  const getArg = (name, opts, defaultIfMissing) => (_process.default.env['PR_AUTOMATION_' + name.replace(/([A-Z])/g, '_$1').toUpperCase()] || core.getInput(name, opts) || defaultIfMissing || '').trim();

  const args = {
    token: getArg('token', {
      required: true
    }),
    autoCloseLabel: getArg('autoCloseLabel'),
    autoMergeLabel: getArg('autoMergeLabel'),
    warnClosingAfterSecs: (0, _parseDuration.default)(getArg('warnClosingAfter', undefined, '0')) / 1000,
    autoCloseAfterWarnSecs: (0, _parseDuration.default)(getArg('autoCloseAfterWarn', undefined, '0')) / 1000,
    closingSoonComment: getArg('closingSoonComment'),
    closingSoonLabel: getArg('closingSoonLabel'),
    deleteOnClose: getArg('deleteOnClose').toLowerCase() == 'true',
    deleteOnMerge: getArg('deleteOnMerge').toLowerCase() == 'true',
    branchBlackListLowerCase: (getArg('branchBlackList') || 'master').split(/\s?\,\s?/g).map(s => s.trim().toLowerCase()).filter(s => s.length > 0)
  };

  const obfuscate = str => str.length === 0 ? '' : str[0].padEnd(Math.abs(str.length - 2), '*') + str[str.length - 1];

  logger.info('Starting with the arguments:\n' + JSON.stringify({ ...args,
    token: obfuscate(args.token)
  }, null, 2));

  const fail = msg => {
    logger.error(msg);
    core.setFailed(msg);
  };

  if (!args.token || args.token.trim().length === 0) {
    fail('token is required');
    return;
  }

  if (args.autoCloseLabel && args.autoCloseLabel !== '' && (args.warnClosingAfterSecs === 0 || args.autoCloseAfterWarnSecs === 0 || !args.closingSoonComment || !args.closingSoonLabel)) {
    fail('If autoCloseLabel is specified then warnClosingAfter, autoCloseAfterWarn, closingSoonComment and closingSoonLabel must also be specified');
    return;
  }

  return args;
};

exports.default = _default;
//# sourceMappingURL=args.js.map