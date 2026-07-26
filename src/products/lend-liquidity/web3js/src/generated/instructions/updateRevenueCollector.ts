import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface UpdateRevenueCollectorInstructionAccounts {
    authority: Address;
    liquidity: Address;
}

export interface UpdateRevenueCollectorInstructionArgs {
    revenueCollector: Address;
}

const UpdateRevenueCollectorInstructionDataCodec = getStructCodec([
    [
        'revenueCollector',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createUpdateRevenueCollectorInstruction(
    accounts: UpdateRevenueCollectorInstructionAccounts,
    args: UpdateRevenueCollectorInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateRevenueCollectorInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('a78e7cf0dc718d3b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
