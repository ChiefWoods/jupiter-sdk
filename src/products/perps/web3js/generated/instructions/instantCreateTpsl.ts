import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getBooleanEncoder, getI64Encoder, getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface InstantCreateTpslInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
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

export interface InstantCreateTpslInstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    triggerPrice: number | bigint;
    triggerAboveThreshold: boolean;
    entirePosition: boolean;
    counter: number | bigint;
    requestTime: number | bigint;
}

function getInstantCreateTpslInstructionDataEncoder(): Encoder<InstantCreateTpslInstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['triggerPrice', getU64Encoder()],
        ['triggerAboveThreshold', getBooleanEncoder()],
        ['entirePosition', getBooleanEncoder()],
        ['counter', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

export function createInstantCreateTpslInstruction(
    accounts: InstantCreateTpslInstructionAccounts,
    args: InstantCreateTpslInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
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
    const instructionData = Buffer.from(getInstantCreateTpslInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('7562427f1e3249b9', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
