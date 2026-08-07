import { Address } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';

export interface BenefactorPdaSeeds {
    benefactorAuthority: Address;
}

export async function findBenefactorPda(
    seeds: BenefactorPdaSeeds,
    programId: Address = STABLECOIN_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('benefactor', 'utf8'), seeds.benefactorAuthority.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
