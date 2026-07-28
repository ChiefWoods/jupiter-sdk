import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { findBenefactorPda } from '../pdas/benefactor';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

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

export async function createCreateBenefactorInstruction(
    accounts: CreateBenefactorInstructionAccounts,
    args: CreateBenefactorInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
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
    const instructionData = Buffer.from(getCreateBenefactorInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b8f12d003528c936', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
