import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import { getBooleanCodec, getStructCodec, getU16Codec, getU32Codec, getU64Codec } from '@solana/codecs';

export interface SetVaultConfigInstructionAccounts {
    admin: Address;
    vault: Address;
}

export interface SetVaultConfigInstructionArgs {
    globalMaxContracts: bigint;
    positionMaxContracts: bigint;
    positionMaxOrders: number;
    protocolFeeBps: number;
    settlementDelaySeconds: bigint;
    depositsDisabled: boolean;
    withdrawalsDisabled: boolean;
    tradingDisabled: boolean;
}

const SetVaultConfigInstructionDataCodec = getStructCodec([
    ['globalMaxContracts', getU64Codec()],
    ['positionMaxContracts', getU64Codec()],
    ['positionMaxOrders', getU32Codec()],
    ['protocolFeeBps', getU16Codec()],
    ['settlementDelaySeconds', getU64Codec()],
    ['depositsDisabled', getBooleanCodec()],
    ['withdrawalsDisabled', getBooleanCodec()],
    ['tradingDisabled', getBooleanCodec()],
]);

export function createSetVaultConfigInstruction(
    accounts: SetVaultConfigInstructionAccounts,
    args: SetVaultConfigInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(SetVaultConfigInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('4105f888303aebe7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
