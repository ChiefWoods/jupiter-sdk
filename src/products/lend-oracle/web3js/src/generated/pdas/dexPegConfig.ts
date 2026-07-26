import { Address } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';

export interface DexPegConfigPdaSeeds {
    nonce: number;
}

export async function findDexPegConfigPda(
    seeds: DexPegConfigPdaSeeds,
    programId: Address = ORACLE_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('dex_peg', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.nonce]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
