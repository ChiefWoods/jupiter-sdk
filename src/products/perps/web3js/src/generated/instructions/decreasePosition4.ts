import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface DecreasePosition4InstructionAccounts {
    keeper: Address;
    owner: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    position: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    collateralCustody: Address;
    collateralCustodyDovesPriceAccount: Address;
    collateralCustodyPythnetPriceAccount: Address;
    collateralCustodyTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export function createDecreasePosition4Instruction(
    accounts: DecreasePosition4InstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('b9a172af609403aa', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
