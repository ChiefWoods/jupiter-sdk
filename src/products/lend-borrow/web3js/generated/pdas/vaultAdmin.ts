import { Address } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';

export async function findVaultAdminPda(programId: Address = LENDBORROW_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('vault_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
