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
import { getRequestTypeEncoder, type RequestTypeArgs } from '../types/requestType';

export interface CreateDecreasePositionRequest2InstructionAccounts {
    owner: Address;
    receivingAccount: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    collateralCustody: Address;
    desiredMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface CreateDecreasePositionRequest2InstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    requestType: RequestTypeArgs;
    priceSlippage: OptionOrNullable<number | bigint>;
    jupiterMinimumOut: OptionOrNullable<number | bigint>;
    triggerPrice: OptionOrNullable<number | bigint>;
    triggerAboveThreshold: OptionOrNullable<boolean>;
    entirePosition: OptionOrNullable<boolean>;
    counter: number | bigint;
}

function getCreateDecreasePositionRequest2InstructionDataEncoder(): Encoder<CreateDecreasePositionRequest2InstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['requestType', getRequestTypeEncoder()],
        ['priceSlippage', getOptionEncoder(getU64Encoder())],
        ['jupiterMinimumOut', getOptionEncoder(getU64Encoder())],
        ['triggerPrice', getOptionEncoder(getU64Encoder())],
        ['triggerAboveThreshold', getOptionEncoder(getBooleanEncoder())],
        ['entirePosition', getOptionEncoder(getBooleanEncoder())],
        ['counter', getU64Encoder()],
    ]);
}

export function createCreateDecreasePositionRequest2Instruction(
    accounts: CreateDecreasePositionRequest2InstructionAccounts,
    args: CreateDecreasePositionRequest2InstructionArgs,
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
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
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
    const instructionData = Buffer.from(getCreateDecreasePositionRequest2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('6940c952fa0e6d4d', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
