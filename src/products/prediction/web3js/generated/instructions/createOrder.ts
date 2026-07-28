import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    fixEncoderSize,
    getBooleanEncoder,
    getBytesEncoder,
    getOptionEncoder,
    getStructEncoder,
    getU16Encoder,
    getU32Encoder,
    getU64Encoder,
    getUtf8Encoder,
    transformEncoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import { findOrderAtaPda } from '../pdas/orderAta';
import { findVaultPda } from '../pdas/vault';
import { getOrderTypeEncoder, type OrderTypeArgs } from '../types/orderType';

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

export async function createCreateOrderInstruction(
    accounts: CreateOrderInstructionAccounts,
    args: CreateOrderInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
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
        const [derived] = await findOrderAtaPda(
            {
                order: accounts.order,
                settlementMint: accounts.settlementMint,
            },
            programId,
        );
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
    const instructionData = Buffer.from(getCreateOrderInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('8d3625cfedd2fad7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
