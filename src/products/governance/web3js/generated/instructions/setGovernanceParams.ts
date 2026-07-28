import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERN_PROGRAM_ID } from '..';
import { getGovernanceParametersEncoder, type GovernanceParametersArgs } from '../types/governanceParameters';
import { getStructEncoder, type Encoder } from '@solana/codecs';

export interface SetGovernanceParamsInstructionAccounts {
    governor: Address;
    smartWallet: Address;
}

export interface SetGovernanceParamsInstructionArgs {
    params: GovernanceParametersArgs;
}

function getSetGovernanceParamsInstructionDataEncoder(): Encoder<SetGovernanceParamsInstructionArgs> {
    return getStructEncoder([['params', getGovernanceParametersEncoder()]]);
}

export function createSetGovernanceParamsInstruction(
    accounts: SetGovernanceParamsInstructionAccounts,
    args: SetGovernanceParamsInstructionArgs,
    programId: Address = GOVERN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: true, isWritable: false },
    ];
    const instructionData = Buffer.from(getSetGovernanceParamsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('afbb034908fb43b2', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
