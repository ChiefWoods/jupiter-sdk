import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { findPositionPda } from '../pdas/position';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';

export interface InitPositionInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position?: Address;
    systemProgram: Address;
}

export interface InitPositionInstructionArgs {
    protocol: Address;
}

function getInitPositionInstructionDataEncoder(): Encoder<InitPositionInstructionArgs> {
    return getStructEncoder([
        ['protocol', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export async function createInitPositionInstruction(
    accounts: InitPositionInstructionAccounts,
    args: InitPositionInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let position = accounts.position;
    if (!position) {
        const [derived] = await findPositionPda(
            {
                dex: accounts.dex,
                protocol: args.protocol,
            },
            programId,
        );
        position = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: position, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitPositionInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('c5140a0161a0b15b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
