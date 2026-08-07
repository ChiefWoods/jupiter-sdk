import { Address } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';

export interface EscrowPdaSeeds {
    base: Address;
}

export async function findEscrowPda(
    seeds: EscrowPdaSeeds,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('escrow', 'utf8'), seeds.base.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
