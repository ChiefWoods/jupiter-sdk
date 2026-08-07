import { Address } from '@solana/web3.js';
import { LENDEARN_PROGRAM_ID } from '../programs/lendEarn';

export async function findLendingAdminPda(programId: Address = LENDEARN_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('lending_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
