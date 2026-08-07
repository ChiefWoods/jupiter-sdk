import { Address } from '@solana/web3.js';

export interface DestinationTokenAccountPdaSeeds {
    wallet: Address;
    tokenProgram: Address;
    mint: Address;
}

export async function findDestinationTokenAccountPda(
    seeds: DestinationTokenAccountPdaSeeds,
): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [seeds.wallet.toBytes(), seeds.tokenProgram.toBytes(), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
