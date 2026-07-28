import { Address } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';

export interface EscrowPdaSeeds {
    base: Address;
}

export async function findEscrowPda(
    seeds: EscrowPdaSeeds,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('escrow', 'utf8'), seeds.base.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
