import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { addEncoderSizePrefix, getStructEncoder, getU32Encoder, getUtf8Encoder, type Encoder } from '@solana/codecs';

export interface CreateTokenMetadataInstructionAccounts {
    admin: Address;
    perpetuals: Address;
    pool: Address;
    transferAuthority: Address;
    metadata: Address;
    lpTokenMint: Address;
    tokenMetadataProgram: Address;
    systemProgram: Address;
    rent: Address;
}

export interface CreateTokenMetadataInstructionArgs {
    name: string;
    symbol: string;
    uri: string;
}

function getCreateTokenMetadataInstructionDataEncoder(): Encoder<CreateTokenMetadataInstructionArgs> {
    return getStructEncoder([
        ['name', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['symbol', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['uri', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ]);
}

export function createCreateTokenMetadataInstruction(
    accounts: CreateTokenMetadataInstructionAccounts,
    args: CreateTokenMetadataInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.metadata, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenMetadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getCreateTokenMetadataInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('dd50b02599bca044', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
