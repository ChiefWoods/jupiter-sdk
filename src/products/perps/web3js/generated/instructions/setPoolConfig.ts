import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getBooleanEncoder, getI64Encoder, getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';
import { getFeesEncoder, type FeesArgs } from '../types/fees';
import { getLimitEncoder, type LimitArgs } from '../types/limit';
import { getSecp256k1PubkeyEncoder, type Secp256k1PubkeyArgs } from '../types/secp256k1Pubkey';

export interface SetPoolConfigInstructionAccounts {
    admin: Address;
    perpetuals: Address;
    pool: Address;
}

export interface SetPoolConfigInstructionArgs {
    fees: FeesArgs;
    limit: LimitArgs;
    maxRequestExecutionSec: number | bigint;
    parameterUpdateOracle: Secp256k1PubkeyArgs;
    maxTriggerPriceDiffBps: number | bigint;
    disableClosePositionRequest: boolean;
    maxLpTokenPriceChangeBps: number | bigint;
}

function getSetPoolConfigInstructionDataEncoder(): Encoder<SetPoolConfigInstructionArgs> {
    return getStructEncoder([
        ['fees', getFeesEncoder()],
        ['limit', getLimitEncoder()],
        ['maxRequestExecutionSec', getI64Encoder()],
        ['parameterUpdateOracle', getSecp256k1PubkeyEncoder()],
        ['maxTriggerPriceDiffBps', getU64Encoder()],
        ['disableClosePositionRequest', getBooleanEncoder()],
        ['maxLpTokenPriceChangeBps', getU64Encoder()],
    ]);
}

export function createSetPoolConfigInstruction(
    accounts: SetPoolConfigInstructionAccounts,
    args: SetPoolConfigInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getSetPoolConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('d857417d716eb978', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
