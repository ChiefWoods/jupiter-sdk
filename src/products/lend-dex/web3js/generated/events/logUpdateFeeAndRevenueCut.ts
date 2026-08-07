import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
} from '@solana/codecs';

export const LOG_UPDATE_FEE_AND_REVENUE_CUT_DISCRIMINATOR = new Uint8Array([187, 9, 16, 229, 8, 231, 7, 171]);

export function getLogUpdateFeeAndRevenueCutDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_FEE_AND_REVENUE_CUT_DISCRIMINATOR;
}

export type LogUpdateFeeAndRevenueCut = { dexId: number; fee: number; revenueCut: number };

function getLogUpdateFeeAndRevenueCutDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['fee', getU32Decoder()],
            ['revenueCut', getU32Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_FEE_AND_REVENUE_CUT_DISCRIMINATOR)],
    );
}

export function parseLogUpdateFeeAndRevenueCut(data: Uint8Array): LogUpdateFeeAndRevenueCut {
    if (!LOG_UPDATE_FEE_AND_REVENUE_CUT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEFEEANDREVENUECUT discriminator mismatch');
    }
    const decoded = getLogUpdateFeeAndRevenueCutDecoder().decode(data);
    return decoded as LogUpdateFeeAndRevenueCut;
}
