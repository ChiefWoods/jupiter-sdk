import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { findClaimAccountPda } from '../pdas/claimAccount';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface InitClaimAccountInstructionAccounts {
    signer: Address;
    claimAccount?: Address;
    systemProgram: Address;
}

export interface InitClaimAccountInstructionArgs {
    mint: Address;
    user: Address;
}

const InitClaimAccountInstructionDataCodec = getStructCodec([
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'user',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export async function createInitClaimAccountInstruction(
    accounts: InitClaimAccountInstructionAccounts,
    args: InitClaimAccountInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let claimAccount = accounts.claimAccount;
    if (!claimAccount) {
        const [derived] = await findClaimAccountPda(
            {
                user: args.user,
                mint: args.mint,
            },
            programId,
        );
        claimAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: claimAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitClaimAccountInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('708d2faa2a639091', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
