const fs = require('node:fs');
const path = require('node:path');

const headerPath = path.join(
    __dirname,
    '..',
    'ios',
    'generated',
    'RNEscPosPrinterSpec',
    'RNEscPosPrinterSpec.h'
);

const unixNeedle = 'struct Builder {\n        struct Input {';
const dosNeedle = 'struct Builder {\r\n        struct Input {';
const replacement =
    'struct Builder {\n        using ResultT = Constants;\n\n        struct Input {';

function patchHeader(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log('[patch-ios-codegen] Header not found, skipping:', filePath);
        return;
    }

    const source = fs.readFileSync(filePath, 'utf8');

    let patched = source
        .split(unixNeedle)
        .join(replacement)
        .split(dosNeedle)
        .join(replacement);

    if (patched === source) {
        if (source.includes('using ResultT = Constants;')) {
            console.log('[patch-ios-codegen] Header already patched.');
        } else {
            console.warn(
                '[patch-ios-codegen] Patch marker not found in header; no changes applied.'
            );
        }
        return;
    }

    fs.writeFileSync(filePath, patched, 'utf8');
    console.log('[patch-ios-codegen] Applied Builder::ResultT compatibility patch.');
}

patchHeader(headerPath);
