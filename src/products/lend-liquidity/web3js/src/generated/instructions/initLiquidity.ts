import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { findAuthListPda } from '../pdas/authList';
import { findLiquidityPda } from '../pdas/liquidity';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface InitLiquidityInstructionAccounts {
    signer: Address;
    liquidity?: Address;
    authList?: Address;
    systemProgram: Address;
}

export interface InitLiquidityInstructionArgs {
    authority: Address;
    revenueCollector: Address;
}

const InitLiquidityInstructionDataCodec = getStructCodec([
    [
        'authority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'revenueCollector',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export async function createInitLiquidityInstruction(
    accounts: InitLiquidityInstructionAccounts,
    args: InitLiquidityInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let liquidity = accounts.liquidity;
    if (!liquidity) {
        const [derived] = await findLiquidityPda(programId);
        liquidity = derived;
    }
    let authList = accounts.authList;
    if (!authList) {
        const [derived] = await findAuthListPda(programId);
        authList = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: liquidity, isSigner: false, isWritable: true },
        { pubkey: authList, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitLiquidityInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('5fbdd8b7bc3ef46c', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
