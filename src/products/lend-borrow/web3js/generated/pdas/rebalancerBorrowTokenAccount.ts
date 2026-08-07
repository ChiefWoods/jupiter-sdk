import { Address } from '@solana/web3.js';

export interface RebalancerBorrowTokenAccountPdaSeeds {
    rebalancer: Address;
    borrowTokenProgram: Address;
    borrowToken: Address;
}

export async function findRebalancerBorrowTokenAccountPda(
    seeds: RebalancerBorrowTokenAccountPdaSeeds,
): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [
        seeds.rebalancer.toBytes(),
        seeds.borrowTokenProgram.toBytes(),
        seeds.borrowToken.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
