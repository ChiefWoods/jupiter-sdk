import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { GovernanceParameters, governanceParametersCodec } from '../types/governanceParameters';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface CreateGovernorInstructionAccounts {
    base: Address;
    governor: Address;
    smartWallet: Address;
    payer: Address;
    systemProgram: Address;
}

export interface CreateGovernorInstructionArgs {
    locker: Address;
    params: GovernanceParameters;
}

const CreateGovernorInstructionDataCodec = getStructCodec([
    [
        'locker',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['params', governanceParametersCodec],
]);

export function createCreateGovernorInstruction(
    accounts: CreateGovernorInstructionAccounts,
    args: CreateGovernorInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.base, isSigner: true, isWritable: false },
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: false, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(CreateGovernorInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('671e4efc1c802803', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
