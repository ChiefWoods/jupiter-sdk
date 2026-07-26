import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import {
    fixCodecSize,
    getBytesCodec,
    getOptionCodec,
    getStructCodec,
    getU8Codec,
    transformCodec,
} from '@solana/codecs';

export interface PauseUserInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition: Address;
    userBorrowPosition: Address;
}

export interface PauseUserInstructionArgs {
    protocol: Address;
    supplyMint: Address;
    borrowMint: Address;
    supplyStatus: number | null;
    borrowStatus: number | null;
}

const PauseUserInstructionDataCodec = getStructCodec([
    [
        'protocol',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'supplyMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'borrowMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['supplyStatus', getOptionCodec(getU8Codec())],
    ['borrowStatus', getOptionCodec(getU8Codec())],
]);

export function createPauseUserInstruction(
    accounts: PauseUserInstructionAccounts,
    args: PauseUserInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(PauseUserInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('123f2b5eef35650e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
