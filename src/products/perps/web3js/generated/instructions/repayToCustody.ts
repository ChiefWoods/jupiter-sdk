import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface RepayToCustodyInstructionAccounts {
    owner: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    borrowPosition: Address;
    custodyTokenAccount: Address;
    userTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface RepayToCustodyInstructionArgs {
    amount: number | bigint;
}

function getRepayToCustodyInstructionDataEncoder(): Encoder<RepayToCustodyInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

export function createRepayToCustodyInstruction(
    accounts: RepayToCustodyInstructionAccounts,
    args: RepayToCustodyInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getRepayToCustodyInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('d3dbb7def84a051a', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
