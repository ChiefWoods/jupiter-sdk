import { Address } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';

export interface RevenueCollectorAccountPdaSeeds {
    revenueCollector: Address;
    tokenProgram: Address;
    mint: Address;
}

export async function findRevenueCollectorAccountPda(
    seeds: RevenueCollectorAccountPdaSeeds,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.revenueCollector.toBytes(),
        seeds.tokenProgram.toBytes(),
        seeds.mint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
