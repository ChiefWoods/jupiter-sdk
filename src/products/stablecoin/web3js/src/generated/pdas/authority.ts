import { Address } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export async function findAuthorityPda(programId: Address = JUPSTABLE_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('authority', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
