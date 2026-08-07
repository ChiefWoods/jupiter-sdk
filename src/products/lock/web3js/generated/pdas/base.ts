import { Address } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';

export interface BasePdaSeeds {
    rootEscrow: Address;
    recipient: Address;
}

export async function findBasePda(
    seeds: BasePdaSeeds,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('base', 'utf8'),
        seeds.rootEscrow.toBytes(),
        seeds.recipient.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
