import { Address } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';

export interface TickHasDebtArrayPdaSeeds {
    vaultId: number;
    index: number;
}

export async function findTickHasDebtArrayPda(
    seeds: TickHasDebtArrayPdaSeeds,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('tick_has_debt', 'utf8'),
        Buffer.from(new Uint8Array(new Uint16Array([seeds.vaultId]).buffer)),
        Buffer.from([seeds.index]),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
