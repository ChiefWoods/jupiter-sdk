import { Address } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';

export interface RateModelPdaSeeds {
    mint: Address;
}

export async function findRateModelPda(
    seeds: RateModelPdaSeeds,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('rate_model', 'utf8'), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
