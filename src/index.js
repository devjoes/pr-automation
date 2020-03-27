import initActions from './actions';
import getArgs from './args';

const start = async args => {
  //const client = new github.GitHub(args.token);
  //(await client.pulls.get()).data.mergeable_state
  //(await client.pulls.get()).data.mergeable
  //const prs = await getPrs({ client, context: github.context, args });
  const actions = initActions({args});
  const prs = await actions.getPrs();
  for await (let pr of prs) {
    console.log(pr.title);
  }
};

start(getArgs());
