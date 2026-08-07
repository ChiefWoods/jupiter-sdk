import { Address } from '@solana/web3.js';

export interface UserEscrowTokenAccountPdaSeeds {
    signerUser: Address;
    tokenProgram: Address;
    mint: Address;
}

export async function findUserEscrowTokenAccountPda(seeds: UserEscrowTokenAccountPdaSeeds): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [seeds.signerUser.toBytes(), seeds.tokenProgram.toBytes(), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
