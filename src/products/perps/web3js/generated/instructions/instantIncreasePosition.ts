import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import {
    getI64Encoder,
    getOptionEncoder,
    getStructEncoder,
    getU64Encoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import { getSideEncoder, type SideArgs } from '../types/side';

export interface InstantIncreasePositionInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
    owner: Address;
    fundingAccount: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    collateralCustody: Address;
    collateralCustodyDovesPriceAccount: Address;
    collateralCustodyPythnetPriceAccount: Address;
    collateralCustodyTokenAccount: Address;
    tokenLedger?: Address;
    referral?: Address;
    tokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantIncreasePositionInstructionArgs {
    sizeUsdDelta: number | bigint;
    collateralTokenDelta: OptionOrNullable<number | bigint>;
    side: SideArgs;
    priceSlippage: number | bigint;
    requestTime: number | bigint;
}

function getInstantIncreasePositionInstructionDataEncoder(): Encoder<InstantIncreasePositionInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['collateralTokenDelta', getOptionEncoder(getU64Encoder())],
        ['side', getSideEncoder()],
        ['priceSlippage', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

export function createInstantIncreasePositionInstruction(
    accounts: InstantIncreasePositionInstructionAccounts,
    args: InstantIncreasePositionInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: true },
        accounts.tokenLedger
            ? { pubkey: accounts.tokenLedger, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.referral
            ? { pubkey: accounts.referral, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInstantIncreasePositionInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a47e44b6dfa640b7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
