import { Address } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';

export interface DexPdaSeeds {
    dexId: number;
}

export async function findDexPda(seeds: DexPdaSeeds, programId: Address = DEX_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('dex', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.dexId]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
