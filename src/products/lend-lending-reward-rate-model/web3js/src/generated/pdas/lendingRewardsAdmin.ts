import { Address } from '@solana/web3.js';
import { LENDINGREWARDRATEMODEL_PROGRAM_ID } from '..';

export async function findLendingRewardsAdminPda(
    programId: Address = LENDINGREWARDRATEMODEL_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('lending_rewards_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
