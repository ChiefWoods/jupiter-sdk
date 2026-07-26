import { Address } from '@solana/web3.js';

export const FLASHLOAN_PROGRAM_ID = new Address('jupgfSgfuAXv4B6R2Uxu85Z1qdzgju79s6MfZekN6XS');

export * from './accounts/flashloanAdmin';
export * from './instructions/activateProtocol';
export * from './instructions/flashloanBorrow';
export * from './instructions/flashloanPayback';
export * from './instructions/initFlashloanAdmin';
export * from './instructions/pauseProtocol';
export * from './instructions/setFlashloanFee';
export * from './instructions/updateAuthority';
export * from './pdas/flashloanAdmin';
