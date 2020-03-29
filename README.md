# PR Automation

This Github action will automatically update pull requests if required, it will also merge pull requests once any checks/approvals have passed. It can also comment on and label pull requests that are becoming stale and then close them. Once a PR has been merged/closed it can also delete the branch.

## Options

| Option                 | Description                                                                       | Default                                                        |
|------------------------|-----------------------------------------------------------------------------------|----------------------------------------------------------------|
| token                  | Token to authenticate with when connecting to Github                              |                                                                |
| autoCloseLabel         | Label of PRs to be automatically closed (or * for all PRs)                        | auto-close                                                     |
| autoMergeLabel         | Label of PRs to be automatically merged (or * for all PRs)                        | auto-merge                                                     |
| warnClosingAfter       | Warn user their PR will be closed after it has been open x (x can be 1s,2m,3h etc)| 3d                                                             |
| closingSoonComment     | Comment to post on PRs that are closing soon                                      | This pull request is inactive and will be closed at @closeTime |
| closingSoonLabel       | Label to apply to PRs that are closing soon                                       | closing-soon                                                   |
| autoCloseAfterWarn     | Auto close PRs after author has been warned x ago (x can be 1s,2m,3h etc)         | 4h                                                             |
| deleteOnMerge          | Delete branch once PR has been merged                                             | false                                                          |
| deleteOnClose          | Delete branch once PR is closed                                                   | false                                                          |
| branchBlackList        | PRs where these branches are the base or head will be ignored (comma seperated)   | master                                                         |
