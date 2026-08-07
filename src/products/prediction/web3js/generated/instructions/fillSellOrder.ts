import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';

export const FILL_SELL_ORDER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([251, 169, 25, 71, 13, 120, 20, 126]);

export interface FillSellOrderInstructionAccounts {
    authority: Address;
    secondaryAuthority: Address;
    owner: Address;
    vault: Address;
    position: Address;
    order: Address;
    vaultTokenAccount: Address;
    orderAta: Address;
    integratorTokenAccount?: Address;
    tokenProgram: Address;
}

export interface FillSellOrderInstructionArgs {
    filledContracts: number | bigint;
    grossProceedsUsd: number | bigint;
    venueFeeUsd: number | bigint;
    orderId: OptionOrNullable<string>;
}

function getFillSellOrderInstructionDataEncoder(): Encoder<FillSellOrderInstructionArgs> {
    return getStructEncoder([
        ['filledContracts', getU64Encoder()],
        ['grossProceedsUsd', getU64Encoder()],
        ['venueFeeUsd', getU64Encoder()],
        ['orderId', getOptionEncoder(addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder()))],
    ]);
}

function getFillSellOrderInstructionDataDecoder(): Decoder<FillSellOrderInstructionArgs> {
    return getStructDecoder([
        ['filledContracts', getU64Decoder()],
        ['grossProceedsUsd', getU64Decoder()],
        ['venueFeeUsd', getU64Decoder()],
        ['orderId', getOptionDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
    ]);
}

export interface ParsedFillSellOrderInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        secondaryAuthority: AccountMeta;
        owner: AccountMeta;
        vault: AccountMeta;
        position: AccountMeta;
        order: AccountMeta;
        vaultTokenAccount: AccountMeta;
        orderAta: AccountMeta;
        integratorTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: FillSellOrderInstructionArgs;
}

export function parseFillSellOrderInstruction(instruction: TransactionInstruction): ParsedFillSellOrderInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for FillSellOrder instruction');
    }
    if (!FILL_SELL_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('FillSellOrder instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            secondaryAuthority: instruction.keys[1]!,
            owner: instruction.keys[2]!,
            vault: instruction.keys[3]!,
            position: instruction.keys[4]!,
            order: instruction.keys[5]!,
            vaultTokenAccount: instruction.keys[6]!,
            orderAta: instruction.keys[7]!,
            integratorTokenAccount: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
        },
        data: getFillSellOrderInstructionDataDecoder().decode(instructionData),
    };
}

export function createFillSellOrderInstruction(
    accounts: FillSellOrderInstructionAccounts,
    args: FillSellOrderInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.secondaryAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.order, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.orderAta, isSigner: false, isWritable: true },
        accounts.integratorTokenAccount
            ? { pubkey: accounts.integratorTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getFillSellOrderInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(FILL_SELL_ORDER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
