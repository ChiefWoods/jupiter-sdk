import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import {
    fixEncoderSize,
    getBytesEncoder,
    getStructEncoder,
    getU32Encoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';

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

function getUpdateCenterPriceAddressInstructionDataEncoder(): Encoder<UpdateCenterPriceAddressInstructionArgs> {
    return getStructEncoder([
        [
            'centerPriceAddress',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
        ['percent', getU32Encoder()],
        ['time', getU32Encoder()],
    ]);
}

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
    const instructionData = Buffer.from(getUpdateCenterPriceAddressInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('2d6e6027c9fa8e01', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
