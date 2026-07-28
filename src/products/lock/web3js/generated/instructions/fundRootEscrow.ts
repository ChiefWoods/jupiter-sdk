import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findRootEscrowTokenPda } from '../pdas/rootEscrowToken';
import { getOptionEncoder, getStructEncoder, getU64Encoder, type Encoder, type OptionOrNullable } from '@solana/codecs';
import { getRemainingAccountsInfoEncoder, type RemainingAccountsInfoArgs } from '../types/remainingAccountsInfo';

export interface FundRootEscrowInstructionAccounts {
    rootEscrow: Address;
    tokenMint: Address;
    rootEscrowToken?: Address;
    payer: Address;
    payerToken: Address;
    tokenProgram: Address;
    systemProgram: Address;
    associatedTokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface FundRootEscrowInstructionArgs {
    maxAmount: number | bigint;
    remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs>;
}

function getFundRootEscrowInstructionDataEncoder(): Encoder<FundRootEscrowInstructionArgs> {
    return getStructEncoder([
        ['maxAmount', getU64Encoder()],
        ['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())],
    ]);
}

export async function createFundRootEscrowInstruction(
    accounts: FundRootEscrowInstructionAccounts,
    args: FundRootEscrowInstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let rootEscrowToken = accounts.rootEscrowToken;
    if (!rootEscrowToken) {
        const [derived] = await findRootEscrowTokenPda(
            {
                rootEscrow: accounts.rootEscrow,
                tokenProgram: accounts.tokenProgram,
                tokenMint: accounts.tokenMint,
            },
            programId,
        );
        rootEscrowToken = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.rootEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
        { pubkey: rootEscrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.payerToken, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getFundRootEscrowInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('fb6abdc86c0f905f', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
