import { Address } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';

export async function findLendingAdminPda(programId: Address = LENDING_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('lending_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
