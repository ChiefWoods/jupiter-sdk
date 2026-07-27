import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

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

export function createCreateAndDelegateStakeAccountInstruction(
    accounts: CreateAndDelegateStakeAccountInstructionAccounts,
    args: CreateAndDelegateStakeAccountInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
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
    const instructionData = Buffer.from(getCreateAndDelegateStakeAccountInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('62d17a1bde895e86', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
