import { Address } from '@solana/web3.js';
import { LENDEARN_PROGRAM_ID } from '../programs/lendEarn';

export interface FTokenMintPdaSeeds {
    mint: Address;
}

export async function findFTokenMintPda(
    seeds: FTokenMintPdaSeeds,
    programId: Address = LENDEARN_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('f_token_mint', 'utf8'), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
