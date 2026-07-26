import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { findUserBorrowPositionPda } from '../pdas/userBorrowPosition';
import { findUserSupplyPositionPda } from '../pdas/userSupplyPosition';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface InitNewProtocolInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition?: Address;
    userBorrowPosition?: Address;
    systemProgram: Address;
}

export interface InitNewProtocolInstructionArgs {
    supplyMint: Address;
    borrowMint: Address;
    protocol: Address;
}

const InitNewProtocolInstructionDataCodec = getStructCodec([
    [
        'supplyMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'borrowMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'protocol',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export async function createInitNewProtocolInstruction(
    accounts: InitNewProtocolInstructionAccounts,
    args: InitNewProtocolInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let userSupplyPosition = accounts.userSupplyPosition;
    if (!userSupplyPosition) {
        const [derived] = await findUserSupplyPositionPda(
            {
                supplyMint: args.supplyMint,
                protocol: args.protocol,
            },
            programId,
        );
        userSupplyPosition = derived;
    }
    let userBorrowPosition = accounts.userBorrowPosition;
    if (!userBorrowPosition) {
        const [derived] = await findUserBorrowPositionPda(
            {
                borrowMint: args.borrowMint,
                protocol: args.protocol,
            },
            programId,
        );
        userBorrowPosition = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: userSupplyPosition, isSigner: false, isWritable: true },
        { pubkey: userBorrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitNewProtocolInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('c19305208a87d59e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
