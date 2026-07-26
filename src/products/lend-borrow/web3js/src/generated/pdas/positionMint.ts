import { Address } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';

export interface PositionMintPdaSeeds {
    vaultId: number;
    nextPositionId: number;
}

export async function findPositionMintPda(
    seeds: PositionMintPdaSeeds,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('position_mint', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.vaultId]).buffer)),
        Buffer.from(new Uint8Array(new Uint32Array([seeds.nextPositionId]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
