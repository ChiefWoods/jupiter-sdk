import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { getStructEncoder, type Encoder } from '@solana/codecs';
import { getTokenConfigEncoder, type TokenConfigArgs } from '../types/tokenConfig';

export interface UpdateTokenConfigInstructionAccounts {
    authority: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
}

export interface UpdateTokenConfigInstructionArgs {
    tokenConfig: TokenConfigArgs;
}

function getUpdateTokenConfigInstructionDataEncoder(): Encoder<UpdateTokenConfigInstructionArgs> {
    return getStructEncoder([['tokenConfig', getTokenConfigEncoder()]]);
}

export function createUpdateTokenConfigInstruction(
    accounts: UpdateTokenConfigInstructionAccounts,
    args: UpdateTokenConfigInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateTokenConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('e77ab54fff4f90a7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
