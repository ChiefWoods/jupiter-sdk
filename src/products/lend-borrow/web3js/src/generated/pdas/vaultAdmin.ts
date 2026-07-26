import { Address } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';

export async function findVaultAdminPda(programId: Address = VAULTS_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('vault_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
