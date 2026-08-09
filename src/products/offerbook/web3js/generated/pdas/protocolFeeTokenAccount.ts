import { Address } from '@solana/web3.js';

export interface ProtocolFeeTokenAccountPdaSeeds {
    config: Address;
    principalTokenProgram: Address;
    principalMint: Address;
}

export async function findProtocolFeeTokenAccountPda(
    seeds: ProtocolFeeTokenAccountPdaSeeds,
): Promise<[Address, number]> {
    const programId = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const seedsBuffer: Uint8Array[] = [
        seeds.config.toBytes(),
        seeds.principalTokenProgram.toBytes(),
        seeds.principalMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
