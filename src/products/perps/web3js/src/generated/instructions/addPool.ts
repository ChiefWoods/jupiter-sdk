import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    getI64Encoder,
    getStructEncoder,
    getU32Encoder,
    getUtf8Encoder,
    type Encoder,
} from '@solana/codecs';
import { getFeesEncoder, type FeesArgs } from '../types/fees';
import { getLimitEncoder, type LimitArgs } from '../types/limit';

export interface AddPoolInstructionAccounts {
    admin: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    lpTokenMint: Address;
    systemProgram: Address;
    tokenProgram: Address;
    rent: Address;
}

export interface AddPoolInstructionArgs {
    name: string;
    limit: LimitArgs;
    fees: FeesArgs;
    maxRequestExecutionSec: number | bigint;
}

function getAddPoolInstructionDataEncoder(): Encoder<AddPoolInstructionArgs> {
    return getStructEncoder([
        ['name', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['limit', getLimitEncoder()],
        ['fees', getFeesEncoder()],
        ['maxRequestExecutionSec', getI64Encoder()],
    ]);
}

export function createAddPoolInstruction(
    accounts: AddPoolInstructionAccounts,
    args: AddPoolInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getAddPoolInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('73e6d4d3af3127a9', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
