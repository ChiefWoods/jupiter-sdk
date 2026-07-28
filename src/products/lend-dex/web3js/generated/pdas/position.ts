import { Address } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';

export interface PositionPdaSeeds {
    dex: Address;
    protocol: Address;
}

export async function findPositionPda(
    seeds: PositionPdaSeeds,
    programId: Address = DEX_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('dex_position', 'utf8'),
        seeds.dex.toBytes(),
        seeds.protocol.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
