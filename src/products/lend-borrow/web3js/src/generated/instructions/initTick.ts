import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getI32Codec, getStructCodec, getU16Codec } from '@solana/codecs';

export interface InitTickInstructionAccounts {
    signer: Address;
    vaultConfig: Address;
    tickData: Address;
    systemProgram: Address;
}

export interface InitTickInstructionArgs {
    vaultId: number;
    tick: number;
}

const InitTickInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    ['tick', getI32Codec()],
]);

export function createInitTickInstruction(
    accounts: InitTickInstructionAccounts,
    args: InitTickInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.tickData, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitTickInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('160d3e8d4959b21d', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
