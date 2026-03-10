// CBOR decoder

const fs = require('fs');
const cbor = require('cbor');

const inputPath = process.argv[2] || 'data.bin';
const outputPath = process.argv[3] || 'decoded.txt';

function containsUtf8ReplacementBytes(buffer) {
    const replacement = Buffer.from([0xef, 0xbf, 0xbd]);
    return buffer.indexOf(replacement) !== -1;
}

function tryHexTextToBuffer(buffer) {
    const text = buffer.toString('utf8').trim();
    if (text.length === 0) {
        return null;
    }

    const compact = text.replace(/\s+/g, '');
    if (!/^[0-9a-fA-F]+$/.test(compact) || compact.length % 2 !== 0) {
        return null;
    }

    return Buffer.from(compact, 'hex');
}

try {
    const inputBuffer = "bf00bf010202190551031a6953b551ff04bf051a00263e5e07190e3106190d32081821ff09bf0abf0b080c000d384f0e280f0a101959db111a000aba2112141319192fffff14bf1519086cff16bf17384b181838e418191925b5181a02ff182c9fff18389fbf18391a00055793183abf183b9f1a6953b03019012c19091b19091b19091b19091b19091b19091b19091b19091b19091b19091b19091b19091b19091b19092119091d19091b190921190921190921190921ffff183cbf183d9f1a6953b03019012c192440192460192456192460192430192460192446192440192430192460192443192430192440192460192450192450192440192460192450192450ffffffff183e9fffff";

    // Allows files that contain hex string dumps, not only raw binary CBOR.
    const maybeHexBuffer = tryHexTextToBuffer(inputBuffer);
    const payload = maybeHexBuffer || inputBuffer;

    const decoded = cbor.decodeAllSync(payload);
    console.dir(decoded, { depth: null });

    fs.writeFileSync(outputPath, JSON.stringify(decoded, null, 2));
    console.log(`Decoded ${decoded.length} CBOR item(s) -> ${outputPath}`);
} catch (err) {
    const inputBuffer = fs.existsSync(inputPath) ? fs.readFileSync(inputPath) : null;
    if (inputBuffer && containsUtf8ReplacementBytes(inputBuffer)) {
        console.error('Failed to decode CBOR: input appears corrupted (contains UTF-8 replacement bytes EF BF BD).');
        console.error('Re-export or copy the file in binary mode, then retry.');
    }
    console.error('Decoder error:', err.message);
    process.exitCode = 1;
}
