import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPITER_PROGRAM_ID } from '..';
import { getStructEncoder, getU8Encoder, type Encoder } from '@solana/codecs';

export interface CreateTokenAccountInstructionAccounts {
    tokenAccount: Address;
    user: Address;
    mint: Address;
    tokenProgram: Address;
    systemProgram: Address;
}

export interface CreateTokenAccountInstructionArgs {
    bump: number;
}

function getCreateTokenAccountInstructionDataEncoder(): Encoder<CreateTokenAccountInstructionArgs> {
    return getStructEncoder([['bump', getU8Encoder()]]);
}

export function createCreateTokenAccountInstruction(
    accounts: CreateTokenAccountInstructionAccounts,
    args: CreateTokenAccountInstructionArgs,
    programId: Address = JUPITER_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getCreateTokenAccountInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('93f17b64f484ae76', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
