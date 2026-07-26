import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OrderType, orderTypeCodec } from '../types/orderType';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getOptionCodec,
    getStructCodec,
    getU16Codec,
    getU32Codec,
    getU64Codec,
    getUtf8Codec,
    transformCodec,
} from '@solana/codecs';
import { findOrderAtaPda } from '../pdas/orderAta';
import { findVaultPda } from '../pdas/vault';

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
    contracts: bigint;
    maxFillPriceUsd: bigint;
    depositAmount: bigint;
    orderType: OrderType;
    integrator: Address | null;
    integratorFeeBps: number | null;
}

const CreateOrderInstructionDataCodec = getStructCodec([
    ['externalOrderId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['marketId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['isYes', getBooleanCodec()],
    ['isBuy', getBooleanCodec()],
    ['contracts', getU64Codec()],
    ['maxFillPriceUsd', getU64Codec()],
    ['depositAmount', getU64Codec()],
    ['orderType', orderTypeCodec],
    [
        'integrator',
        getOptionCodec(
            transformCodec(
                fixCodecSize(getBytesCodec(), 32),
                (value: Address) => value.toBytes(),
                value => new Address(value),
            ),
        ),
    ],
    ['integratorFeeBps', getOptionCodec(getU16Codec())],
]);

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
    const instructionData = Buffer.from(CreateOrderInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('8d3625cfedd2fad7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
