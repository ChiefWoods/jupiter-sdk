import { Address } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export interface VaultPdaSeeds {
    mint: Address;
}

export async function findVaultPda(
    seeds: VaultPdaSeeds,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('vault', 'utf8'), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
