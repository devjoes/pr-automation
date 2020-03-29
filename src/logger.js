import * as core from '@actions/core';
import process from 'process';

const isTokenInEnvVar = !!process.env.PR_AUTOMATION_TOKEN;

export default (isRunningLocally = isTokenInEnvVar) => ({
    debug: isRunningLocally ? console.log : core.debug,
    info: isRunningLocally ? console.log : core.info,
    warning: isRunningLocally ? console.warn : core.warning,
    error: isRunningLocally ? console.error : msg => {
        core.error(msg);
        core.setFailed(msg);
    },
});