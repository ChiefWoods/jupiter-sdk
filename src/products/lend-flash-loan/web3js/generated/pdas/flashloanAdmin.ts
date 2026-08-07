import { Address } from '@solana/web3.js';
import { LENDFLASHLOAN_PROGRAM_ID } from '../programs/lendFlashLoan';

export async function findFlashloanAdminPda(programId: Address = LENDFLASHLOAN_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('flashloan_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
