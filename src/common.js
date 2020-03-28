export const nowPlusSecs = secs => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + secs);
  return date.toDateString() + ' ' + date.toTimeString();
};

export const updatedInTheLastSecs = (p, secs) =>
  (new Date().getTime() - new Date(p.updated_at).getTime()) / 1000 < secs;

export const hasLabel = (p, label) => {
  //console.log(p);
  return p.labels.filter(l => l.name === label).length > 0;
};

export const describePr = pr => `PR #${pr.number} '${pr.title}'`;

export const branchNameFromRef = ref => ref.toLowerCase().split(/\//g).slice(-1)[0];
