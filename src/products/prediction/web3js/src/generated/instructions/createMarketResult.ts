import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import {
    addCodecSizePrefix,
    getBooleanCodec,
    getI64Codec,
    getStructCodec,
    getU32Codec,
    getU8Codec,
    getUtf8Codec,
} from '@solana/codecs';

export interface CreateMarketResultInstructionAccounts {
    authority: Address;
    marketResult: Address;
    systemProgram: Address;
}

export interface CreateMarketResultInstructionArgs {
    marketId: string;
    outcome: number;
    settlementTime: bigint;
    claimsEnabled: boolean;
}

const CreateMarketResultInstructionDataCodec = getStructCodec([
    ['marketId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['outcome', getU8Codec()],
    ['settlementTime', getI64Codec()],
    ['claimsEnabled', getBooleanCodec()],
]);

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
    const instructionData = Buffer.from(CreateMarketResultInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('3327da09445e8873', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
