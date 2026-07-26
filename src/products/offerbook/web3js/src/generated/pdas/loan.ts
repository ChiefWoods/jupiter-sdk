import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface LoanPdaSeeds {
    offer: Address;
    fillIndex: bigint;
}

export async function findLoanPda(
    seeds: LoanPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('loan', 'utf8'),
        seeds.offer.toBytes(),
        Buffer.from(new Uint8Array(new BigUint64Array([BigInt(seeds.fillIndex)]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
