import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import {
    addCodecSizePrefix,
    getOptionCodec,
    getStructCodec,
    getU32Codec,
    getU64Codec,
    getUtf8Codec,
} from '@solana/codecs';

export interface FillBuyOrderInstructionAccounts {
    authority: Address;
    secondaryAuthority: Address;
    owner: Address;
    vault: Address;
    position: Address;
    order: Address;
    vaultTokenAccount: Address;
    orderAta: Address;
    integratorTokenAccount?: Address;
    tokenProgram: Address;
}

export interface FillBuyOrderInstructionArgs {
    filledContracts: bigint;
    totalCostUsd: bigint;
    venueFeeUsd: bigint;
    orderId: string | null;
}

const FillBuyOrderInstructionDataCodec = getStructCodec([
    ['filledContracts', getU64Codec()],
    ['totalCostUsd', getU64Codec()],
    ['venueFeeUsd', getU64Codec()],
    ['orderId', getOptionCodec(addCodecSizePrefix(getUtf8Codec(), getU32Codec()))],
]);

export function createFillBuyOrderInstruction(
    accounts: FillBuyOrderInstructionAccounts,
    args: FillBuyOrderInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.secondaryAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.order, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.orderAta, isSigner: false, isWritable: true },
        accounts.integratorTokenAccount
            ? { pubkey: accounts.integratorTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(FillBuyOrderInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('b3c9dd165b10d004', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
