import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import {
    getBooleanEncoder,
    getStructEncoder,
    getU16Encoder,
    getU32Encoder,
    getU64Encoder,
    type Encoder,
} from '@solana/codecs';

export interface SetVaultConfigInstructionAccounts {
    admin: Address;
    vault: Address;
}

export interface SetVaultConfigInstructionArgs {
    globalMaxContracts: number | bigint;
    positionMaxContracts: number | bigint;
    positionMaxOrders: number;
    protocolFeeBps: number;
    settlementDelaySeconds: number | bigint;
    depositsDisabled: boolean;
    withdrawalsDisabled: boolean;
    tradingDisabled: boolean;
}

function getSetVaultConfigInstructionDataEncoder(): Encoder<SetVaultConfigInstructionArgs> {
    return getStructEncoder([
        ['globalMaxContracts', getU64Encoder()],
        ['positionMaxContracts', getU64Encoder()],
        ['positionMaxOrders', getU32Encoder()],
        ['protocolFeeBps', getU16Encoder()],
        ['settlementDelaySeconds', getU64Encoder()],
        ['depositsDisabled', getBooleanEncoder()],
        ['withdrawalsDisabled', getBooleanEncoder()],
        ['tradingDisabled', getBooleanEncoder()],
    ]);
}

export function createSetVaultConfigInstruction(
    accounts: SetVaultConfigInstructionAccounts,
    args: SetVaultConfigInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getSetVaultConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('4105f888303aebe7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
