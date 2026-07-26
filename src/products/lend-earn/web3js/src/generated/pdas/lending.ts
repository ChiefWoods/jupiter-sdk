import { Address } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';

export interface LendingPdaSeeds {
    mint: Address;
    fTokenMint: Address;
}

export async function findLendingPda(
    seeds: LendingPdaSeeds,
    programId: Address = LENDING_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('lending', 'utf8'),
        seeds.mint.toBytes(),
        seeds.fTokenMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
