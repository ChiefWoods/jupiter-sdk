import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';

export interface CloseClaimAccountInstructionAccounts {
    user: Address;
    claimAccount: Address;
    systemProgram: Address;
}

export interface CloseClaimAccountInstructionArgs {
    mint: Address;
}

function getCloseClaimAccountInstructionDataEncoder(): Encoder<CloseClaimAccountInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function createCloseClaimAccountInstruction(
    accounts: CloseClaimAccountInstructionAccounts,
    args: CloseClaimAccountInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.claimAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getCloseClaimAccountInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('f192cbd83ade5b76', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
