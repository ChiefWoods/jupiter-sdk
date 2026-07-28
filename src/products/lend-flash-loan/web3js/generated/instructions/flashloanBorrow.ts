import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { FLASHLOAN_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface FlashloanBorrowInstructionAccounts {
    signer: Address;
    flashloanAdmin: Address;
    signerBorrowTokenAccount: Address;
    mint: Address;
    flashloanTokenReservesLiquidity: Address;
    flashloanBorrowPositionOnLiquidity: Address;
    rateModel: Address;
    vault: Address;
    liquidity: Address;
    liquidityProgram: Address;
    tokenProgram: Address;
    associatedTokenProgram?: Address;
    systemProgram: Address;
    instructionSysvar: Address;
}

export interface FlashloanBorrowInstructionArgs {
    amount: number | bigint;
}

function getFlashloanBorrowInstructionDataEncoder(): Encoder<FlashloanBorrowInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

export function createFlashloanBorrowInstruction(
    accounts: FlashloanBorrowInstructionAccounts,
    args: FlashloanBorrowInstructionArgs,
    programId: Address = FLASHLOAN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.flashloanAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.signerBorrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.flashloanTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.flashloanBorrowPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.instructionSysvar, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getFlashloanBorrowInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('67134e18f009873f', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
