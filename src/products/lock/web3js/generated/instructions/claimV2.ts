import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getOptionEncoder, getStructEncoder, getU64Encoder, type Encoder, type OptionOrNullable } from '@solana/codecs';
import { getRemainingAccountsInfoEncoder, type RemainingAccountsInfoArgs } from '../types/remainingAccountsInfo';

export interface ClaimV2InstructionAccounts {
    escrow: Address;
    tokenMint: Address;
    escrowToken?: Address;
    recipient: Address;
    recipientToken: Address;
    memoProgram: Address;
    tokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ClaimV2InstructionArgs {
    maxAmount: number | bigint;
    remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs>;
}

function getClaimV2InstructionDataEncoder(): Encoder<ClaimV2InstructionArgs> {
    return getStructEncoder([
        ['maxAmount', getU64Encoder()],
        ['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())],
    ]);
}

export async function createClaimV2Instruction(
    accounts: ClaimV2InstructionAccounts,
    args: ClaimV2InstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let escrowToken = accounts.escrowToken;
    if (!escrowToken) {
        const [derived] = await findEscrowTokenPda(
            {
                escrow: accounts.escrow,
                tokenProgram: accounts.tokenProgram,
                tokenMint: accounts.tokenMint,
            },
            programId,
        );
        escrowToken = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.escrow, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
        { pubkey: escrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.recipient, isSigner: true, isWritable: true },
        { pubkey: accounts.recipientToken, isSigner: false, isWritable: true },
        { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getClaimV2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('e5572ea2159de772', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
