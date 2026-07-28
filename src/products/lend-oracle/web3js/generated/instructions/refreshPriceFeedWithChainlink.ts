import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    fixEncoderSize,
    getBytesEncoder,
    getStructEncoder,
    getU32Encoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export interface RefreshPriceFeedWithChainlinkInstructionAccounts {
    signer: Address;
    chainlinkDsCache: Address;
    verifierAccount: Address;
    accessController: Address;
    configAccount: Address;
    verifierProgramId: Address;
}

export interface RefreshPriceFeedWithChainlinkInstructionArgs {
    feedId: ReadonlyUint8Array;
    serializedReport: ReadonlyUint8Array;
}

function getRefreshPriceFeedWithChainlinkInstructionDataEncoder(): Encoder<RefreshPriceFeedWithChainlinkInstructionArgs> {
    return getStructEncoder([
        ['feedId', fixEncoderSize(getBytesEncoder(), 32)],
        ['serializedReport', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
    ]);
}

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
    const instructionData = Buffer.from(getRefreshPriceFeedWithChainlinkInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('4a0300b7f27598cb', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
