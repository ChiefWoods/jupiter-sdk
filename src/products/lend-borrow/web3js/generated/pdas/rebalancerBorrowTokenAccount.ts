import { Address } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';

export interface RebalancerBorrowTokenAccountPdaSeeds {
    rebalancer: Address;
    borrowTokenProgram: Address;
    borrowToken: Address;
}

export async function findRebalancerBorrowTokenAccountPda(
    seeds: RebalancerBorrowTokenAccountPdaSeeds,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.rebalancer.toBytes(),
        seeds.borrowTokenProgram.toBytes(),
        seeds.borrowToken.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
