import { Address } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';

export interface EscrowMetadataPdaSeeds {
    escrow: Address;
}

export async function findEscrowMetadataPda(
    seeds: EscrowMetadataPdaSeeds,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('escrow_metadata', 'utf8'), seeds.escrow.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
