import { Address } from '@solana/web3.js';

export const GENIEDISTRIBUTOR_PROGRAM_ID = new Address('GenieRGuCtgfDGThwjp2GLreQMFtJoG1fqFE8MF1gAzG');

export * from './accounts/campaign';
export * from './accounts/claimStatus';
export * from './instructions/claim';
export * from './instructions/clawback';
export * from './instructions/closeClaimStatus';
export * from './instructions/idempotentClaim';
export * from './instructions/initializeCampaign';
export * from './instructions/initializeClaimStatus';
export * from './instructions/setAdmin';
export * from './instructions/setClawbackReceiver';
export * from './pdas/claimStatus';
export * from './pdas/campaign';
