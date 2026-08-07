import { Address } from '@solana/web3.js';

export interface CustodianTokenAccountPdaSeeds {
    custodian: Address;
    vaultTokenProgram: Address;
    vaultMint: Address;
}

export async function findCustodianTokenAccountPda(seeds: CustodianTokenAccountPdaSeeds): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [
        seeds.custodian.toBytes(),
        seeds.vaultTokenProgram.toBytes(),
        seeds.vaultMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
