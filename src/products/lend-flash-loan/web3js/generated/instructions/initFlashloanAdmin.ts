import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { FLASHLOAN_PROGRAM_ID } from '..';
import { findFlashloanAdminPda } from '../pdas/flashloanAdmin';
import {
    fixEncoderSize,
    getBytesEncoder,
    getStructEncoder,
    getU16Encoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';

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

export async function createInitFlashloanAdminInstruction(
    accounts: InitFlashloanAdminInstructionAccounts,
    args: InitFlashloanAdminInstructionArgs,
    programId: Address = FLASHLOAN_PROGRAM_ID,
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
    const instructionData = Buffer.from(getInitFlashloanAdminInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b9759a385f0cbb8b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
