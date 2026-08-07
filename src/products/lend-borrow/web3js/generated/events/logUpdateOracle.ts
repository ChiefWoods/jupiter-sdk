import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_ORACLE_DISCRIMINATOR = new Uint8Array([251, 163, 219, 57, 30, 152, 177, 10]);

export function getLogUpdateOracleDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_ORACLE_DISCRIMINATOR;
}

export type LogUpdateOracle = { newOracle: Address };

function getLogUpdateOracleDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['newOracle', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_UPDATE_ORACLE_DISCRIMINATOR)],
    );
}

export function parseLogUpdateOracle(data: Uint8Array): LogUpdateOracle {
    if (!LOG_UPDATE_ORACLE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEORACLE discriminator mismatch');
    }
    const decoded = getLogUpdateOracleDecoder().decode(data);
    return decoded as LogUpdateOracle;
}
