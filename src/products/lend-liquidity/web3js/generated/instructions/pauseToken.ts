import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';

export interface PauseTokenInstructionAccounts {
    authority: Address;
    authList: Address;
    tokenReserve: Address;
}

export interface PauseTokenInstructionArgs {
    mint: Address;
}

function getPauseTokenInstructionDataEncoder(): Encoder<PauseTokenInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function createPauseTokenInstruction(
    accounts: PauseTokenInstructionAccounts,
    args: PauseTokenInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getPauseTokenInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('e29648d39f33e227', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
