import { Address } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';

export interface TokenReservePdaSeeds {
    mint: Address;
}

export async function findTokenReservePda(
    seeds: TokenReservePdaSeeds,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('reserve', 'utf8'), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
