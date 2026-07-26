import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface UpdateExchangePriceInstructionAccounts {
    tokenReserve: Address;
    rateModel: Address;
}

export interface UpdateExchangePriceInstructionArgs {
    mint: Address;
}

const UpdateExchangePriceInstructionDataCodec = getStructCodec([
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createUpdateExchangePriceInstruction(
    accounts: UpdateExchangePriceInstructionAccounts,
    args: UpdateExchangePriceInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(UpdateExchangePriceInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('eff40af874193596', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
