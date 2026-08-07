import { Address } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';

export interface DexMetadataPdaSeeds {
    dexId: number;
}

export async function findDexMetadataPda(
    seeds: DexMetadataPdaSeeds,
    programId: Address = LENDDEX_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('dex_metadata', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.dexId]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
