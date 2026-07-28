import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';

export interface ClaimInstructionAccounts {
    user: Address;
    liquidity: Address;
    tokenReserve: Address;
    mint: Address;
    recipientTokenAccount: Address;
    vault: Address;
    claimAccount: Address;
    tokenProgram: Address;
}

export interface ClaimInstructionArgs {
    recipient: Address;
}

function getClaimInstructionDataEncoder(): Encoder<ClaimInstructionArgs> {
    return getStructEncoder([
        ['recipient', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function createClaimInstruction(
    accounts: ClaimInstructionAccounts,
    args: ClaimInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.user, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.recipientTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.claimAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getClaimInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('3ec6d6c1d59f6cd2', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
