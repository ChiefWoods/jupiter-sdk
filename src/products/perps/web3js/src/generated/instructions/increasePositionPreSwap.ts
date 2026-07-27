import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface IncreasePositionPreSwapInstructionAccounts {
    keeper: Address;
    keeperAta: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    position: Address;
    collateralCustody: Address;
    collateralCustodyTokenAccount: Address;
    instructionSysvar: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export function createIncreasePositionPreSwapInstruction(
    accounts: IncreasePositionPreSwapInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.keeperAta, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.instructionSysvar, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('1a88e1d916155314', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
