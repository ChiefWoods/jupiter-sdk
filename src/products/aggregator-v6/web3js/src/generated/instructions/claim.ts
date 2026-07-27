import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPITER_PROGRAM_ID } from '..';
import { getStructEncoder, getU8Encoder, type Encoder } from '@solana/codecs';

export interface ClaimInstructionAccounts {
    wallet: Address;
    programAuthority: Address;
    systemProgram: Address;
}

export interface ClaimInstructionArgs {
    id: number;
}

function getClaimInstructionDataEncoder(): Encoder<ClaimInstructionArgs> {
    return getStructEncoder([['id', getU8Encoder()]]);
}

export function createClaimInstruction(
    accounts: ClaimInstructionAccounts,
    args: ClaimInstructionArgs,
    programId: Address = JUPITER_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.wallet, isSigner: false, isWritable: true },
        { pubkey: accounts.programAuthority, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getClaimInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('3ec6d6c1d59f6cd2', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
