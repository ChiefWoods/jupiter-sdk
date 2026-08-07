import { Address } from '@solana/web3.js';
import { LENDLENDINGREWARDRATEMODEL_PROGRAM_ID } from '../programs/lendLendingRewardRateModel';

export interface LendingRewardsRateModelPdaSeeds {
    mint: Address;
}

export async function findLendingRewardsRateModelPda(
    seeds: LendingRewardsRateModelPdaSeeds,
    programId: Address = LENDLENDINGREWARDRATEMODEL_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('lending_rewards_rate_model', 'utf8'), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
