import { Address } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';

export interface DepositorTokenAccountPdaSeeds {
    signer: Address;
    tokenProgram: Address;
    mint: Address;
}

export async function findDepositorTokenAccountPda(
    seeds: DepositorTokenAccountPdaSeeds,
    programId: Address = LENDING_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [seeds.signer.toBytes(), seeds.tokenProgram.toBytes(), seeds.mint.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
