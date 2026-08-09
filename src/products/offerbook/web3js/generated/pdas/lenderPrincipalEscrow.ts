import { Address } from '@solana/web3.js';

export interface LenderPrincipalEscrowPdaSeeds {
    lenderUser: Address;
    principalTokenProgram: Address;
    principalMint: Address;
}

export async function findLenderPrincipalEscrowPda(seeds: LenderPrincipalEscrowPdaSeeds): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [
        seeds.lenderUser.toBytes(),
        seeds.principalTokenProgram.toBytes(),
        seeds.principalMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
