import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GENIEDISTRIBUTOR_PROGRAM_ID } from '..';
import { findClaimStatusPda } from '../pdas/claimStatus';
import { getArrayEncoder, getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface ClaimInstructionAccounts {
    campaign: Address;
    claimStatus?: Address;
    from: Address;
    to: Address;
    claimant: Address;
    claimsPubkey: Address;
    tokenProgram: Address;
}

export interface ClaimInstructionArgs {
    amountUnlocked: Array<number | bigint>;
    lootboxInfo: Array<number | bigint>;
}

function getClaimInstructionDataEncoder(): Encoder<ClaimInstructionArgs> {
    return getStructEncoder([
        ['amountUnlocked', getArrayEncoder(getU64Encoder(), { size: 5 })],
        ['lootboxInfo', getArrayEncoder(getU64Encoder(), { size: 5 })],
    ]);
}

export async function createClaimInstruction(
    accounts: ClaimInstructionAccounts,
    args: ClaimInstructionArgs,
    programId: Address = GENIEDISTRIBUTOR_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let claimStatus = accounts.claimStatus;
    if (!claimStatus) {
        const [derived] = await findClaimStatusPda(
            {
                claimant: accounts.claimant,
                campaign: accounts.campaign,
            },
            programId,
        );
        claimStatus = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: claimStatus, isSigner: false, isWritable: true },
        { pubkey: accounts.from, isSigner: false, isWritable: true },
        { pubkey: accounts.to, isSigner: false, isWritable: true },
        { pubkey: accounts.claimant, isSigner: true, isWritable: true },
        { pubkey: accounts.claimsPubkey, isSigner: true, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getClaimInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('3ec6d6c1d59f6cd2', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
