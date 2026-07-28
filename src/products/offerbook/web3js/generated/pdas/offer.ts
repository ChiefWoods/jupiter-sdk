import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface OfferPdaSeeds {
    signer: Address;
    offerIndex: bigint;
}

export async function findOfferPda(
    seeds: OfferPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('offer', 'utf8'),
        seeds.signer.toBytes(),
        Buffer.from(new Uint8Array(new BigUint64Array([BigInt(seeds.offerIndex)]).buffer)),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
