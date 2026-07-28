import { Address } from '@solana/web3.js';

export const LENDINGREWARDRATEMODEL_PROGRAM_ID = new Address('jup7TthsMgcR9Y3L277b8Eo9uboVSmu1utkuXHNUKar');

export * from './accounts/lendingRewardsAdmin';
export * from './accounts/lendingRewardsRateModel';
export * from './instructions/cancelQueuedRewards';
export * from './instructions/initLendingRewardsAdmin';
export * from './instructions/initLendingRewardsRateModel';
export * from './instructions/queueNextRewards';
export * from './instructions/startRewards';
export * from './instructions/stopRewards';
export * from './instructions/transitionToNextRewards';
export * from './instructions/updateAuthority';
export * from './instructions/updateAuths';
export * from './pdas/lendingRewardsAdmin';
export * from './pdas/lendingRewardsRateModel';
export * from './types/addressBool';
