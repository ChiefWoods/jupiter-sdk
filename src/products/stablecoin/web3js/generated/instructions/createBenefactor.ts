import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import { findBenefactorPda } from '../pdas/benefactor';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CREATE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR = new Uint8Array([184, 241, 45, 0, 53, 40, 201, 54]);

export interface CreateBenefactorInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    payer: Address;
    benefactorAuthority: Address;
    benefactor?: Address;
    systemProgram: Address;
}

export interface CreateBenefactorInstructionArgs {
    mintFeeRate: number;
    redeemFeeRate: number;
}

function getCreateBenefactorInstructionDataEncoder(): Encoder<CreateBenefactorInstructionArgs> {
    return getStructEncoder([
        ['mintFeeRate', getU16Encoder()],
        ['redeemFeeRate', getU16Encoder()],
    ]);
}

function getCreateBenefactorInstructionDataDecoder(): Decoder<CreateBenefactorInstructionArgs> {
    return getStructDecoder([
        ['mintFeeRate', getU16Decoder()],
        ['redeemFeeRate', getU16Decoder()],
    ]);
}

export interface ParsedCreateBenefactorInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        operator: AccountMeta;
        payer: AccountMeta;
        benefactorAuthority: AccountMeta;
        benefactor: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: CreateBenefactorInstructionArgs;
}

export function parseCreateBenefactorInstruction(
    instruction: TransactionInstruction,
): ParsedCreateBenefactorInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for CreateBenefactor instruction');
    }
    if (!CREATE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateBenefactor instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            operator: instruction.keys[1]!,
            payer: instruction.keys[2]!,
            benefactorAuthority: instruction.keys[3]!,
            benefactor: instruction.keys[4]!,
            systemProgram: instruction.keys[5]!,
        },
        data: getCreateBenefactorInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateBenefactorInstruction(
    accounts: CreateBenefactorInstructionAccounts,
    args: CreateBenefactorInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let benefactor = accounts.benefactor;
    if (!benefactor) {
        const [derived] = await findBenefactorPda(
            {
                benefactorAuthority: accounts.benefactorAuthority,
            },
            programId,
        );
        benefactor = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.benefactorAuthority, isSigner: false, isWritable: false },
        { pubkey: benefactor, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateBenefactorInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
