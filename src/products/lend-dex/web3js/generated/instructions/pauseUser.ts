import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getBooleanEncoder, getStructEncoder, type Encoder } from '@solana/codecs';

export interface PauseUserInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface PauseUserInstructionArgs {
    pauseSupply: boolean;
    pauseBorrow: boolean;
}

function getPauseUserInstructionDataEncoder(): Encoder<PauseUserInstructionArgs> {
    return getStructEncoder([
        ['pauseSupply', getBooleanEncoder()],
        ['pauseBorrow', getBooleanEncoder()],
    ]);
}

export function createPauseUserInstruction(
    accounts: PauseUserInstructionAccounts,
    args: PauseUserInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getPauseUserInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('123f2b5eef35650e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
