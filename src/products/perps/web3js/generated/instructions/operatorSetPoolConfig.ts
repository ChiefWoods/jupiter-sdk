import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getBooleanEncoder, getI64Encoder, getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';
import { getFeesEncoder, type FeesArgs } from '../types/fees';
import { getLimitEncoder, type LimitArgs } from '../types/limit';

export interface OperatorSetPoolConfigInstructionAccounts {
    operator: Address;
    pool: Address;
}

export interface OperatorSetPoolConfigInstructionArgs {
    fees: FeesArgs;
    limit: LimitArgs;
    maxRequestExecutionSec: number | bigint;
    maxTriggerPriceDiffBps: number | bigint;
    disableClosePositionRequest: boolean;
    maxLpTokenPriceChangeBps: number | bigint;
}

function getOperatorSetPoolConfigInstructionDataEncoder(): Encoder<OperatorSetPoolConfigInstructionArgs> {
    return getStructEncoder([
        ['fees', getFeesEncoder()],
        ['limit', getLimitEncoder()],
        ['maxRequestExecutionSec', getI64Encoder()],
        ['maxTriggerPriceDiffBps', getU64Encoder()],
        ['disableClosePositionRequest', getBooleanEncoder()],
        ['maxLpTokenPriceChangeBps', getU64Encoder()],
    ]);
}

export function createOperatorSetPoolConfigInstruction(
    accounts: OperatorSetPoolConfigInstructionAccounts,
    args: OperatorSetPoolConfigInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operator, isSigner: true, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getOperatorSetPoolConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('4cc95012c75cf669', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
