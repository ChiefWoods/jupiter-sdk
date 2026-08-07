import { Address } from '@solana/web3.js';
import { LENDLENDINGREWARDRATEMODEL_PROGRAM_ID } from '../programs/lendLendingRewardRateModel';

export async function findLendingRewardsAdminPda(
    programId: Address = LENDLENDINGREWARDRATEMODEL_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('lending_rewards_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
