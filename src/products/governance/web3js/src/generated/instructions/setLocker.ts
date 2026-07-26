import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface SetLockerInstructionAccounts {
    governor: Address;
    smartWallet: Address;
}

export interface SetLockerInstructionArgs {
    newLocker: Address;
}

const SetLockerInstructionDataCodec = getStructCodec([
    [
        'newLocker',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createSetLockerInstruction(
    accounts: SetLockerInstructionAccounts,
    args: SetLockerInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: true, isWritable: false },
    ];
    const instructionData = Buffer.from(SetLockerInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('11066548fa179860', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
