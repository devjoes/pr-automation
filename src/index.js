import initActions from './actions';
import getArgs from './args';
import getLogger from './logger';
import processPrs from './process-prs';

const main = async () => {
  const logger = getLogger();
  try {
    const args = getArgs(logger);
    const actions = initActions(args, logger);
    await processPrs(args, actions);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
main();
