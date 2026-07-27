import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getOptionEncoder, getStructEncoder, getU64Encoder, type Encoder, type OptionOrNullable } from '@solana/codecs';
import { getSideEncoder, type SideArgs } from '../types/side';

export interface CreateIncreasePositionMarketRequestInstructionAccounts {
    owner: Address;
    fundingAccount: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    custody: Address;
    collateralCustody: Address;
    inputMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface CreateIncreasePositionMarketRequestInstructionArgs {
    sizeUsdDelta: number | bigint;
    collateralTokenDelta: number | bigint;
    side: SideArgs;
    priceSlippage: number | bigint;
    jupiterMinimumOut: OptionOrNullable<number | bigint>;
    counter: number | bigint;
}

function getCreateIncreasePositionMarketRequestInstructionDataEncoder(): Encoder<CreateIncreasePositionMarketRequestInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['collateralTokenDelta', getU64Encoder()],
        ['side', getSideEncoder()],
        ['priceSlippage', getU64Encoder()],
        ['jupiterMinimumOut', getOptionEncoder(getU64Encoder())],
        ['counter', getU64Encoder()],
    ]);
}

export function createCreateIncreasePositionMarketRequestInstruction(
    accounts: CreateIncreasePositionMarketRequestInstructionAccounts,
    args: CreateIncreasePositionMarketRequestInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
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
    const instructionData = Buffer.from(getCreateIncreasePositionMarketRequestInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b855c71869ab9c38', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
