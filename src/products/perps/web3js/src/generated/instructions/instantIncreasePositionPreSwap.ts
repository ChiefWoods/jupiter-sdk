import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface InstantIncreasePositionPreSwapInstructionAccounts {
    owner: Address;
    fundingAccount: Address;
    receivingAccount: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    receivingCustody: Address;
    receivingCustodyDovesPriceAccount: Address;
    receivingCustodyTokenAccount: Address;
    dispensingCustody: Address;
    dispensingCustodyDovesPriceAccount: Address;
    dispensingCustodyTokenAccount: Address;
    tokenProgram: Address;
    instructionSysvar: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantIncreasePositionPreSwapInstructionArgs {
    amountIn: number | bigint;
    minAmountOut: number | bigint;
}

function getInstantIncreasePositionPreSwapInstructionDataEncoder(): Encoder<InstantIncreasePositionPreSwapInstructionArgs> {
    return getStructEncoder([
        ['amountIn', getU64Encoder()],
        ['minAmountOut', getU64Encoder()],
    ]);
}

export function createInstantIncreasePositionPreSwapInstruction(
    accounts: InstantIncreasePositionPreSwapInstructionAccounts,
    args: InstantIncreasePositionPreSwapInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.receivingCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.receivingCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.receivingCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.dispensingCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.instructionSysvar, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInstantIncreasePositionPreSwapInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('c52656a5c71726ea', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
