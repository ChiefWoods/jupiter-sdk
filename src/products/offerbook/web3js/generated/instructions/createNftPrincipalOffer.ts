import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getNftCollateralEncoder, type NftCollateralArgs } from '../types/nftCollateral';
import { getStructEncoder, getU32Encoder, getU64Encoder, type Encoder } from '@solana/codecs';

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
    collateral: NftCollateralArgs;
}

function getCreateNftPrincipalOfferInstructionDataEncoder(): Encoder<CreateNftPrincipalOfferInstructionArgs> {
    return getStructEncoder([
        ['principalAmount', getU64Encoder()],
        ['apy', getU32Encoder()],
        ['duration', getU32Encoder()],
        ['expiry', getU32Encoder()],
        ['collateral', getNftCollateralEncoder()],
    ]);
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
    const instructionData = Buffer.from(getCreateNftPrincipalOfferInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('02245327b1627e4b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
