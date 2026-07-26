import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getBooleanCodec, getStructCodec, getU32Codec, getU64Codec } from '@solana/codecs';

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
    principalAmount: bigint;
    collateralAmount: bigint;
    apy: number;
    duration: number;
    expiry: number;
    allowPartialFill: boolean;
    minFillAmount: bigint;
}

const CreateTokenCollateralOfferInstructionDataCodec = getStructCodec([
    ['principalAmount', getU64Codec()],
    ['collateralAmount', getU64Codec()],
    ['apy', getU32Codec()],
    ['duration', getU32Codec()],
    ['expiry', getU32Codec()],
    ['allowPartialFill', getBooleanCodec()],
    ['minFillAmount', getU64Codec()],
]);

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
    const instructionData = Buffer.from(CreateTokenCollateralOfferInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('264bb6fead0df029', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
