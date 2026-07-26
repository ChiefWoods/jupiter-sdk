import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface DepositPerfectInstructionAccounts {
    signer: Address;
    dex: Address;
    user: Address;
    position: Address;
    userToken0Account: Address;
    userToken1Account: Address;
    token0: Address;
    token1: Address;
    token0Reserve: Address;
    token1Reserve: Address;
    token0RateModel: Address;
    token1RateModel: Address;
    token0Vault: Address;
    token1Vault: Address;
    dexSupplyPositionToken0?: Address;
    dexSupplyPositionToken1?: Address;
    dexBorrowPositionToken0?: Address;
    dexBorrowPositionToken1?: Address;
    liquidity: Address;
    liquidityProgram: Address;
    oracleProgram: Address;
    token0Program: Address;
    token1Program: Address;
    recipient?: Address;
    recipientToken0Account?: Address;
    recipientToken1Account?: Address;
}

export interface DepositPerfectInstructionArgs {
    shares: bigint;
    maxToken0: bigint;
    maxToken1: bigint;
}

const DepositPerfectInstructionDataCodec = getStructCodec([
    ['shares', getU64Codec()],
    ['maxToken0', getU64Codec()],
    ['maxToken1', getU64Codec()],
]);

export function createDepositPerfectInstruction(
    accounts: DepositPerfectInstructionAccounts,
    args: DepositPerfectInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
        { pubkey: accounts.user, isSigner: true, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.userToken0Account, isSigner: false, isWritable: true },
        { pubkey: accounts.userToken1Account, isSigner: false, isWritable: true },
        { pubkey: accounts.token0, isSigner: false, isWritable: false },
        { pubkey: accounts.token1, isSigner: false, isWritable: false },
        { pubkey: accounts.token0Reserve, isSigner: false, isWritable: true },
        { pubkey: accounts.token1Reserve, isSigner: false, isWritable: true },
        { pubkey: accounts.token0RateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.token1RateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.token0Vault, isSigner: false, isWritable: true },
        { pubkey: accounts.token1Vault, isSigner: false, isWritable: true },
        accounts.dexSupplyPositionToken0
            ? { pubkey: accounts.dexSupplyPositionToken0, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexSupplyPositionToken1
            ? { pubkey: accounts.dexSupplyPositionToken1, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexBorrowPositionToken0
            ? { pubkey: accounts.dexBorrowPositionToken0, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexBorrowPositionToken1
            ? { pubkey: accounts.dexBorrowPositionToken1, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.oracleProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.token0Program, isSigner: false, isWritable: false },
        { pubkey: accounts.token1Program, isSigner: false, isWritable: false },
        accounts.recipient
            ? { pubkey: accounts.recipient, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.recipientToken0Account
            ? { pubkey: accounts.recipientToken0Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.recipientToken1Account
            ? { pubkey: accounts.recipientToken1Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(DepositPerfectInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('046242d86e7e9a08', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
