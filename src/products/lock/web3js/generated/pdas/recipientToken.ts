import { Address } from '@solana/web3.js';

export interface RecipientTokenPdaSeeds {
    escrow: Address;
    tokenProgram: Address;
    tokenMint: Address;
}

export async function findRecipientTokenPda(seeds: RecipientTokenPdaSeeds): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [seeds.escrow.toBytes(), seeds.tokenProgram.toBytes(), seeds.tokenMint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
