import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder } from '@solana/codecs';
import { getTokenConfigDecoder, type TokenConfig } from '../types/tokenConfig';

export const LOG_UPDATE_TOKEN_CONFIGS_DISCRIMINATOR = new Uint8Array([24, 205, 191, 130, 47, 40, 233, 218]);

export function getLogUpdateTokenConfigsDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_TOKEN_CONFIGS_DISCRIMINATOR;
}

export type LogUpdateTokenConfigs = { tokenConfig: TokenConfig };

function getLogUpdateTokenConfigsDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['tokenConfig', getTokenConfigDecoder()]]), [
        getConstantDecoder(LOG_UPDATE_TOKEN_CONFIGS_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateTokenConfigs(data: Uint8Array): LogUpdateTokenConfigs {
    if (!LOG_UPDATE_TOKEN_CONFIGS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateTokenConfigs discriminator mismatch');
    }
    const decoded = getLogUpdateTokenConfigsDecoder().decode(data);
    return decoded as LogUpdateTokenConfigs;
}
