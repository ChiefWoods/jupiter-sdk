import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import {
    getBooleanEncoder,
    getOptionEncoder,
    getStructEncoder,
    getU64Encoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';

export interface CreateDecreasePositionMarketRequestInstructionAccounts {
    owner: Address;
    receivingAccount: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    custody: Address;
    collateralCustody: Address;
    desiredMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface CreateDecreasePositionMarketRequestInstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    priceSlippage: number | bigint;
    jupiterMinimumOut: OptionOrNullable<number | bigint>;
    entirePosition: OptionOrNullable<boolean>;
    counter: number | bigint;
}

function getCreateDecreasePositionMarketRequestInstructionDataEncoder(): Encoder<CreateDecreasePositionMarketRequestInstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['priceSlippage', getU64Encoder()],
        ['jupiterMinimumOut', getOptionEncoder(getU64Encoder())],
        ['entirePosition', getOptionEncoder(getBooleanEncoder())],
        ['counter', getU64Encoder()],
    ]);
}

export function createCreateDecreasePositionMarketRequestInstruction(
    accounts: CreateDecreasePositionMarketRequestInstructionAccounts,
    args: CreateDecreasePositionMarketRequestInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: false },
        { pubkey: accounts.desiredMint, isSigner: false, isWritable: false },
        accounts.referral
            ? { pubkey: accounts.referral, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getCreateDecreasePositionMarketRequestInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('4ac6c356c163014f', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
