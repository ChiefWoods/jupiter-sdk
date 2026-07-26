import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface SetRewardsRateModelInstructionAccounts {
    signer: Address;
    lendingAdmin: Address;
    lending: Address;
    fTokenMint: Address;
    newRewardsRateModel: Address;
    supplyTokenReservesLiquidity: Address;
}

export interface SetRewardsRateModelInstructionArgs {
    mint: Address;
}

const SetRewardsRateModelInstructionDataCodec = getStructCodec([
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createSetRewardsRateModelInstruction(
    accounts: SetRewardsRateModelInstructionAccounts,
    args: SetRewardsRateModelInstructionArgs,
    programId: Address = LENDING_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lending, isSigner: false, isWritable: true },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.newRewardsRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(SetRewardsRateModelInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('aee774cb083a8fcb', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
