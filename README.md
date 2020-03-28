# PR Automation

This Github action will automatically update pull requests if required, it will also merge pull requests once any checks/approvals have passed. It can also comment on and label pull requests that are becoming stale and then close them. Once a PR has been merged/closed it can also delete the branch.

## Options

|                        |                                                                       |
|------------------------|-----------------------------------------------------------------------|
| token                  | Token to authenticate with when connecting to Github                  |
| autoCloseLabel         | Label of PRs to be automatically closed                               |
| autoMergeLabel         | Label of PRs to be automatically merged                               |
| warnClosingAfterSecs   | Warn author their PR will be closed after it has been open for x secs |
| autoCloseAfterWarnSecs | Auto close PRs x secs after author has been warned                    |
| closingSoonComment     | Comment to post on PRs that are closing soon                          |
| closingSoonLabel       | Label to apply to PRs that are closing soon                           |
| deleteOnMerge          | Delete branch once PR has been merged                                 |
| deleteOnClose          | Delete branch once PR is closed                                       |
| branchBlackList        | PRs where these branches are the base or head will be ignored         |
