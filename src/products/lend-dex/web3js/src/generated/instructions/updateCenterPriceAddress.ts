import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, getU32Codec, transformCodec } from '@solana/codecs';

export interface UpdateCenterPriceAddressInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateCenterPriceAddressInstructionArgs {
    centerPriceAddress: Address;
    percent: number;
    time: number;
}

const UpdateCenterPriceAddressInstructionDataCodec = getStructCodec([
    [
        'centerPriceAddress',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['percent', getU32Codec()],
    ['time', getU32Codec()],
]);

export function createUpdateCenterPriceAddressInstruction(
    accounts: UpdateCenterPriceAddressInstructionAccounts,
    args: UpdateCenterPriceAddressInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateCenterPriceAddressInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('2d6e6027c9fa8e01', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
