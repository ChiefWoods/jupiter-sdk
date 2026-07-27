import { Address } from '@solana/web3.js';
import { JUPITER_PROGRAM_ID } from '..';

export interface DestinationTokenAccountPdaSeeds {
    wallet: Address;
    tokenProgram: Address;
    mint: Address;
}

export async function findDestinationTokenAccountPda(
    seeds: DestinationTokenAccountPdaSeeds,
    programId: Address = JUPITER_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [seeds.wallet.toBytes(), seeds.tokenProgram.toBytes(), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
