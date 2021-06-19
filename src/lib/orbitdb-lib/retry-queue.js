/*
  This library leverages the p-retry and p-queue libraries, to created a
  validation queue with automatic retry.
  New nodes connecting will attempt to rapidly validate a lot of entries.
  A promise-based queue allows this to happen while respecting rate-limits
  of the blockchain service provider.
*/
