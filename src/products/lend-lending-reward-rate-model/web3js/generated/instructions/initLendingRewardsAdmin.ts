import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLENDINGREWARDRATEMODEL_PROGRAM_ID } from '../programs/lendLendingRewardRateModel';
import { findLendingRewardsAdminPda } from '../pdas/lendingRewardsAdmin';
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

export const INIT_LENDING_REWARDS_ADMIN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([202, 36, 47, 209, 3, 201, 173, 94]);

export interface InitLendingRewardsAdminInstructionAccounts {
    signer: Address;
    lendingRewardsAdmin?: Address;
    systemProgram: Address;
}

export interface InitLendingRewardsAdminInstructionArgs {
    authority: Address;
    lendingProgram: Address;
}

function getInitLendingRewardsAdminInstructionDataEncoder(): Encoder<InitLendingRewardsAdminInstructionArgs> {
    return getStructEncoder([
        ['authority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        [
            'lendingProgram',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
    ]);
}

function getInitLendingRewardsAdminInstructionDataDecoder(): Decoder<InitLendingRewardsAdminInstructionArgs> {
    return getStructDecoder([
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['lendingProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitLendingRewardsAdminInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        lendingRewardsAdmin: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitLendingRewardsAdminInstructionArgs;
}

export function parseInitLendingRewardsAdminInstruction(
    instruction: TransactionInstruction,
): ParsedInitLendingRewardsAdminInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for InitLendingRewardsAdmin instruction');
    }
    if (
        !INIT_LENDING_REWARDS_ADMIN_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InitLendingRewardsAdmin instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            lendingRewardsAdmin: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getInitLendingRewardsAdminInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitLendingRewardsAdminInstruction(
    accounts: InitLendingRewardsAdminInstructionAccounts,
    args: InitLendingRewardsAdminInstructionArgs,
    programId: Address = LENDLENDINGREWARDRATEMODEL_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let lendingRewardsAdmin = accounts.lendingRewardsAdmin;
    if (!lendingRewardsAdmin) {
        const [derived] = await findLendingRewardsAdminPda(programId);
        lendingRewardsAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: lendingRewardsAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitLendingRewardsAdminInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_LENDING_REWARDS_ADMIN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
