import { Address } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';

export async function findDexAdminPda(programId: Address = LENDDEX_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('dex_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
