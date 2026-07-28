import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    getBooleanEncoder,
    getI64Encoder,
    getStructEncoder,
    getU32Encoder,
    getU8Encoder,
    getUtf8Encoder,
    type Encoder,
} from '@solana/codecs';

export interface CreateMarketResultInstructionAccounts {
    authority: Address;
    marketResult: Address;
    systemProgram: Address;
}

export interface CreateMarketResultInstructionArgs {
    marketId: string;
    outcome: number;
    settlementTime: number | bigint;
    claimsEnabled: boolean;
}

function getCreateMarketResultInstructionDataEncoder(): Encoder<CreateMarketResultInstructionArgs> {
    return getStructEncoder([
        ['marketId', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['outcome', getU8Encoder()],
        ['settlementTime', getI64Encoder()],
        ['claimsEnabled', getBooleanEncoder()],
    ]);
}

export function createCreateMarketResultInstruction(
    accounts: CreateMarketResultInstructionAccounts,
    args: CreateMarketResultInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.marketResult, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getCreateMarketResultInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('3327da09445e8873', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
