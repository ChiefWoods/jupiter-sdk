import { Address } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';

export interface TicketAtaPdaSeeds {
    ticket: Address;
    settlementMint: Address;
}

export async function findTicketAtaPda(
    seeds: TicketAtaPdaSeeds,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [
        seeds.ticket.toBytes(),
        Buffer.from([
            6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235, 121, 172, 28, 180, 133, 237, 95, 91, 55,
            145, 58, 140, 245, 133, 126, 255, 0, 169,
        ]),
        seeds.settlementMint.toBytes(),
    ];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
