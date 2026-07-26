import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface LenderPrincipalEscrowPdaSeeds {
    signerUser: Address;
    principalTokenProgram: Address;
    principalMint: Address;
}

export async function findLenderPrincipalEscrowPda(
    seeds: LenderPrincipalEscrowPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.signerUser.toBytes(),
        seeds.principalTokenProgram.toBytes(),
        seeds.principalMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
