import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface SignerUserPdaSeeds {
    signer: Address;
}

export async function findSignerUserPda(
    seeds: SignerUserPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('user', 'utf8'), seeds.signer.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
