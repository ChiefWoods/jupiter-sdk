import { Address } from '@solana/web3.js';

export interface RebalancerSupplyTokenAccountPdaSeeds {
    rebalancer: Address;
    supplyTokenProgram: Address;
    supplyToken: Address;
}

export async function findRebalancerSupplyTokenAccountPda(
    seeds: RebalancerSupplyTokenAccountPdaSeeds,
): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [
        seeds.rebalancer.toBytes(),
        seeds.supplyTokenProgram.toBytes(),
        seeds.supplyToken.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
