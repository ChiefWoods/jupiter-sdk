import { Address } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';

export async function findConfigPda(programId: Address = STABLECOIN_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('config', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
