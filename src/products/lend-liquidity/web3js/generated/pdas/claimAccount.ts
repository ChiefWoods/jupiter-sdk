import { Address } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';

export interface ClaimAccountPdaSeeds {
    user: Address;
    mint: Address;
}

export async function findClaimAccountPda(
    seeds: ClaimAccountPdaSeeds,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('user_claim', 'utf8'), seeds.user.toBytes(), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
