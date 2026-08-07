import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';

export async function findFeeAuthorityPda(programId: Address = OFFERBOOK_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('fee', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
