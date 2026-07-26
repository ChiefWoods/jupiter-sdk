import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { addCodecSizePrefix, fixCodecSize, getBytesCodec, getStructCodec, getU32Codec } from '@solana/codecs';

export interface RefreshPriceFeedWithChainlinkInstructionAccounts {
    signer: Address;
    chainlinkDsCache: Address;
    verifierAccount: Address;
    accessController: Address;
    configAccount: Address;
    verifierProgramId: Address;
}

export interface RefreshPriceFeedWithChainlinkInstructionArgs {
    feedId: Uint8Array;
    serializedReport: Uint8Array;
}

const RefreshPriceFeedWithChainlinkInstructionDataCodec = getStructCodec([
    ['feedId', fixCodecSize(getBytesCodec(), 32)],
    ['serializedReport', addCodecSizePrefix(getBytesCodec(), getU32Codec())],
]);

export function createRefreshPriceFeedWithChainlinkInstruction(
    accounts: RefreshPriceFeedWithChainlinkInstructionAccounts,
    args: RefreshPriceFeedWithChainlinkInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.chainlinkDsCache, isSigner: false, isWritable: true },
        { pubkey: accounts.verifierAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.accessController, isSigner: false, isWritable: false },
        { pubkey: accounts.configAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.verifierProgramId, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(RefreshPriceFeedWithChainlinkInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('4a0300b7f27598cb', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
