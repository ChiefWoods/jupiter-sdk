import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getOptionDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Option,
} from '@solana/codecs';

export const CLOSE_POSITION_REQUEST_DISCRIMINATOR = new Uint8Array([21, 34, 92, 158, 224, 29, 180, 243]);

export function getClosePositionRequestEventDiscriminatorBytes(): Uint8Array {
    return CLOSE_POSITION_REQUEST_DISCRIMINATOR;
}

export type ClosePositionRequest = {
    entirePosition: Option<boolean>;
    executed: boolean;
    requestChange: number;
    requestType: number;
    side: number;
    positionRequestKey: Address;
    owner: Address;
    mint: Address;
    amount: bigint;
    openTime: bigint;
};

function getClosePositionRequestDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['entirePosition', getOptionDecoder(getBooleanDecoder())],
            ['executed', getBooleanDecoder()],
            ['requestChange', getU8Decoder()],
            ['requestType', getU8Decoder()],
            ['side', getU8Decoder()],
            [
                'positionRequestKey',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['openTime', getI64Decoder()],
        ]),
        [getConstantDecoder(CLOSE_POSITION_REQUEST_DISCRIMINATOR)],
    );
}

export function parseClosePositionRequest(data: Uint8Array): ClosePositionRequest {
    if (!CLOSE_POSITION_REQUEST_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CLOSEPOSITIONREQUEST discriminator mismatch');
    }
    const decoded = getClosePositionRequestDecoder().decode(data);
    return decoded as ClosePositionRequest;
}
