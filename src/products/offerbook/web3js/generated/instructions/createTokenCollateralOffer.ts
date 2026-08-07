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

export const CREATE_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    38, 75, 182, 254, 173, 13, 240, 41,
]);

export interface CreateTokenCollateralOfferInstructionAccounts {
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

export interface CreateTokenCollateralOfferInstructionArgs {
    principalAmount: number | bigint;
    collateralAmount: number | bigint;
    apy: number;
    duration: number;
    expiry: number;
    allowPartialFill: boolean;
    minFillAmount: number | bigint;
}

function getCreateTokenCollateralOfferInstructionDataEncoder(): Encoder<CreateTokenCollateralOfferInstructionArgs> {
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

function getCreateTokenCollateralOfferInstructionDataDecoder(): Decoder<CreateTokenCollateralOfferInstructionArgs> {
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

export interface ParsedCreateTokenCollateralOfferInstruction {
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
    data: CreateTokenCollateralOfferInstructionArgs;
}

export function parseCreateTokenCollateralOfferInstruction(
    instruction: TransactionInstruction,
): ParsedCreateTokenCollateralOfferInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for CreateTokenCollateralOffer instruction');
    }
    if (
        !CREATE_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateTokenCollateralOffer instruction discriminator mismatch');
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
        data: getCreateTokenCollateralOfferInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateTokenCollateralOfferInstruction(
    accounts: CreateTokenCollateralOfferInstructionAccounts,
    args: CreateTokenCollateralOfferInstructionArgs,
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
    let data = Buffer.from(getCreateTokenCollateralOfferInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
