export const LowPriorityJob = {
  priority: 3,
  attempts: 2,
  delay: 1000 * 10,
  backoff: 5,
};

export const MidPriorityJob = {
  priority: 2,
  attempts: 5,
  delay: 1000 * 5,
  backoff: 5,
};

export const HighPriorityJob = {
  priority: 1,
  attempts: 5,
  delay: 1000 * 5,
  backoff: 5,
};
