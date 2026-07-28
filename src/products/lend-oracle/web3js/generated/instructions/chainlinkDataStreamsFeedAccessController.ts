import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { getBooleanEncoder, getStructEncoder, type Encoder } from '@solana/codecs';

export interface ChainlinkDataStreamsFeedAccessControllerInstructionAccounts {
    authority: Address;
    chainlinkDsCache: Address;
}

export interface ChainlinkDataStreamsFeedAccessControllerInstructionArgs {
    suspend: boolean;
}

function getChainlinkDataStreamsFeedAccessControllerInstructionDataEncoder(): Encoder<ChainlinkDataStreamsFeedAccessControllerInstructionArgs> {
    return getStructEncoder([['suspend', getBooleanEncoder()]]);
}

export function createChainlinkDataStreamsFeedAccessControllerInstruction(
    accounts: ChainlinkDataStreamsFeedAccessControllerInstructionAccounts,
    args: ChainlinkDataStreamsFeedAccessControllerInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.chainlinkDsCache, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(
        getChainlinkDataStreamsFeedAccessControllerInstructionDataEncoder().encode(args),
    );
    const discriminator = Buffer.from('b558b397e1260906', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
