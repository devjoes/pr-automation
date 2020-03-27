export const nowPlusSecs = secs => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + secs);
  return date.toISOString().substr(11, 8);
};

export const updatedInTheLastSecs = (p, secs) =>
  (new Date().getTime() - new Date(p.updated_at).getTime()) / 1000 < secs;

export const hasLabel = (p, label) => p.labels.filter(l => l.name === label).length > 0;
