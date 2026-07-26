import { Address } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';

export interface PositionTokenAccountPdaSeeds {
    signer: Address;
    positionMint: Address;
}

export async function findPositionTokenAccountPda(
    seeds: PositionTokenAccountPdaSeeds,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.signer.toBytes(),
        Buffer.from([
            6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235, 121, 172, 28, 180, 133, 237, 95, 91, 55,
            145, 58, 140, 245, 133, 126, 255, 0, 169,
        ]),
        seeds.positionMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
