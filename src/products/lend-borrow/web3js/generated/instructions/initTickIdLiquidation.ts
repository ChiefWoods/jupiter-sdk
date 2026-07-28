import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getI32Encoder, getStructEncoder, getU16Encoder, getU32Encoder, type Encoder } from '@solana/codecs';

export interface InitTickIdLiquidationInstructionAccounts {
    signer: Address;
    tickData: Address;
    tickIdLiquidation: Address;
    systemProgram: Address;
}

export interface InitTickIdLiquidationInstructionArgs {
    vaultId: number;
    tick: number;
    totalIds: number;
}

function getInitTickIdLiquidationInstructionDataEncoder(): Encoder<InitTickIdLiquidationInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['tick', getI32Encoder()],
        ['totalIds', getU32Encoder()],
    ]);
}

export function createInitTickIdLiquidationInstruction(
    accounts: InitTickIdLiquidationInstructionAccounts,
    args: InitTickIdLiquidationInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.tickData, isSigner: false, isWritable: false },
        { pubkey: accounts.tickIdLiquidation, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitTickIdLiquidationInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('386e79a998f156b7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
