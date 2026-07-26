import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface UpdateRebalancerInstructionAccounts {
    signer: Address;
    lendingAdmin: Address;
}

export interface UpdateRebalancerInstructionArgs {
    newRebalancer: Address;
}

const UpdateRebalancerInstructionDataCodec = getStructCodec([
    [
        'newRebalancer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createUpdateRebalancerInstruction(
    accounts: UpdateRebalancerInstructionAccounts,
    args: UpdateRebalancerInstructionArgs,
    programId: Address = LENDING_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateRebalancerInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('cebb36e49108cb6f', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
