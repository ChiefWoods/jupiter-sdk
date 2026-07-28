import { Address } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';

export interface EscrowTokenPdaSeeds {
    escrow: Address;
    tokenProgram: Address;
    tokenMint: Address;
}

export async function findEscrowTokenPda(
    seeds: EscrowTokenPdaSeeds,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [seeds.escrow.toBytes(), seeds.tokenProgram.toBytes(), seeds.tokenMint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
