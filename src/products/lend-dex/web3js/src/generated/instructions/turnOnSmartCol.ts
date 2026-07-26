import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface TurnOnSmartColInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    adminToken0Account: Address;
    adminToken1Account: Address;
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
    token0Program: Address;
    token1Program: Address;
}

export interface TurnOnSmartColInstructionArgs {
    token0Amt: bigint;
}

const TurnOnSmartColInstructionDataCodec = getStructCodec([['token0Amt', getU64Codec()]]);

export function createTurnOnSmartColInstruction(
    accounts: TurnOnSmartColInstructionAccounts,
    args: TurnOnSmartColInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
        { pubkey: accounts.adminToken0Account, isSigner: false, isWritable: true },
        { pubkey: accounts.adminToken1Account, isSigner: false, isWritable: true },
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
        { pubkey: accounts.token0Program, isSigner: false, isWritable: false },
        { pubkey: accounts.token1Program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(TurnOnSmartColInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('8fec83ad165ad6ca', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
