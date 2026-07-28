import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';

export interface UpdateRevenueCollectorInstructionAccounts {
    authority: Address;
    liquidity: Address;
}

export interface UpdateRevenueCollectorInstructionArgs {
    revenueCollector: Address;
}

function getUpdateRevenueCollectorInstructionDataEncoder(): Encoder<UpdateRevenueCollectorInstructionArgs> {
    return getStructEncoder([
        [
            'revenueCollector',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
    ]);
}

export function createUpdateRevenueCollectorInstruction(
    accounts: UpdateRevenueCollectorInstructionAccounts,
    args: UpdateRevenueCollectorInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateRevenueCollectorInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a78e7cf0dc718d3b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
