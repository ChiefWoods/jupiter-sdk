import { Address } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export interface NewOperatorPdaSeeds {
    newOperatorAuthority: Address;
}

export async function findNewOperatorPda(
    seeds: NewOperatorPdaSeeds,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('operator', 'utf8'), seeds.newOperatorAuthority.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
