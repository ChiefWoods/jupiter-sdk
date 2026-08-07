import { Address } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';

export interface UserSupplyPositionPdaSeeds {
    supplyMint: Address;
    protocol: Address;
}

export async function findUserSupplyPositionPda(
    seeds: UserSupplyPositionPdaSeeds,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('user_supply_position', 'utf8'),
        seeds.supplyMint.toBytes(),
        seeds.protocol.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
