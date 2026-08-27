import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
} from '@solana/codecs';

export const LOG_UPDATE_MAX_SUPPLY_SHARES_DISCRIMINATOR = new Uint8Array([209, 150, 112, 193, 243, 63, 233, 212]);

export function getLogUpdateMaxSupplySharesDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_MAX_SUPPLY_SHARES_DISCRIMINATOR;
}

export type LogUpdateMaxSupplyShares = { dexId: number; maxSupplyShares: bigint };

function getLogUpdateMaxSupplySharesDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['maxSupplyShares', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_MAX_SUPPLY_SHARES_DISCRIMINATOR)],
    );
}

export function parseLogUpdateMaxSupplyShares(data: Uint8Array): LogUpdateMaxSupplyShares {
    if (!LOG_UPDATE_MAX_SUPPLY_SHARES_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateMaxSupplyShares discriminator mismatch');
    }
    const decoded = getLogUpdateMaxSupplySharesDecoder().decode(data);
    return decoded as LogUpdateMaxSupplyShares;
}
