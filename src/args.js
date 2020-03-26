import core from "@actions/core";

//todo: these are now pointless ans hould be removed
const autoCloseLabel = 'autoCloseLabel';
const autoMergeLabel = 'autoMergeLabel';
const warnClosingAfterSecs = 'warnClosingAfterSecs';
const autoCloseAfterWarnSecs = 'autoCloseAfterWarnSecs';
const closingSoonComment = 'closingSoonComment';
const closingSoonLabel = 'closingSoonLabel';

export default () => {
    const args = {
      token: core.getInput("token", { required: true }),
      autoCloseLabel: core.getInput(autoCloseLabel),
      autoMergeLabel: core.getInput(autoMergeLabel),
      warnClosingAfterSecs: parseInt(core.getInput(warnClosingAfterSecs)),
      autoCloseAfterWarnSecs: parseInt(core.getInput(autoCloseAfterWarnSecs)),
      closingSoonComment: core.getInput(closingSoonComment),
      closingSoonLabel: core.getInput(closingSoonLabel),
      deleteOnClose: core.getInput('deleteOnClose').toLowerCase() == 'true',
      deleteOnMerge: core.getInput('deleteOnMerge').toLowerCase() == 'true',
    };
    if (args.autoCloseLabel && args.autoCloseLabel !== '' && (!args.warnClosingAfterSecs || !autoCloseAfterWarnSecs)) {
        core.setFailed(`If ${autoCloseLabel} is specified then ${warnClosingAfterSecs} and ${autoCloseAfterWarnSecs} must also be specified`);
        return;
    }
    return args;
  };