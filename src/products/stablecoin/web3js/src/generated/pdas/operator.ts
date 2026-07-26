import { Address } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export interface OperatorPdaSeeds {
    upgradeAuthority: Address;
}

export async function findOperatorPda(
    seeds: OperatorPdaSeeds,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('operator', 'utf8'), seeds.upgradeAuthority.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
