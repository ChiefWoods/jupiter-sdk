import { Address } from '@solana/web3.js';

export interface MetadataAccountPdaSeeds {
    fTokenMint: Address;
}

export async function findMetadataAccountPda(seeds: MetadataAccountPdaSeeds): Promise<[Address, number]> {
    const programId = new Address('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
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
