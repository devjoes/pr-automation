import core from "@actions/core";
import github from "@actions/github";
import { getPrs } from "./processPrs";
import { getArgs } from "./args";

const start = async args => {
  const client = new github.GitHub(args.token);
  //(await client.pulls.get()).data.mergeable_state
  //(await client.pulls.get()).data.mergeable
  const prs = await getPrs(client, github.context);
};


start(getArgs());
