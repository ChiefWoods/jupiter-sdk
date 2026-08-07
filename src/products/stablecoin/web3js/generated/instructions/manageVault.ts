import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';
import {
    getVaultManagementActionDecoder,
    getVaultManagementActionEncoder,
    type VaultManagementActionArgs,
} from '../types/vaultManagementAction';

export const MANAGE_VAULT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([165, 7, 106, 242, 73, 193, 195, 128]);

export interface ManageVaultInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    vault: Address;
}

export interface ManageVaultInstructionArgs {
    action: VaultManagementActionArgs;
}

function getManageVaultInstructionDataEncoder(): Encoder<ManageVaultInstructionArgs> {
    return getStructEncoder([['action', getVaultManagementActionEncoder()]]);
}

function getManageVaultInstructionDataDecoder(): Decoder<ManageVaultInstructionArgs> {
    return getStructDecoder([['action', getVaultManagementActionDecoder()]]);
}

export interface ParsedManageVaultInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        operator: AccountMeta;
        vault: AccountMeta;
    };
    data: ManageVaultInstructionArgs;
}

export function parseManageVaultInstruction(instruction: TransactionInstruction): ParsedManageVaultInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for ManageVault instruction');
    }
    if (!MANAGE_VAULT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ManageVault instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            operator: instruction.keys[1]!,
            vault: instruction.keys[2]!,
        },
        data: getManageVaultInstructionDataDecoder().decode(instructionData),
    };
}

export function createManageVaultInstruction(
    accounts: ManageVaultInstructionAccounts,
    args: ManageVaultInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getManageVaultInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(MANAGE_VAULT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
