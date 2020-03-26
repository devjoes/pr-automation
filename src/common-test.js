export const args = {
  autoCloseLabel: 'automated-pr',
  autoMergeLabel: 'auto-merge',
  warnClosingAfterSecs: 60 * 60 * 3,
  autoCloseAfterWarnSecs: 60 * 60 * 6,
  closingSoonComment:
    'This pull request is inactive and will be closed at @closeTime',
  closingSoonLabel: 'closing-soon',
  deleteOnMerge: false,
  deleteOnClose: false,
};

// export const getToken = () => {
//   const token = process.env.GITHUB_TOKEN;
//   console.log(token);
//   if (!token) {
//     throw Error('Environment variable GITHUB_TOKEN is not set');
//   }
//   return token;
// };

export const context = {
  repo: {
    owner: 'JSainsburyPLC',
    repo: 'retail-k8s',
  },
};
export const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

export const fnAssert = (fn, props, invert) =>
  (invert ? expect(fn).not : expect(fn)).toBeCalledWith(
    expect.objectContaining({
      ...context.repo,
      ...(props || {}),
    }),
  );

  export const generatorToArray = async (gen) => {
    const arr = [];
    for await (let i of gen) {
      arr.push(i);
    }
    return arr;
  };

  export async function* arrayToGenerator (arr){
    for (let i = 0; i < arr.length; i++){
      yield arr[i];
    }
  }