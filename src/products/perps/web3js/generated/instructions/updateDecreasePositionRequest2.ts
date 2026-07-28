import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface UpdateDecreasePositionRequest2InstructionAccounts {
    owner: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
}

export interface UpdateDecreasePositionRequest2InstructionArgs {
    sizeUsdDelta: number | bigint;
    triggerPrice: number | bigint;
}

function getUpdateDecreasePositionRequest2InstructionDataEncoder(): Encoder<UpdateDecreasePositionRequest2InstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['triggerPrice', getU64Encoder()],
    ]);
}

export function createUpdateDecreasePositionRequest2Instruction(
    accounts: UpdateDecreasePositionRequest2InstructionAccounts,
    args: UpdateDecreasePositionRequest2InstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getUpdateDecreasePositionRequest2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('90c8f9ff6cd9f974', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
