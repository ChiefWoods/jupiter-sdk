import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GENIEDISTRIBUTOR_PROGRAM_ID } from '..';
import { getArrayEncoder, getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface IdempotentClaimInstructionAccounts {
    campaign: Address;
    claimStatus: Address;
    from: Address;
    to: Address;
    claimant: Address;
    claimsPubkey: Address;
    tokenProgram: Address;
    systemProgram: Address;
    associatedTokenProgram: Address;
    program: Address;
    mint: Address;
}

export interface IdempotentClaimInstructionArgs {
    amount: Array<number | bigint>;
    lootboxInfo: Array<number | bigint>;
}

function getIdempotentClaimInstructionDataEncoder(): Encoder<IdempotentClaimInstructionArgs> {
    return getStructEncoder([
        ['amount', getArrayEncoder(getU64Encoder(), { size: 5 })],
        ['lootboxInfo', getArrayEncoder(getU64Encoder(), { size: 5 })],
    ]);
}

export function createIdempotentClaimInstruction(
    accounts: IdempotentClaimInstructionAccounts,
    args: IdempotentClaimInstructionArgs,
    programId: Address = GENIEDISTRIBUTOR_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: accounts.claimStatus, isSigner: false, isWritable: false },
        { pubkey: accounts.from, isSigner: false, isWritable: false },
        { pubkey: accounts.to, isSigner: false, isWritable: false },
        { pubkey: accounts.claimant, isSigner: true, isWritable: true },
        { pubkey: accounts.claimsPubkey, isSigner: true, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getIdempotentClaimInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('e575b554d9c83d96', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
