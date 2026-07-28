import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GENIEDISTRIBUTOR_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    fixEncoderSize,
    getArrayEncoder,
    getBytesEncoder,
    getI64Encoder,
    getStructEncoder,
    getU32Encoder,
    getU64Encoder,
    getUtf8Encoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';
import { findCampaignPda } from '../pdas/campaign';
import { findTokenVaultPda } from '../pdas/tokenVault';

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

export async function createInitializeCampaignInstruction(
    accounts: InitializeCampaignInstructionAccounts,
    args: InitializeCampaignInstructionArgs,
    programId: Address = GENIEDISTRIBUTOR_PROGRAM_ID,
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
        const [derived] = await findTokenVaultPda(
            {
                campaign: accounts.campaign,
                mint: accounts.mint,
            },
            programId,
        );
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
    const instructionData = Buffer.from(getInitializeCampaignInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a958070609a54184', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
