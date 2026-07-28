import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getI64Encoder, getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface InstantUpdateTpslInstructionAccounts {
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
    eventAuthority: Address;
    program: Address;
}

export interface InstantUpdateTpslInstructionArgs {
    sizeUsdDelta: number | bigint;
    triggerPrice: number | bigint;
    requestTime: number | bigint;
}

function getInstantUpdateTpslInstructionDataEncoder(): Encoder<InstantUpdateTpslInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['triggerPrice', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

export function createInstantUpdateTpslInstruction(
    accounts: InstantUpdateTpslInstructionAccounts,
    args: InstantUpdateTpslInstructionArgs,
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
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInstantUpdateTpslInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('90e47225a5f26f65', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
