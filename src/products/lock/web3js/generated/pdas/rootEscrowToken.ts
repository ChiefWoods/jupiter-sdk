import { Address } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';

export interface RootEscrowTokenPdaSeeds {
    rootEscrow: Address;
    tokenProgram: Address;
    tokenMint: Address;
}

export async function findRootEscrowTokenPda(
    seeds: RootEscrowTokenPdaSeeds,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.rootEscrow.toBytes(),
        seeds.tokenProgram.toBytes(),
        seeds.tokenMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
