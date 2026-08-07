import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';

export async function findConfigPda(programId: Address = OFFERBOOK_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('config', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
