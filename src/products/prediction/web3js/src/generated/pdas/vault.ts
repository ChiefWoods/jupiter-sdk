import { Address } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';

export interface VaultPdaSeeds {
    settlementMint: Address;
}

export async function findVaultPda(
    seeds: VaultPdaSeeds,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('vault', 'utf8'), seeds.settlementMint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
