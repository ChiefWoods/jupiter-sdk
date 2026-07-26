import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { UserSupplyConfig, userSupplyConfigCodec } from '../types/userSupplyConfig';
import { getStructCodec } from '@solana/codecs';

export interface UpdateUserSupplyConfigInstructionAccounts {
    authority: Address;
    protocol: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
    userSupplyPosition: Address;
}

export interface UpdateUserSupplyConfigInstructionArgs {
    userSupplyConfig: UserSupplyConfig;
}

const UpdateUserSupplyConfigInstructionDataCodec = getStructCodec([['userSupplyConfig', userSupplyConfigCodec]]);

export function createUpdateUserSupplyConfigInstruction(
    accounts: UpdateUserSupplyConfigInstructionAccounts,
    args: UpdateUserSupplyConfigInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.protocol, isSigner: false, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateUserSupplyConfigInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('d9efe1da2131eab7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
