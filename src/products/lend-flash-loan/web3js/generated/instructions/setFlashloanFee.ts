import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { FLASHLOAN_PROGRAM_ID } from '..';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface SetFlashloanFeeInstructionAccounts {
    authority: Address;
    flashloanAdmin: Address;
}

export interface SetFlashloanFeeInstructionArgs {
    flashloanFee: number;
}

function getSetFlashloanFeeInstructionDataEncoder(): Encoder<SetFlashloanFeeInstructionArgs> {
    return getStructEncoder([['flashloanFee', getU16Encoder()]]);
}

export function createSetFlashloanFeeInstruction(
    accounts: SetFlashloanFeeInstructionAccounts,
    args: SetFlashloanFeeInstructionArgs,
    programId: Address = FLASHLOAN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.flashloanAdmin, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getSetFlashloanFeeInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('78f8dd4654d80095', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
