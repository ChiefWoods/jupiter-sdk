import { Address } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';

export interface MetadataAccountPdaSeeds {
    fTokenMint: Address;
}

export async function findMetadataAccountPda(
    seeds: MetadataAccountPdaSeeds,
    programId: Address = LENDING_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('metadata', 'utf8'),
        Buffer.from([
            11, 112, 101, 177, 227, 209, 124, 69, 56, 157, 82, 127, 107, 4, 195, 205, 88, 184, 108, 115, 26, 160, 253,
            181, 73, 182, 209, 188, 3, 248, 41, 70,
        ]),
        seeds.fTokenMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
