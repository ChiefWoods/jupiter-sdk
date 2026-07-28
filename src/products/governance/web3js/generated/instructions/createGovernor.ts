import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';
import { getGovernanceParametersEncoder, type GovernanceParametersArgs } from '../types/governanceParameters';

export interface CreateGovernorInstructionAccounts {
    base: Address;
    governor: Address;
    smartWallet: Address;
    payer: Address;
    systemProgram: Address;
}

export interface CreateGovernorInstructionArgs {
    locker: Address;
    params: GovernanceParametersArgs;
}

function getCreateGovernorInstructionDataEncoder(): Encoder<CreateGovernorInstructionArgs> {
    return getStructEncoder([
        ['locker', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['params', getGovernanceParametersEncoder()],
    ]);
}

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
    const instructionData = Buffer.from(getCreateGovernorInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('671e4efc1c802803', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
