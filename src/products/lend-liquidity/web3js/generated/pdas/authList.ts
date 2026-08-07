import { Address } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';

export async function findAuthListPda(programId: Address = LENDLIQUIDITY_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('auth_list', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
