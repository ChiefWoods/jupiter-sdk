import { Address } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';

export interface VaultMetadataPdaSeeds {
    vaultId: number;
}

export async function findVaultMetadataPda(
    seeds: VaultMetadataPdaSeeds,
    programId: Address = LENDBORROW_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('vault_metadata', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.vaultId]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
