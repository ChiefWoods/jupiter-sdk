import { Address } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';

export interface VaultPdaSeeds {
    settlementMint: Address;
}

export async function findVaultPda(
    seeds: VaultPdaSeeds,
    programId: Address = PREDICTION_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('vault', 'utf8'), seeds.settlementMint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
