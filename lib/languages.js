// Copyright (c) 2017, Compiler Explorer Authors
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

import path from 'path';

import fs from 'fs-extra';
import _ from 'underscore';

/***
 * TODO: Use the types/languages once available
 * Language object type
 *
 * @typedef {Object} CELanguage
 * @property {string} id - Id of language. Added programmatically based on CELanguages key
 * @property {string} name - UI display name of the language
 * @property {string} monaco - Monaco Editor language ID (Selects which language Monaco will use to highlight the code)
 * @property {string[]} extensions - Usual extensions associated with the language. First one is used as file input etx
 * @property {string[]} alias - Different ways in which we can also refer to this language
 * @property {string} [formatter] - Format API name to use (See https://godbolt.org/api/formats)
 * @property {boolean} supportsExecute - Whether there's at least 1 compiler in this language that supportsExecute
 */

/***
 * Currently supported languages on Compiler Explorer
 *
 * @typedef {Object.<string, CELanguage>} CELanguages
 */

/***
 * Current supported languages
 * @type {CELanguages}
 */
export const languages = {
    'c++': {
        name: 'C++',
        monaco: 'cppp',
        extensions: ['.cpp', '.cxx', '.h', '.hpp', '.hxx', '.c', '.cc', '.ixx'],
        alias: ['gcc', 'cpp'],
        previewFilter: /^\s*#include/,
        formatter: 'clangformat',
    },
    llvm: {
        name: 'LLVM IR',
        monaco: 'llvm-ir',
        extensions: ['.ll'],
        alias: [],
    },
    c: {
        name: 'C',
        monaco: 'nc',
        extensions: ['.c', '.h'],
        alias: [],
        previewFilter: /^\s*#include/,
    },
    assembly: {
        name: 'Assembly',
        monaco: 'asm',
        extensions: ['.asm'],
        alias: ['asm'],
    }
};

_.each(languages, (lang, key) => {
    lang.id = key;
    lang.supportsExecute = false;
    try {
        lang.example = fs.readFileSync(path.join('examples', lang.id, 'default' + lang.extensions[0]), 'utf8');
    } catch (error) {
        lang.example = 'Oops, something went wrong and we could not get the default code for this language.';
    }
});
