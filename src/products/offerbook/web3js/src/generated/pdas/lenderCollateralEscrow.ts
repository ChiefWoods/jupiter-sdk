import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface LenderCollateralEscrowPdaSeeds {
    signerUser: Address;
    collateralTokenProgram: Address;
    collateralMint: Address;
}

export async function findLenderCollateralEscrowPda(
    seeds: LenderCollateralEscrowPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.signerUser.toBytes(),
        seeds.collateralTokenProgram.toBytes(),
        seeds.collateralMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
