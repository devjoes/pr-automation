export default ({ client, context }) =>
  async function* () {
    let prs = [];
    let page = 0;
    do {
      prs = await client.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'open',
        per_page: 100,
        page: page++,
      });
      for (let i = 0; i < prs.data.length; i++) {
        yield prs.data[i];
      }
    } while (prs.data.length && page < 1000);
  };
