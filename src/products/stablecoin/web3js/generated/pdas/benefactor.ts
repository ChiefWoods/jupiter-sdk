import { Address } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export interface BenefactorPdaSeeds {
    benefactorAuthority: Address;
}

export async function findBenefactorPda(
    seeds: BenefactorPdaSeeds,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('benefactor', 'utf8'), seeds.benefactorAuthority.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
