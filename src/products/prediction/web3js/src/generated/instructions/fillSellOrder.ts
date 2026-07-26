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

export interface FillSellOrderInstructionAccounts {
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

export interface FillSellOrderInstructionArgs {
    filledContracts: bigint;
    grossProceedsUsd: bigint;
    venueFeeUsd: bigint;
    orderId: string | null;
}

const FillSellOrderInstructionDataCodec = getStructCodec([
    ['filledContracts', getU64Codec()],
    ['grossProceedsUsd', getU64Codec()],
    ['venueFeeUsd', getU64Codec()],
    ['orderId', getOptionCodec(addCodecSizePrefix(getUtf8Codec(), getU32Codec()))],
]);

export function createFillSellOrderInstruction(
    accounts: FillSellOrderInstructionAccounts,
    args: FillSellOrderInstructionArgs,
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
    const instructionData = Buffer.from(FillSellOrderInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('fba919470d78147e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
