import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface OfferPdaSeeds {
    signer: Address;
    signerUser: Address;
}

export async function findOfferPda(
    seeds: OfferPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('offer', 'utf8'),
        seeds.signer.toBytes(),
        seeds.signerUser.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
