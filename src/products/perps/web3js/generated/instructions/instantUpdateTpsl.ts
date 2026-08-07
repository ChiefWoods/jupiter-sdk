import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INSTANT_UPDATE_TPSL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([144, 228, 114, 37, 165, 242, 111, 101]);

export interface InstantUpdateTpslInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
    owner: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantUpdateTpslInstructionArgs {
    sizeUsdDelta: number | bigint;
    triggerPrice: number | bigint;
    requestTime: number | bigint;
}

function getInstantUpdateTpslInstructionDataEncoder(): Encoder<InstantUpdateTpslInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['triggerPrice', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

function getInstantUpdateTpslInstructionDataDecoder(): Decoder<InstantUpdateTpslInstructionArgs> {
    return getStructDecoder([
        ['sizeUsdDelta', getU64Decoder()],
        ['triggerPrice', getU64Decoder()],
        ['requestTime', getI64Decoder()],
    ]);
}

export interface ParsedInstantUpdateTpslInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        apiKeeper: AccountMeta;
        owner: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        position: AccountMeta;
        positionRequest: AccountMeta;
        custody: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: InstantUpdateTpslInstructionArgs;
}

export function parseInstantUpdateTpslInstruction(
    instruction: TransactionInstruction,
): ParsedInstantUpdateTpslInstruction {
    if (instruction.keys.length < 12) {
        throw new Error('Expected 12 account metas for InstantUpdateTpsl instruction');
    }
    if (!INSTANT_UPDATE_TPSL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InstantUpdateTpsl instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            apiKeeper: instruction.keys[1]!,
            owner: instruction.keys[2]!,
            perpetuals: instruction.keys[3]!,
            pool: instruction.keys[4]!,
            position: instruction.keys[5]!,
            positionRequest: instruction.keys[6]!,
            custody: instruction.keys[7]!,
            custodyDovesPriceAccount: instruction.keys[8]!,
            custodyPythnetPriceAccount: instruction.keys[9]!,
            eventAuthority: instruction.keys[10]!,
            program: instruction.keys[11]!,
        },
        data: getInstantUpdateTpslInstructionDataDecoder().decode(instructionData),
    };
}

export function createInstantUpdateTpslInstruction(
    accounts: InstantUpdateTpslInstructionAccounts,
    args: InstantUpdateTpslInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInstantUpdateTpslInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INSTANT_UPDATE_TPSL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
