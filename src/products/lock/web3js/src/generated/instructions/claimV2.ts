import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { RemainingAccountsInfo, remainingAccountsInfoCodec } from '../types/remainingAccountsInfo';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getOptionCodec, getStructCodec, getU64Codec } from '@solana/codecs';

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
    maxAmount: bigint;
    remainingAccountsInfo: RemainingAccountsInfo | null;
}

const ClaimV2InstructionDataCodec = getStructCodec([
    ['maxAmount', getU64Codec()],
    ['remainingAccountsInfo', getOptionCodec(remainingAccountsInfoCodec)],
]);

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
    const instructionData = Buffer.from(ClaimV2InstructionDataCodec.encode(args));
    const discriminator = Buffer.from('e5572ea2159de772', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
