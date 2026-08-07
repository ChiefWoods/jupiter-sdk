import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CREATE_AND_DELEGATE_STAKE_ACCOUNT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    98, 209, 122, 27, 222, 137, 94, 134,
]);

export interface CreateAndDelegateStakeAccountInstructionAccounts {
    keeper: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyTokenAccount: Address;
    transferAuthority: Address;
    stakeAccount: Address;
    stakeInfo: Address;
    validatorVoteAccount: Address;
    stakeConfig: Address;
    wsolMint: Address;
    tempWsolAccount: Address;
    rent: Address;
    clock: Address;
    stakeHistory: Address;
    stakeProgram: Address;
    systemProgram: Address;
    tokenProgram: Address;
}

export interface CreateAndDelegateStakeAccountInstructionArgs {
    stakeAccountIndex: number | bigint;
    stakeAmountLamports: number | bigint;
}

function getCreateAndDelegateStakeAccountInstructionDataEncoder(): Encoder<CreateAndDelegateStakeAccountInstructionArgs> {
    return getStructEncoder([
        ['stakeAccountIndex', getU64Encoder()],
        ['stakeAmountLamports', getU64Encoder()],
    ]);
}

function getCreateAndDelegateStakeAccountInstructionDataDecoder(): Decoder<CreateAndDelegateStakeAccountInstructionArgs> {
    return getStructDecoder([
        ['stakeAccountIndex', getU64Decoder()],
        ['stakeAmountLamports', getU64Decoder()],
    ]);
}

export interface ParsedCreateAndDelegateStakeAccountInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        custodyTokenAccount: AccountMeta;
        transferAuthority: AccountMeta;
        stakeAccount: AccountMeta;
        stakeInfo: AccountMeta;
        validatorVoteAccount: AccountMeta;
        stakeConfig: AccountMeta;
        wsolMint: AccountMeta;
        tempWsolAccount: AccountMeta;
        rent: AccountMeta;
        clock: AccountMeta;
        stakeHistory: AccountMeta;
        stakeProgram: AccountMeta;
        systemProgram: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: CreateAndDelegateStakeAccountInstructionArgs;
}

export function parseCreateAndDelegateStakeAccountInstruction(
    instruction: TransactionInstruction,
): ParsedCreateAndDelegateStakeAccountInstruction {
    if (instruction.keys.length < 18) {
        throw new Error('Expected 18 account metas for CreateAndDelegateStakeAccount instruction');
    }
    if (
        !CREATE_AND_DELEGATE_STAKE_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateAndDelegateStakeAccount instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            custody: instruction.keys[3]!,
            custodyTokenAccount: instruction.keys[4]!,
            transferAuthority: instruction.keys[5]!,
            stakeAccount: instruction.keys[6]!,
            stakeInfo: instruction.keys[7]!,
            validatorVoteAccount: instruction.keys[8]!,
            stakeConfig: instruction.keys[9]!,
            wsolMint: instruction.keys[10]!,
            tempWsolAccount: instruction.keys[11]!,
            rent: instruction.keys[12]!,
            clock: instruction.keys[13]!,
            stakeHistory: instruction.keys[14]!,
            stakeProgram: instruction.keys[15]!,
            systemProgram: instruction.keys[16]!,
            tokenProgram: instruction.keys[17]!,
        },
        data: getCreateAndDelegateStakeAccountInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateAndDelegateStakeAccountInstruction(
    accounts: CreateAndDelegateStakeAccountInstructionAccounts,
    args: CreateAndDelegateStakeAccountInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.stakeInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.validatorVoteAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.wsolMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tempWsolAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
        { pubkey: accounts.clock, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeHistory, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateAndDelegateStakeAccountInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_AND_DELEGATE_STAKE_ACCOUNT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
