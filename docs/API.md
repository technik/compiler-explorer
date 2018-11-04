# RESTful API

There's a simple restful API that can be used to do compiles to asm and to
 list compilers. In general all handlers live in `/api/*` endpoints, will
 accept JSON or text in POSTs, and will return text or JSON responses depending
 on the request's `Accept` header.

At a later date there may be some form of rate-limiting:
 currently, requests will be queued and dealt with in the same way interactive
 requests are done for the main site. Authentication might be required at some
 point in the future (for the main **Compiler Explorer** site anyway).

## Endpoints

### `GET /api/languages` - return a list of languages

Returns a list of the currently supported languages, as pairs of languages IDs
 and their names.

### `GET /api/compilers` - return a list of compilers

Returns a list of compilers. In text form, there's a simple formatting of the
 ID of the compiler, its description and its language ID. In JSON, all the
 information is returned as an array of compilers, with the `id` key being the
 primary identifier of each compiler.

### `GET /api/compilers/<language-id>` - return a list of compilers with matching language

Returns a list of compilers for the provided language id. In text form,
 there's a simple formatting of the ID of the compiler, its description and its
 language ID. In JSON, all the information is returned as an array of compilers,
 with the `id` key being the primary identifier of each compiler.

### `GET /api/libraries/<language-id>` - return a list of libraries available with for a language

Returns a list of libraries and library versions available for the provided language id.
 This request only returns data in JSON.

You can use the given include paths to supply in the userArguments for compilation.

###  `GET /api/shortlinkinfo/<linkid>` - return information about a given link

Returns information like Sourcecode, Compiler settings and libraries for a given link id.
 This request only returns data in JSON.

### `POST /api/compiler/<compiler-id>/compile` - perform a compilation

To specify a compilation request as a JSON document, post it as the appropriate
 type and send an object of the form:
```JSON
{
    "source": "Source to compile",
    "options": {
        "userArguments": "Compiler flags",
        "compilerOptions": {},
        "filters": {
            "filter": true
        },
        "tools": []
    }
}
``` 

The filters are a JSON object with `true`/`false` values. If not supplied,
 defaults are used. If supplied, the filters are used as-is.
 The `compilerOptions` is used to pass extra arguments to the back end, and is
 probably not useful for most REST users.

To force a cache bypass, set `bypassCache` in the root of the request to `true`.

A text compilation request has the source as the body of the post, and uses
 query parameters to pass the options and filters. Filters are supplied as a
 comma-separated string. Use the query parameter `filters=XX` to set the
 filters directly, else `addFilters=XX` to add a filter to defaults,
 or `removeFilters` to remove from defaults.
 Compiler parameters should be passed as `options=-O2` and default to empty.

Filters include `binary`, `labels`, `intel`, `comments`, `directives` and
 `demangle`, which correspond to the UI buttons on the HTML version.

With the tools array you can ask CE to execute certain tools available for
 the current compiler, and also supply arguments for this tool.
 For example: ```"tools": [{"id":"clangtidytrunk","args":"-checks=*"}]```
 to execute clang-tidy with all checks enabled.

The text request is designed for simplicity for command-line clients like `curl`

```bash
$ curl 'https://godbolt.org/api/compiler/g63/compile?options=-Wall' --data-binary 'int foo() { return 1; }'
# Compilation provided by Compiler Explorer at godbolt.org
foo():
        push    rbp
        mov     rbp, rsp
        mov     eax, 1
        pop     rbp
        ret
```

If JSON is present in the request's `Accept` header, the compilation results
 are of the form:

(_Optional values are marked with a `**`_)

```javascript
{
  "code": 0 if successful, else compiler return code,
  "stdout": [
            {
              "text": Output,
              ** "tag": {
                          "line": Source line,
                          "text": Parsed error for that line
                 }
            },
            ...
  ],
  "stderr": (format is similar to that of stdout),
  "asm": [
         {
           "text": Assembly text,
           "source": {file: null for user input, else path, line: number} or null if none
         },
         ...
  ],
  "tools": [],
  "okToCache": true if output could be locally cached else false,
  ** "optOutput" : {
                     "displayString" : String displayed in output,
                     "Pass" : [ Missed | Passed | Analysis ] (Specifies the type of optimisation output),
                     "Name" : Name of the output (mostly represents the reason for the output),
                     "DebugLoc" : {
                        "File": Name of file,
                        "Line": Line number,
                        "Column": Column number in line
                     },
                     "Function": Name of function for which optimisation output is provided,
                     "Args": Array of objects representing the arguments that the optimiser used when trying to optimise
     }
}
```

# Implementations

Here are some examples of projects using the Compiler Explorer API:
* [Commandline CE by ethanhs](https://github.com/ethanhs/cce) (Rust)
* [VIM plugin by ldrumm](https://github.com/ldrumm/compiler-explorer.vim)
* [API in Delphi by partouf](https://github.com/partouf/compilerexplorer-api) (Delphi)
* [QTCreator Plugin by dobokirisame](https://github.com/dobokirisame/CompilerExplorer) (C++)
* [CLion plugin by ogrebenyuk](https://github.com/ogrebenyuk/compilerexplorer) (Java)