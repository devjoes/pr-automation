import * as core from '@actions/core';
import process from 'process';
import parseDuration, { ms } from 'parse-duration';

export default logger => {
  const getArg = (name, opts, defaultIfMissing) =>
    (
      process.env['PR_AUTOMATION_' + name.replace(/([A-Z])/g, '_$1').toUpperCase()] ||
      core.getInput(name, opts) ||
      defaultIfMissing ||
      ''
    ).trim();
  const args = {
    token: getArg('token', { required: true }),
    autoCloseLabel: getArg('autoCloseLabel'),
    autoMergeLabel: getArg('autoMergeLabel'),
    warnClosingAfterSecs: parseDuration(getArg('warnClosingAfter', undefined, '0')) / 1000,
    autoCloseAfterWarnSecs: parseDuration(getArg('autoCloseAfterWarn', undefined, '0')) / 1000,
    closingSoonComment: getArg('closingSoonComment'),
    closingSoonLabel: getArg('closingSoonLabel'),
    deleteOnClose: getArg('deleteOnClose').toLowerCase() == 'true',
    deleteOnMerge: getArg('deleteOnMerge').toLowerCase() == 'true',
    branchBlackListLowerCase: (getArg('branchBlackList') || 'master')
      .split(/\s?\,\s?/g)
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 0),
  };

  const obfuscate = str =>
    str.length === 0 ? '' : str[0].padEnd(Math.abs(str.length - 2), '*') + str[str.length - 1];

  logger.info('Starting with the arguments:\n' + JSON.stringify({
    ...args,
    token: obfuscate(args.token)
  }, null, 2));

  if (!args.token || args.token.trim().length === 0) {
    logger.error('token is required');
    return;
  }
  if (
    args.autoCloseLabel &&
    args.autoCloseLabel !== '' &&
    (args.warnClosingAfterSecs === 0 ||
      args.autoCloseAfterWarnSecs === 0 ||
      !args.closingSoonComment ||
      !args.closingSoonLabel)
  ) {
    logger.error(
      'If autoCloseLabel is specified then warnClosingAfter, autoCloseAfterWarn, closingSoonComment and closingSoonLabel must also be specified',
    );
    return;
  }
  return args;
};
