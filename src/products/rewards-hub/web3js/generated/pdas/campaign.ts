import { Address } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';

export interface CampaignPdaSeeds {
    admin: Address;
    mint: Address;
    campaignId: string;
}

export async function findCampaignPda(
    seeds: CampaignPdaSeeds,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('Campaign', 'utf8'),
        seeds.admin.toBytes(),
        seeds.mint.toBytes(),
        Buffer.from(seeds.campaignId, 'utf8'),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
