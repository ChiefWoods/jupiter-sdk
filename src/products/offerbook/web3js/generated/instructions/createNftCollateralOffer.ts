import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getNftCollateralAssetDecoder,
    getNftCollateralAssetEncoder,
    type NftCollateralAssetArgs,
} from '../types/nftCollateralAsset';
import {
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CREATE_NFT_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([48, 34, 52, 189, 81, 11, 169, 8]);

export interface CreateNftCollateralOfferInstructionAccounts {
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

export interface CreateNftCollateralOfferInstructionArgs {
    principalAmount: number | bigint;
    apy: number;
    duration: number;
    expiry: number;
    collateral: NftCollateralAssetArgs;
}

function getCreateNftCollateralOfferInstructionDataEncoder(): Encoder<CreateNftCollateralOfferInstructionArgs> {
    return getStructEncoder([
        ['principalAmount', getU64Encoder()],
        ['apy', getU32Encoder()],
        ['duration', getU32Encoder()],
        ['expiry', getU32Encoder()],
        ['collateral', getNftCollateralAssetEncoder()],
    ]);
}

function getCreateNftCollateralOfferInstructionDataDecoder(): Decoder<CreateNftCollateralOfferInstructionArgs> {
    return getStructDecoder([
        ['principalAmount', getU64Decoder()],
        ['apy', getU32Decoder()],
        ['duration', getU32Decoder()],
        ['expiry', getU32Decoder()],
        ['collateral', getNftCollateralAssetDecoder()],
    ]);
}

export interface ParsedCreateNftCollateralOfferInstruction {
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
    data: CreateNftCollateralOfferInstructionArgs;
}

export function parseCreateNftCollateralOfferInstruction(
    instruction: TransactionInstruction,
): ParsedCreateNftCollateralOfferInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for CreateNftCollateralOffer instruction');
    }
    if (
        !CREATE_NFT_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateNftCollateralOffer instruction discriminator mismatch');
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
        data: getCreateNftCollateralOfferInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateNftCollateralOfferInstruction(
    accounts: CreateNftCollateralOfferInstructionAccounts,
    args: CreateNftCollateralOfferInstructionArgs,
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
    let data = Buffer.from(getCreateNftCollateralOfferInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_NFT_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
