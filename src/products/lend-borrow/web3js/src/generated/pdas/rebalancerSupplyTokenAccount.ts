import { Address } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';

export interface RebalancerSupplyTokenAccountPdaSeeds {
    rebalancer: Address;
    supplyTokenProgram: Address;
    supplyToken: Address;
}

export async function findRebalancerSupplyTokenAccountPda(
    seeds: RebalancerSupplyTokenAccountPdaSeeds,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.rebalancer.toBytes(),
        seeds.supplyTokenProgram.toBytes(),
        seeds.supplyToken.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
