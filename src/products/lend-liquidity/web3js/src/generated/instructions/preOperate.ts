import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface PreOperateInstructionAccounts {
    protocol: Address;
    liquidity: Address;
    userSupplyPosition?: Address;
    userBorrowPosition?: Address;
    vault: Address;
    tokenReserve: Address;
    tokenProgram: Address;
}

export interface PreOperateInstructionArgs {
    mint: Address;
}

const PreOperateInstructionDataCodec = getStructCodec([
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createPreOperateInstruction(
    accounts: PreOperateInstructionAccounts,
    args: PreOperateInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.protocol, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        accounts.userSupplyPosition
            ? { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.userBorrowPosition
            ? { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(PreOperateInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('81cd9e9bc69b4885', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
