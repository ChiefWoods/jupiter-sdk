import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findConfigPda } from '../pdas/config';
import { findFeeAuthorityPda } from '../pdas/feeAuthority';

export interface InitInstructionAccounts {
    payer: Address;
    upgradeAuthority: Address;
    config?: Address;
    feeAuthority?: Address;
    programData: Address;
    program: Address;
    systemProgram: Address;
}

export async function createInitInstruction(
    accounts: InitInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let config = accounts.config;
    if (!config) {
        const [derived] = await findConfigPda(programId);
        config = derived;
    }
    let feeAuthority = accounts.feeAuthority;
    if (!feeAuthority) {
        const [derived] = await findFeeAuthorityPda(programId);
        feeAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.upgradeAuthority, isSigner: true, isWritable: false },
        { pubkey: config, isSigner: false, isWritable: true },
        { pubkey: feeAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.programData, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('dc3bcfec6cfa2f64', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
