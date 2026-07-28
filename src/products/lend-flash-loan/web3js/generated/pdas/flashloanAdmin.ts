import { Address } from '@solana/web3.js';
import { FLASHLOAN_PROGRAM_ID } from '..';

export async function findFlashloanAdminPda(programId: Address = FLASHLOAN_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('flashloan_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
