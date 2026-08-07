import { Address } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';

export interface OperatorPdaSeeds {
    upgradeAuthority: Address;
}

export async function findOperatorPda(
    seeds: OperatorPdaSeeds,
    programId: Address = STABLECOIN_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('operator', 'utf8'), seeds.upgradeAuthority.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
