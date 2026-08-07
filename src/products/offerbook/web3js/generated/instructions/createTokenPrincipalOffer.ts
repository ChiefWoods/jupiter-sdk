import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CREATE_TOKEN_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    78, 9, 69, 142, 189, 64, 171, 13,
]);

export interface CreateTokenPrincipalOfferInstructionAccounts {
    signer: Address;
    signerUser: Address;
    config: Address;
    offer: Address;
    principalMint: Address;
    collateralMint: Address;
    counteredOffer?: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CreateTokenPrincipalOfferInstructionArgs {
    principalAmount: number | bigint;
    collateralAmount: number | bigint;
    apy: number;
    duration: number;
    expiry: number;
    allowPartialFill: boolean;
    minFillAmount: number | bigint;
}

function getCreateTokenPrincipalOfferInstructionDataEncoder(): Encoder<CreateTokenPrincipalOfferInstructionArgs> {
    return getStructEncoder([
        ['principalAmount', getU64Encoder()],
        ['collateralAmount', getU64Encoder()],
        ['apy', getU32Encoder()],
        ['duration', getU32Encoder()],
        ['expiry', getU32Encoder()],
        ['allowPartialFill', getBooleanEncoder()],
        ['minFillAmount', getU64Encoder()],
    ]);
}

function getCreateTokenPrincipalOfferInstructionDataDecoder(): Decoder<CreateTokenPrincipalOfferInstructionArgs> {
    return getStructDecoder([
        ['principalAmount', getU64Decoder()],
        ['collateralAmount', getU64Decoder()],
        ['apy', getU32Decoder()],
        ['duration', getU32Decoder()],
        ['expiry', getU32Decoder()],
        ['allowPartialFill', getBooleanDecoder()],
        ['minFillAmount', getU64Decoder()],
    ]);
}

export interface ParsedCreateTokenPrincipalOfferInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        config: AccountMeta;
        offer: AccountMeta;
        principalMint: AccountMeta;
        collateralMint: AccountMeta;
        counteredOffer: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateTokenPrincipalOfferInstructionArgs;
}

export function parseCreateTokenPrincipalOfferInstruction(
    instruction: TransactionInstruction,
): ParsedCreateTokenPrincipalOfferInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for CreateTokenPrincipalOffer instruction');
    }
    if (
        !CREATE_TOKEN_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateTokenPrincipalOffer instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerUser: instruction.keys[1]!,
            config: instruction.keys[2]!,
            offer: instruction.keys[3]!,
            principalMint: instruction.keys[4]!,
            collateralMint: instruction.keys[5]!,
            counteredOffer: instruction.keys[6]!,
            systemProgram: instruction.keys[7]!,
            eventAuthority: instruction.keys[8]!,
            program: instruction.keys[9]!,
        },
        data: getCreateTokenPrincipalOfferInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateTokenPrincipalOfferInstruction(
    accounts: CreateTokenPrincipalOfferInstructionAccounts,
    args: CreateTokenPrincipalOfferInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.offer, isSigner: false, isWritable: true },
        { pubkey: accounts.principalMint, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralMint, isSigner: false, isWritable: false },
        accounts.counteredOffer
            ? { pubkey: accounts.counteredOffer, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateTokenPrincipalOfferInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_TOKEN_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
