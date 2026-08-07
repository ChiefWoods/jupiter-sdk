import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDFLASHLOAN_PROGRAM_ID } from '../programs/lendFlashLoan';
import { findFlashloanAdminPda } from '../pdas/flashloanAdmin';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_FLASHLOAN_ADMIN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([185, 117, 154, 56, 95, 12, 187, 139]);

export interface InitFlashloanAdminInstructionAccounts {
    signer: Address;
    flashloanAdmin?: Address;
    systemProgram: Address;
}

export interface InitFlashloanAdminInstructionArgs {
    authority: Address;
    flashloanFee: number;
    liquidityProgram: Address;
}

function getInitFlashloanAdminInstructionDataEncoder(): Encoder<InitFlashloanAdminInstructionArgs> {
    return getStructEncoder([
        ['authority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['flashloanFee', getU16Encoder()],
        [
            'liquidityProgram',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
    ]);
}

function getInitFlashloanAdminInstructionDataDecoder(): Decoder<InitFlashloanAdminInstructionArgs> {
    return getStructDecoder([
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['flashloanFee', getU16Decoder()],
        ['liquidityProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitFlashloanAdminInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        flashloanAdmin: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitFlashloanAdminInstructionArgs;
}

export function parseInitFlashloanAdminInstruction(
    instruction: TransactionInstruction,
): ParsedInitFlashloanAdminInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for InitFlashloanAdmin instruction');
    }
    if (!INIT_FLASHLOAN_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitFlashloanAdmin instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            flashloanAdmin: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getInitFlashloanAdminInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitFlashloanAdminInstruction(
    accounts: InitFlashloanAdminInstructionAccounts,
    args: InitFlashloanAdminInstructionArgs,
    programId: Address = LENDFLASHLOAN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let flashloanAdmin = accounts.flashloanAdmin;
    if (!flashloanAdmin) {
        const [derived] = await findFlashloanAdminPda(programId);
        flashloanAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: flashloanAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitFlashloanAdminInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_FLASHLOAN_ADMIN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
