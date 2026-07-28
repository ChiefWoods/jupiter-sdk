import { Address } from '@solana/web3.js';
import { GENIEDISTRIBUTOR_PROGRAM_ID } from '..';

export interface TokenVaultPdaSeeds {
    campaign: Address;
    mint: Address;
}

export async function findTokenVaultPda(
    seeds: TokenVaultPdaSeeds,
    programId: Address = GENIEDISTRIBUTOR_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.campaign.toBytes(),
        Buffer.from([
            6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235, 121, 172, 28, 180, 133, 237, 95, 91, 55,
            145, 58, 140, 245, 133, 126, 255, 0, 169,
        ]),
        seeds.mint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
