import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';

export interface UpdateAuthorityInstructionAccounts {
    authority: Address;
    oracleAdmin: Address;
}

export interface UpdateAuthorityInstructionArgs {
    newAuthority: Address;
}

function getUpdateAuthorityInstructionDataEncoder(): Encoder<UpdateAuthorityInstructionArgs> {
    return getStructEncoder([
        ['newAuthority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function createUpdateAuthorityInstruction(
    accounts: UpdateAuthorityInstructionAccounts,
    args: UpdateAuthorityInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateAuthorityInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('202e401c954bf358', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
