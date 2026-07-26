import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface UnpauseTokenInstructionAccounts {
    authority: Address;
    authList: Address;
    tokenReserve: Address;
}

export interface UnpauseTokenInstructionArgs {
    mint: Address;
}

const UnpauseTokenInstructionDataCodec = getStructCodec([
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createUnpauseTokenInstruction(
    accounts: UnpauseTokenInstructionAccounts,
    args: UnpauseTokenInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UnpauseTokenInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('6c753e1ec85cffca', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
