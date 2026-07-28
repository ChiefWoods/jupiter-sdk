import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    getStructEncoder,
    getU32Encoder,
    getU8Encoder,
    getUtf8Encoder,
    type Encoder,
} from '@solana/codecs';
import { findAuthorityPda } from '../pdas/authority';
import { findConfigPda } from '../pdas/config';
import { findOperatorPda } from '../pdas/operator';

export interface InitInstructionAccounts {
    payer: Address;
    upgradeAuthority: Address;
    operator?: Address;
    config?: Address;
    authority?: Address;
    mint: Address;
    metadata: Address;
    programData: Address;
    program: Address;
    metadataProgram: Address;
    tokenProgram: Address;
    systemProgram: Address;
    rent: Address;
}

export interface InitInstructionArgs {
    decimals: number;
    name: string;
    symbol: string;
    uri: string;
}

function getInitInstructionDataEncoder(): Encoder<InitInstructionArgs> {
    return getStructEncoder([
        ['decimals', getU8Encoder()],
        ['name', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['symbol', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['uri', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ]);
}

export async function createInitInstruction(
    accounts: InitInstructionAccounts,
    args: InitInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let operator = accounts.operator;
    if (!operator) {
        const [derived] = await findOperatorPda(
            {
                upgradeAuthority: accounts.upgradeAuthority,
            },
            programId,
        );
        operator = derived;
    }
    let config = accounts.config;
    if (!config) {
        const [derived] = await findConfigPda(programId);
        config = derived;
    }
    let authority = accounts.authority;
    if (!authority) {
        const [derived] = await findAuthorityPda(programId);
        authority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.upgradeAuthority, isSigner: true, isWritable: false },
        { pubkey: operator, isSigner: false, isWritable: true },
        { pubkey: config, isSigner: false, isWritable: true },
        { pubkey: authority, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: true, isWritable: true },
        { pubkey: accounts.metadata, isSigner: false, isWritable: true },
        { pubkey: accounts.programData, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
        { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('dc3bcfec6cfa2f64', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
