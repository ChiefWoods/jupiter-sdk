import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { NftCollateral, nftCollateralCodec } from '../types/nftCollateral';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getStructCodec, getU32Codec, getU64Codec } from '@solana/codecs';

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
    principalAmount: bigint;
    apy: number;
    duration: number;
    expiry: number;
    collateral: NftCollateral;
}

const CreateNftPrincipalOfferInstructionDataCodec = getStructCodec([
    ['principalAmount', getU64Codec()],
    ['apy', getU32Codec()],
    ['duration', getU32Codec()],
    ['expiry', getU32Codec()],
    ['collateral', nftCollateralCodec],
]);

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
    const instructionData = Buffer.from(CreateNftPrincipalOfferInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('02245327b1627e4b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
