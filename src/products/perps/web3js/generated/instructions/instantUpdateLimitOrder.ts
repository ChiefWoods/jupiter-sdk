import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getI64Encoder, getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface InstantUpdateLimitOrderInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
    owner: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
}

export interface InstantUpdateLimitOrderInstructionArgs {
    sizeUsdDelta: number | bigint;
    triggerPrice: number | bigint;
    requestTime: number | bigint;
}

function getInstantUpdateLimitOrderInstructionDataEncoder(): Encoder<InstantUpdateLimitOrderInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['triggerPrice', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

export function createInstantUpdateLimitOrderInstruction(
    accounts: InstantUpdateLimitOrderInstructionAccounts,
    args: InstantUpdateLimitOrderInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInstantUpdateLimitOrderInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('88f5e53a798d0ccf', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
