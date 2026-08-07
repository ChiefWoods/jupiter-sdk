import { Address } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';

export async function findOracleAdminPda(programId: Address = LENDORACLE_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('oracle_admin', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
