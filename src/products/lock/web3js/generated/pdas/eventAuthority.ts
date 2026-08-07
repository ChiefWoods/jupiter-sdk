import { Address } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';

export async function findEventAuthorityPda(programId: Address = LOCK_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('__event_authority', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
