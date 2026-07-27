import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import {
    getBooleanEncoder,
    getI64Encoder,
    getOptionEncoder,
    getStructEncoder,
    getU64Encoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';

export interface InstantDecreasePositionInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
    owner: Address;
    receivingAccount: Address;
    transferAuthority: Address;
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
    desiredMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantDecreasePositionInstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    priceSlippage: number | bigint;
    entirePosition: OptionOrNullable<boolean>;
    requestTime: number | bigint;
}

function getInstantDecreasePositionInstructionDataEncoder(): Encoder<InstantDecreasePositionInstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['priceSlippage', getU64Encoder()],
        ['entirePosition', getOptionEncoder(getBooleanEncoder())],
        ['requestTime', getI64Encoder()],
    ]);
}

export function createInstantDecreasePositionInstruction(
    accounts: InstantDecreasePositionInstructionAccounts,
    args: InstantDecreasePositionInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
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
    const instructionData = Buffer.from(getInstantDecreasePositionInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('2e17f02c1e8a5e8c', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
