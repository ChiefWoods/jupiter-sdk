import { Address } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';

export interface VaultConfigPdaSeeds {
    vaultId: number;
}

export async function findVaultConfigPda(
    seeds: VaultConfigPdaSeeds,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('vault_config', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.vaultId]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
