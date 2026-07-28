import { Address } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export interface CustodianTokenAccountPdaSeeds {
    custodian: Address;
    vaultTokenProgram: Address;
    vaultMint: Address;
}

export async function findCustodianTokenAccountPda(
    seeds: CustodianTokenAccountPdaSeeds,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.custodian.toBytes(),
        seeds.vaultTokenProgram.toBytes(),
        seeds.vaultMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
