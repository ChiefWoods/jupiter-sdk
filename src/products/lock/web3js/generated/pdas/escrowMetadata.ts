import { Address } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';

export interface EscrowMetadataPdaSeeds {
    escrow: Address;
}

export async function findEscrowMetadataPda(
    seeds: EscrowMetadataPdaSeeds,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('escrow_metadata', 'utf8'), seeds.escrow.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
