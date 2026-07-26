import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { GovernanceParameters, governanceParametersCodec } from '../types/governanceParameters';
import { getStructCodec } from '@solana/codecs';

export interface SetGovernanceParamsInstructionAccounts {
    governor: Address;
    smartWallet: Address;
}

export interface SetGovernanceParamsInstructionArgs {
    params: GovernanceParameters;
}

const SetGovernanceParamsInstructionDataCodec = getStructCodec([['params', governanceParametersCodec]]);

export function createSetGovernanceParamsInstruction(
    accounts: SetGovernanceParamsInstructionAccounts,
    args: SetGovernanceParamsInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: true, isWritable: false },
    ];
    const instructionData = Buffer.from(SetGovernanceParamsInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('afbb034908fb43b2', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
