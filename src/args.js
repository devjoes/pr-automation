import * as core from '@actions/core';
import process from 'process';

const autoCloseLabel = 'autoCloseLabel';
const warnClosingAfterSecs = 'warnClosingAfterSecs';
const autoCloseAfterWarnSecs = 'autoCloseAfterWarnSecs';

export default () => {
  const getArg = (name, opts) =>
    process.env['PR_AUTOMATION_' + name.replace(/([A-Z])/g, '_$1').toUpperCase()] ||
    core.getInput(name, opts);
  const args = {
    token: getArg('token', { required: true }),
    autoCloseLabel: getArg('autoCloseLabel'),
    autoMergeLabel: getArg('autoMergeLabel'),
    warnClosingAfterSecs: parseInt(getArg('warnClosingAfterSecs')),
    autoCloseAfterWarnSecs: parseInt(getArg('autoCloseAfterWarnSecs')),
    closingSoonComment: getArg('closingSoonComment'),
    closingSoonLabel: getArg('closingSoonLabel'),
    deleteOnClose: getArg('deleteOnClose').toLowerCase() == 'true',
    deleteOnMerge: getArg('deleteOnMerge').toLowerCase() == 'true',
  };
  if (
    args.autoCloseLabel &&
    args.autoCloseLabel !== '' &&
    (!args.warnClosingAfterSecs || !autoCloseAfterWarnSecs)
  ) {
    core.setFailed(
      `If ${autoCloseLabel} is specified then ${warnClosingAfterSecs} and ${autoCloseAfterWarnSecs} must also be specified`,
    );
    return;
  }
  return args;
};
