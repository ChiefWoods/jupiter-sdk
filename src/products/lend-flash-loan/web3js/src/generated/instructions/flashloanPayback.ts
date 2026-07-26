import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { FLASHLOAN_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface FlashloanPaybackInstructionAccounts {
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

export interface FlashloanPaybackInstructionArgs {
    amount: bigint;
}

const FlashloanPaybackInstructionDataCodec = getStructCodec([['amount', getU64Codec()]]);

export function createFlashloanPaybackInstruction(
    accounts: FlashloanPaybackInstructionAccounts,
    args: FlashloanPaybackInstructionArgs,
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
    const instructionData = Buffer.from(FlashloanPaybackInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('d52f998954f35ee8', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
