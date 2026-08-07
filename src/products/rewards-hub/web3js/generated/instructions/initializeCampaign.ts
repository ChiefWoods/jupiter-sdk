import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    fixDecoderSize,
    fixEncoderSize,
    getArrayDecoder,
    getArrayEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { findCampaignPda } from '../pdas/campaign';
import { findTokenVaultPda } from '../pdas/tokenVault';

export const INITIALIZE_CAMPAIGN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([169, 88, 7, 6, 9, 165, 65, 132]);

export interface InitializeCampaignInstructionAccounts {
    campaign?: Address;
    clawbackReceiver: Address;
    mint: Address;
    tokenVault?: Address;
    admin: Address;
    systemProgram: Address;
    associatedTokenProgram: Address;
    tokenProgram: Address;
}

export interface InitializeCampaignInstructionArgs {
    campaignId: string;
    claimsPubkey: Address;
    allocatedAmounts: Array<number | bigint>;
    startTs: number | bigint;
    endTs: number | bigint;
}

function getInitializeCampaignInstructionDataEncoder(): Encoder<InitializeCampaignInstructionArgs> {
    return getStructEncoder([
        ['campaignId', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['claimsPubkey', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['allocatedAmounts', getArrayEncoder(getU64Encoder(), { size: 5 })],
        ['startTs', getI64Encoder()],
        ['endTs', getI64Encoder()],
    ]);
}

function getInitializeCampaignInstructionDataDecoder(): Decoder<InitializeCampaignInstructionArgs> {
    return getStructDecoder([
        ['campaignId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['claimsPubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['allocatedAmounts', getArrayDecoder(getU64Decoder(), { size: 5 })],
        ['startTs', getI64Decoder()],
        ['endTs', getI64Decoder()],
    ]);
}

export interface ParsedInitializeCampaignInstruction {
    programId: Address;
    accounts: {
        campaign: AccountMeta;
        clawbackReceiver: AccountMeta;
        mint: AccountMeta;
        tokenVault: AccountMeta;
        admin: AccountMeta;
        systemProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: InitializeCampaignInstructionArgs;
}

export function parseInitializeCampaignInstruction(
    instruction: TransactionInstruction,
): ParsedInitializeCampaignInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for InitializeCampaign instruction');
    }
    if (!INITIALIZE_CAMPAIGN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitializeCampaign instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            campaign: instruction.keys[0]!,
            clawbackReceiver: instruction.keys[1]!,
            mint: instruction.keys[2]!,
            tokenVault: instruction.keys[3]!,
            admin: instruction.keys[4]!,
            systemProgram: instruction.keys[5]!,
            associatedTokenProgram: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
        },
        data: getInitializeCampaignInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitializeCampaignInstruction(
    accounts: InitializeCampaignInstructionAccounts,
    args: InitializeCampaignInstructionArgs,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let campaign = accounts.campaign;
    if (!campaign) {
        const [derived] = await findCampaignPda(
            {
                admin: accounts.admin,
                mint: accounts.mint,
                campaignId: args.campaignId,
            },
            programId,
        );
        campaign = derived;
    }
    let tokenVault = accounts.tokenVault;
    if (!tokenVault) {
        const [derived] = await findTokenVaultPda({
            campaign: accounts.campaign,
            mint: accounts.mint,
        });
        tokenVault = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: campaign, isSigner: false, isWritable: true },
        { pubkey: accounts.clawbackReceiver, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: tokenVault, isSigner: false, isWritable: false },
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitializeCampaignInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INITIALIZE_CAMPAIGN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
