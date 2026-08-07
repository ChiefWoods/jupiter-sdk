import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    fixDecoderSize,
    fixEncoderSize,
    getBooleanDecoder,
    getBooleanEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import { findOrderAtaPda } from '../pdas/orderAta';
import { findVaultPda } from '../pdas/vault';
import { getOrderTypeDecoder, getOrderTypeEncoder, type OrderTypeArgs } from '../types/orderType';

export const CREATE_ORDER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([141, 54, 37, 207, 237, 210, 250, 215]);

export interface CreateOrderInstructionAccounts {
    payer: Address;
    owner: Address;
    authority: Address;
    vault?: Address;
    position: Address;
    order: Address;
    ownerTokenAccount: Address;
    settlementMint: Address;
    orderAta?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export interface CreateOrderInstructionArgs {
    externalOrderId: string;
    marketId: string;
    isYes: boolean;
    isBuy: boolean;
    contracts: number | bigint;
    maxFillPriceUsd: number | bigint;
    depositAmount: number | bigint;
    orderType: OrderTypeArgs;
    integrator: OptionOrNullable<Address>;
    integratorFeeBps: OptionOrNullable<number>;
}

function getCreateOrderInstructionDataEncoder(): Encoder<CreateOrderInstructionArgs> {
    return getStructEncoder([
        ['externalOrderId', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['marketId', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['isYes', getBooleanEncoder()],
        ['isBuy', getBooleanEncoder()],
        ['contracts', getU64Encoder()],
        ['maxFillPriceUsd', getU64Encoder()],
        ['depositAmount', getU64Encoder()],
        ['orderType', getOrderTypeEncoder()],
        [
            'integrator',
            getOptionEncoder(
                transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
            ),
        ],
        ['integratorFeeBps', getOptionEncoder(getU16Encoder())],
    ]);
}

function getCreateOrderInstructionDataDecoder(): Decoder<CreateOrderInstructionArgs> {
    return getStructDecoder([
        ['externalOrderId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['isYes', getBooleanDecoder()],
        ['isBuy', getBooleanDecoder()],
        ['contracts', getU64Decoder()],
        ['maxFillPriceUsd', getU64Decoder()],
        ['depositAmount', getU64Decoder()],
        ['orderType', getOrderTypeDecoder()],
        [
            'integrator',
            getOptionDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
        ],
        ['integratorFeeBps', getOptionDecoder(getU16Decoder())],
    ]);
}

export interface ParsedCreateOrderInstruction {
    programId: Address;
    accounts: {
        payer: AccountMeta;
        owner: AccountMeta;
        authority: AccountMeta;
        vault: AccountMeta;
        position: AccountMeta;
        order: AccountMeta;
        ownerTokenAccount: AccountMeta;
        settlementMint: AccountMeta;
        orderAta: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: CreateOrderInstructionArgs;
}

export function parseCreateOrderInstruction(instruction: TransactionInstruction): ParsedCreateOrderInstruction {
    if (instruction.keys.length < 12) {
        throw new Error('Expected 12 account metas for CreateOrder instruction');
    }
    if (!CREATE_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateOrder instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            payer: instruction.keys[0]!,
            owner: instruction.keys[1]!,
            authority: instruction.keys[2]!,
            vault: instruction.keys[3]!,
            position: instruction.keys[4]!,
            order: instruction.keys[5]!,
            ownerTokenAccount: instruction.keys[6]!,
            settlementMint: instruction.keys[7]!,
            orderAta: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
            associatedTokenProgram: instruction.keys[10]!,
            systemProgram: instruction.keys[11]!,
        },
        data: getCreateOrderInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateOrderInstruction(
    accounts: CreateOrderInstructionAccounts,
    args: CreateOrderInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vault = accounts.vault;
    if (!vault) {
        const [derived] = await findVaultPda(
            {
                settlementMint: accounts.settlementMint,
            },
            programId,
        );
        vault = derived;
    }
    let orderAta = accounts.orderAta;
    if (!orderAta) {
        const [derived] = await findOrderAtaPda({
            order: accounts.order,
            settlementMint: accounts.settlementMint,
        });
        orderAta = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: vault, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.order, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.settlementMint, isSigner: false, isWritable: false },
        { pubkey: orderAta, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateOrderInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_ORDER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
