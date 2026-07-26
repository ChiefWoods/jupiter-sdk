import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface ProtocolFeeTokenAccountPdaSeeds {
    config: Address;
    collateralTokenProgram: Address;
    collateralMint: Address;
}

export async function findProtocolFeeTokenAccountPda(
    seeds: ProtocolFeeTokenAccountPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.config.toBytes(),
        seeds.collateralTokenProgram.toBytes(),
        seeds.collateralMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
