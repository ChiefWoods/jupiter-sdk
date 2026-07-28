import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getBooleanEncoder, getStructEncoder, getU32Encoder, getU64Encoder, type Encoder } from '@solana/codecs';

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
    const instructionData = Buffer.from(getCreateTokenCollateralOfferInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('264bb6fead0df029', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
