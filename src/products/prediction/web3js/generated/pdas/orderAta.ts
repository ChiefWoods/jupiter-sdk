import { Address } from '@solana/web3.js';

export interface OrderAtaPdaSeeds {
    order: Address;
    settlementMint: Address;
}

export async function findOrderAtaPda(seeds: OrderAtaPdaSeeds): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [
        seeds.order.toBytes(),
        Buffer.from([
            6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235, 121, 172, 28, 180, 133, 237, 95, 91, 55,
            145, 58, 140, 245, 133, 126, 255, 0, 169,
        ]),
        seeds.settlementMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
