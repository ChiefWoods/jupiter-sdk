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

export interface InstantDecreasePosition2InstructionAccounts {
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
    collateralCustody: Address;
    collateralCustodyDovesPriceAccount: Address;
    collateralCustodyTokenAccount: Address;
    desiredMint: Address;
    referral?: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantDecreasePosition2InstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    priceSlippage: number | bigint;
    entirePosition: OptionOrNullable<boolean>;
    requestTime: number | bigint;
    counter: number | bigint;
}

function getInstantDecreasePosition2InstructionDataEncoder(): Encoder<InstantDecreasePosition2InstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['priceSlippage', getU64Encoder()],
        ['entirePosition', getOptionEncoder(getBooleanEncoder())],
        ['requestTime', getI64Encoder()],
        ['counter', getU64Encoder()],
    ]);
}

export function createInstantDecreasePosition2Instruction(
    accounts: InstantDecreasePosition2InstructionAccounts,
    args: InstantDecreasePosition2InstructionArgs,
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
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.desiredMint, isSigner: false, isWritable: false },
        accounts.referral
            ? { pubkey: accounts.referral, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInstantDecreasePosition2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a2bfc83e8b3eb011', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
