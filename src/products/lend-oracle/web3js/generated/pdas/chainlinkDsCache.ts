import { Address } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';

export interface ChainlinkDsCachePdaSeeds {
    nonce: number;
}

export async function findChainlinkDsCachePda(
    seeds: ChainlinkDsCachePdaSeeds,
    programId: Address = ORACLE_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('chainlink_ds', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.nonce]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
