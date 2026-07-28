import { Address } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export async function findConfigPda(programId: Address = JUPSTABLE_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('config', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
