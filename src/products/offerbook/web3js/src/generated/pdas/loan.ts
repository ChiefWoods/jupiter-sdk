import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface LoanPdaSeeds {
    offer: Address;
    offer: Address;
}

export async function findLoanPda(
    seeds: LoanPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('loan', 'utf8'), seeds.offer.toBytes(), seeds.offer.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
