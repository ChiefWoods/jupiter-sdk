import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { findTickHasDebtArrayPda } from '../pdas/tickHasDebtArray';
import { getStructCodec, getU16Codec, getU8Codec } from '@solana/codecs';

export interface InitTickHasDebtArrayInstructionAccounts {
    signer: Address;
    vaultConfig: Address;
    tickHasDebtArray?: Address;
    systemProgram: Address;
}

export interface InitTickHasDebtArrayInstructionArgs {
    vaultId: number;
    index: number;
}

const InitTickHasDebtArrayInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    ['index', getU8Codec()],
]);

export async function createInitTickHasDebtArrayInstruction(
    accounts: InitTickHasDebtArrayInstructionAccounts,
    args: InitTickHasDebtArrayInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let tickHasDebtArray = accounts.tickHasDebtArray;
    if (!tickHasDebtArray) {
        const [derived] = await findTickHasDebtArrayPda(
            {
                vaultId: args.vaultId,
                index: args.index,
            },
            programId,
        );
        tickHasDebtArray = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: tickHasDebtArray, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitTickHasDebtArrayInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('ce6c92f514008dd0', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
