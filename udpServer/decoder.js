//CBOR decoder

//Mockup data
const buffer = "bf00bf010202190551031a6953b551ff04bf051a00263e5e07190e3106190d32081821ff09bf0abf0b080c000d384f0e280f0a101959db111a000aba2112141319192fffff14bf1519086cff16bf17384b181838e418191925b5181a02ff182c9fff18389fbf18391a00055793183abf183b9f1a6953b03019012c19091b19091b19091b19091b19091b19091b19091b19091b19091b19091b19091b19091b19091b19092119091d19091b190921190921190921190921ffff183cbf183d9f1a6953b03019012c192440192460192456192460192430192460192446192440192430192460192443192430192440192460192450192450192440192460192450192450ffffffff183e9fffff"

const fs = require('fs')
const cbor = require('cbor');

const decoded = cbor.decodeAllSync(buffer);

//console.log(JSON.stringify(decoded, null, 2))
console.dir(decoded, { depth: null })

try {
    fs.writeFileSync('decoded.txt', JSON.stringify(decoded, null, 2));
    console.log('File written successfully (sync).');
} catch (err) {
    console.error('Error writing to file:', err.message);
}
