import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPITER_PROGRAM_ID } from '..';
import { getBooleanEncoder, getStructEncoder, getU8Encoder, type Encoder } from '@solana/codecs';

export interface CloseTokenInstructionAccounts {
    operator: Address;
    wallet: Address;
    programAuthority: Address;
    programTokenAccount: Address;
    mint: Address;
    tokenProgram: Address;
}

export interface CloseTokenInstructionArgs {
    id: number;
    burnAll: boolean;
}

function getCloseTokenInstructionDataEncoder(): Encoder<CloseTokenInstructionArgs> {
    return getStructEncoder([
        ['id', getU8Encoder()],
        ['burnAll', getBooleanEncoder()],
    ]);
}

export function createCloseTokenInstruction(
    accounts: CloseTokenInstructionAccounts,
    args: CloseTokenInstructionArgs,
    programId: Address = JUPITER_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operator, isSigner: true, isWritable: false },
        { pubkey: accounts.wallet, isSigner: false, isWritable: true },
        { pubkey: accounts.programAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.programTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getCloseTokenInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('1a4aec976840b7f9', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
