export default async function*({ client, context }) {
  let prs = [];
  let page = 0;
  do {
    prs = await client.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
      per_page: 100, //TODO: pagination
      page: page++
    });
    
    for (let i = 0; i < prs.data.length; i++) {
      yield prs.data[i];
    }
  } while (prs.data.length && page < 1000);
};


const old = async ({ client, context }) => {
  let prs = [];
  let page = 0;
  const allPrs = [];
  do {
    prs = await client.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
      per_page: 100, //TODO: pagination
      page: page++
    });
    console.log(prs.data.length, page)
    allPrs.push(...prs.data);
  } while (prs.data.length && page < 1000);
  return allPrs;
};
