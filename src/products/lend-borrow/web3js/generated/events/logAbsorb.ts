import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU64Decoder } from '@solana/codecs';

export const LOG_ABSORB_DISCRIMINATOR = new Uint8Array([177, 119, 143, 137, 184, 63, 197, 215]);

export function getLogAbsorbDiscriminatorBytes(): Uint8Array {
    return LOG_ABSORB_DISCRIMINATOR;
}

export type LogAbsorb = { colAmount: bigint; debtAmount: bigint };

function getLogAbsorbDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['colAmount', getU64Decoder()],
            ['debtAmount', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_ABSORB_DISCRIMINATOR)],
    );
}

export function parseLogAbsorb(data: Uint8Array): LogAbsorb {
    if (!LOG_ABSORB_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogAbsorb discriminator mismatch');
    }
    const decoded = getLogAbsorbDecoder().decode(data);
    return decoded as LogAbsorb;
}
