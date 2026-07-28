import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getBooleanEncoder, getI64Encoder, getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';
import { getSideEncoder, type SideArgs } from '../types/side';

export interface InstantCreateLimitOrderInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
    owner: Address;
    fundingAccount: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    collateralCustody: Address;
    inputMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantCreateLimitOrderInstructionArgs {
    sizeUsdDelta: number | bigint;
    collateralTokenDelta: number | bigint;
    side: SideArgs;
    triggerPrice: number | bigint;
    triggerAboveThreshold: boolean;
    counter: number | bigint;
    requestTime: number | bigint;
}

function getInstantCreateLimitOrderInstructionDataEncoder(): Encoder<InstantCreateLimitOrderInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['collateralTokenDelta', getU64Encoder()],
        ['side', getSideEncoder()],
        ['triggerPrice', getU64Encoder()],
        ['triggerAboveThreshold', getBooleanEncoder()],
        ['counter', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

export function createInstantCreateLimitOrderInstruction(
    accounts: InstantCreateLimitOrderInstructionAccounts,
    args: InstantCreateLimitOrderInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: false },
        { pubkey: accounts.inputMint, isSigner: false, isWritable: false },
        accounts.referral
            ? { pubkey: accounts.referral, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInstantCreateLimitOrderInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('c225c37b287f7e9c', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
