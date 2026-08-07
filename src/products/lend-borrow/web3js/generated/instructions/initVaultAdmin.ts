import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import { findVaultAdminPda } from '../pdas/vaultAdmin';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_VAULT_ADMIN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([22, 133, 2, 244, 123, 100, 249, 230]);

export interface InitVaultAdminInstructionAccounts {
    signer: Address;
    vaultAdmin?: Address;
    systemProgram: Address;
}

export interface InitVaultAdminInstructionArgs {
    liquidity: Address;
    authority: Address;
}

function getInitVaultAdminInstructionDataEncoder(): Encoder<InitVaultAdminInstructionArgs> {
    return getStructEncoder([
        ['liquidity', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['authority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getInitVaultAdminInstructionDataDecoder(): Decoder<InitVaultAdminInstructionArgs> {
    return getStructDecoder([
        ['liquidity', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitVaultAdminInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        vaultAdmin: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitVaultAdminInstructionArgs;
}

export function parseInitVaultAdminInstruction(instruction: TransactionInstruction): ParsedInitVaultAdminInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for InitVaultAdmin instruction');
    }
    if (!INIT_VAULT_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitVaultAdmin instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            vaultAdmin: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getInitVaultAdminInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitVaultAdminInstruction(
    accounts: InitVaultAdminInstructionAccounts,
    args: InitVaultAdminInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vaultAdmin = accounts.vaultAdmin;
    if (!vaultAdmin) {
        const [derived] = await findVaultAdminPda(programId);
        vaultAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: vaultAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitVaultAdminInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_VAULT_ADMIN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
