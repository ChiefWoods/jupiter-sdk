import { Address } from '@solana/web3.js';

export interface RootEscrowTokenPdaSeeds {
    rootEscrow: Address;
    tokenProgram: Address;
    tokenMint: Address;
}

export async function findRootEscrowTokenPda(seeds: RootEscrowTokenPdaSeeds): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [
        seeds.rootEscrow.toBytes(),
        seeds.tokenProgram.toBytes(),
        seeds.tokenMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
