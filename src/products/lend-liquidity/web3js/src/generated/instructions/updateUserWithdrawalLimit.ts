import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, getU128Codec, transformCodec } from '@solana/codecs';

export interface UpdateUserWithdrawalLimitInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition: Address;
}

export interface UpdateUserWithdrawalLimitInstructionArgs {
    newLimit: bigint;
    protocol: Address;
    mint: Address;
}

const UpdateUserWithdrawalLimitInstructionDataCodec = getStructCodec([
    ['newLimit', getU128Codec()],
    [
        'protocol',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createUpdateUserWithdrawalLimitInstruction(
    accounts: UpdateUserWithdrawalLimitInstructionAccounts,
    args: UpdateUserWithdrawalLimitInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateUserWithdrawalLimitInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('a209ba09d51ead4e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
