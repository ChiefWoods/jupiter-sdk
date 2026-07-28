import { Address } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';

export interface UserSupplyPositionPdaSeeds {
    supplyMint: Address;
    protocol: Address;
}

export async function findUserSupplyPositionPda(
    seeds: UserSupplyPositionPdaSeeds,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('user_supply_position', 'utf8'),
        seeds.supplyMint.toBytes(),
        seeds.protocol.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
