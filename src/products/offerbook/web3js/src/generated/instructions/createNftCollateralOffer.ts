import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { NftCollateralAsset, nftCollateralAssetCodec } from '../types/nftCollateralAsset';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findOfferPda } from '../pdas/offer';
import { getStructCodec, getU32Codec, getU64Codec } from '@solana/codecs';

export interface CreateNftCollateralOfferInstructionAccounts {
    signer: Address;
    signerUser: Address;
    config: Address;
    offer?: Address;
    principalMint: Address;
    counteredOffer?: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CreateNftCollateralOfferInstructionArgs {
    principalAmount: bigint;
    apy: number;
    duration: number;
    expiry: number;
    collateral: NftCollateralAsset;
}

const CreateNftCollateralOfferInstructionDataCodec = getStructCodec([
    ['principalAmount', getU64Codec()],
    ['apy', getU32Codec()],
    ['duration', getU32Codec()],
    ['expiry', getU32Codec()],
    ['collateral', nftCollateralAssetCodec],
]);

export async function createCreateNftCollateralOfferInstruction(
    accounts: CreateNftCollateralOfferInstructionAccounts,
    args: CreateNftCollateralOfferInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let offer = accounts.offer;
    if (!offer) {
        const [derived] = await findOfferPda(
            {
                signer: accounts.signer,
                signerUser: accounts.signerUser,
            },
            programId,
        );
        offer = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: offer, isSigner: false, isWritable: true },
        { pubkey: accounts.principalMint, isSigner: false, isWritable: false },
        accounts.counteredOffer
            ? { pubkey: accounts.counteredOffer, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(CreateNftCollateralOfferInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('302234bd510ba908', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
