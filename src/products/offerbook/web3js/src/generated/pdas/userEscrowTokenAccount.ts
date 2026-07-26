import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface UserEscrowTokenAccountPdaSeeds {
    signerUser: Address;
    tokenProgram: Address;
    nftMint: Address;
}

export async function findUserEscrowTokenAccountPda(
    seeds: UserEscrowTokenAccountPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.signerUser.toBytes(),
        seeds.tokenProgram.toBytes(),
        seeds.nftMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
