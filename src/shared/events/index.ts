// Only register event observers in non-test environments to avoid lingering handles
if (process.env.NODE_ENV !== 'test') {
  import('./observers/answer.observer');
}