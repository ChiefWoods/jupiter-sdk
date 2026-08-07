import { Address } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';

export interface OraclePdaSeeds {
    nonce: number;
}

export async function findOraclePda(
    seeds: OraclePdaSeeds,
    programId: Address = LENDORACLE_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('oracle', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.nonce]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
