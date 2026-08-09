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
import { getNftCollateralDecoder, getNftCollateralEncoder, type NftCollateralArgs } from '../types/nftCollateral';

export const CREATE_NFT_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([2, 36, 83, 39, 177, 98, 126, 75]);

export interface CreateNftPrincipalOfferInstructionAccounts {
    signer: Address;
    signerUser: Address;
    config: Address;
    offer: Address;
    principalMint: Address;
    counteredOffer?: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CreateNftPrincipalOfferInstructionArgs {
    principalAmount: number | bigint;
    apy: number;
    duration: number;
    expiry: number;
    allowExtend: boolean;
    collateral: NftCollateralArgs;
}

function getCreateNftPrincipalOfferInstructionDataEncoder(): Encoder<CreateNftPrincipalOfferInstructionArgs> {
    return getStructEncoder([
        ['principalAmount', getU64Encoder()],
        ['apy', getU32Encoder()],
        ['duration', getU32Encoder()],
        ['expiry', getU32Encoder()],
        ['allowExtend', getBooleanEncoder()],
        ['collateral', getNftCollateralEncoder()],
    ]);
}

function getCreateNftPrincipalOfferInstructionDataDecoder(): Decoder<CreateNftPrincipalOfferInstructionArgs> {
    return getStructDecoder([
        ['principalAmount', getU64Decoder()],
        ['apy', getU32Decoder()],
        ['duration', getU32Decoder()],
        ['expiry', getU32Decoder()],
        ['allowExtend', getBooleanDecoder()],
        ['collateral', getNftCollateralDecoder()],
    ]);
}

export interface ParsedCreateNftPrincipalOfferInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        config: AccountMeta;
        offer: AccountMeta;
        principalMint: AccountMeta;
        counteredOffer: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateNftPrincipalOfferInstructionArgs;
}

export function parseCreateNftPrincipalOfferInstruction(
    instruction: TransactionInstruction,
): ParsedCreateNftPrincipalOfferInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for CreateNftPrincipalOffer instruction');
    }
    if (
        !CREATE_NFT_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateNftPrincipalOffer instruction discriminator mismatch');
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
            counteredOffer: instruction.keys[5]!,
            systemProgram: instruction.keys[6]!,
            eventAuthority: instruction.keys[7]!,
            program: instruction.keys[8]!,
        },
        data: getCreateNftPrincipalOfferInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateNftPrincipalOfferInstruction(
    accounts: CreateNftPrincipalOfferInstructionAccounts,
    args: CreateNftPrincipalOfferInstructionArgs,
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
        accounts.counteredOffer
            ? { pubkey: accounts.counteredOffer, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateNftPrincipalOfferInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_NFT_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
