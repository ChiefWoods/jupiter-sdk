import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getNftCollateralAssetEncoder, type NftCollateralAssetArgs } from '../types/nftCollateralAsset';
import { getStructEncoder, getU32Encoder, getU64Encoder, type Encoder } from '@solana/codecs';

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
    const instructionData = Buffer.from(getCreateNftCollateralOfferInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('302234bd510ba908', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
