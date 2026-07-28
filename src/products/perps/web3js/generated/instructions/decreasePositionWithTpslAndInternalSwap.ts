import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface DecreasePositionWithTpslAndInternalSwapInstructionAccounts {
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
    collateralCustody: Address;
    collateralCustodyDovesPriceAccount: Address;
    collateralCustodyTokenAccount: Address;
    dispensingCustody: Address;
    dispensingCustodyDovesPriceAccount: Address;
    dispensingCustodyTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export function createDecreasePositionWithTpslAndInternalSwapInstruction(
    accounts: DecreasePositionWithTpslAndInternalSwapInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.dispensingCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('026fc8e723417beb', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
