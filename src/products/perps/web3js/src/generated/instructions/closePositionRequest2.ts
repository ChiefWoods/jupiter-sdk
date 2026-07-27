import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface ClosePositionRequest2InstructionAccounts {
    keeper?: Address;
    owner: Address;
    ownerAta: Address;
    pool: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    position: Address;
    mint: Address;
    tokenProgram: Address;
    systemProgram: Address;
    associatedTokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export function createClosePositionRequest2Instruction(
    accounts: ClosePositionRequest2InstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        accounts.keeper
            ? { pubkey: accounts.keeper, isSigner: true, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.owner, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('7944a21cd82fc842', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
