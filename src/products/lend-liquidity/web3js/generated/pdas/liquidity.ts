import { Address } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';

export async function findLiquidityPda(programId: Address = LENDLIQUIDITY_PROGRAM_ID): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('liquidity', 'utf8')];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
