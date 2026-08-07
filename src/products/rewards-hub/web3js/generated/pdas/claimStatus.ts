import { Address } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';

export interface ClaimStatusPdaSeeds {
    claimant: Address;
    campaign: Address;
}

export async function findClaimStatusPda(
    seeds: ClaimStatusPdaSeeds,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('ClaimStatus', 'utf8'),
        seeds.claimant.toBytes(),
        seeds.campaign.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
