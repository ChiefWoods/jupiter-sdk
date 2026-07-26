import { Address } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';

export interface BranchPdaSeeds {
    vaultId: number;
    branchId: number;
}

export async function findBranchPda(
    seeds: BranchPdaSeeds,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('branch', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.vaultId]).buffer)),
        Buffer.from(new Uint8Array(new Uint32Array([seeds.branchId]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
