import { Address } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export interface TokenAccountPdaSeeds {
    authority: Address;
    tokenProgram: Address;
    mint: Address;
}

export async function findTokenAccountPda(
    seeds: TokenAccountPdaSeeds,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [seeds.authority.toBytes(), seeds.tokenProgram.toBytes(), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
