import { Address } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';

export interface UserBorrowPositionPdaSeeds {
    borrowMint: Address;
    protocol: Address;
}

export async function findUserBorrowPositionPda(
    seeds: UserBorrowPositionPdaSeeds,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        Buffer.from('user_borrow_position', 'utf8'),
        seeds.borrowMint.toBytes(),
        seeds.protocol.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
