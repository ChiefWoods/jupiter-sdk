import { Address } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';

export async function findEventAuthorityPda(programId: Address = LOCKER_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('__event_authority', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
