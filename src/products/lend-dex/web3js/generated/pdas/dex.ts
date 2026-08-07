import { Address } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';

export interface DexPdaSeeds {
    dexId: number;
}

export async function findDexPda(
    seeds: DexPdaSeeds,
    programId: Address = LENDDEX_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('dex', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.dexId]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
