# cryptify

A dead simple file-based encyrption (FBE) utitily for Node.js.

:heart: CLI or module-based usage
<br/>
:heart: Implements [Node.js crypto](https://nodejs.org/api/crypto.html)
<br/>
:heart: Licensed with [GPLv2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
<br/>

<div align="center">
<br />
  <a href="https://www.npmjs.com/package/cryptify">
    <img src="https://img.shields.io/npm/v/cryptify.svg" alt="npm version" />
  </a>
  <a href="https://david-dm.org/mikechabot/cryptify">
    <img src="https://david-dm.org/mikechabot/cryptify.svg" alt="dependency status" />
  </a>
  <a href="https://david-dm.org/mikechabot/cryptify?type=dev">
    <img src="https://david-dm.org/mikechabot/cryptify/dev-status.svg" alt="devDependency status" />
  </a>
</div>

<hr />

# Table of Contents

- [CLI](#cli)
  - [Installation](#cli-installation)
  - [Usage](#usage)
- [Module](#module)
  - [Installation](#module-installation)
  - [CommonJS](#commonjs)
  - [ES2015](#es2015)
- [Supported Ciphers](#ciphers)
- [Recommendations](#recommendations)
  - [Bash](#bash)
  - [Windows Command Prompt](#cmd)
  - [Windows Powershell](#ps)
- [Password Requirements](#password-req)

<hr />

## <a id="cli">CLI</a>

### <a id="cli-installation">Installation</a>
- ```$ npm i -g cryptify```

### <a id="usage">Usage</a>

Adheres to http://docopt.org/ via [commander.js](https://github.com/tj/commander.js/)

    $ cryptify encrypt <file>... (-p <password>) [-c <cipher>] [-e <encoding>] [-s]
    $ cryptify decrypt <file>... (-p <password>) [-c <cipher>] [-e <encoding>] [-s]
    
### Commands

| Command | Description |
| --------- | --------------- |
| `encrypt` | Encrypt file(s) |
| `decrypt` | Decrypt file(s) |

### Command Arguments

| Short | Long | Description | Default | Required |
| ----- | ---- | ----------- | ------- | -------- |
| `-p` | `--password` | Cryptographic key | | Yes |
| `-c` | `--cipher` | Cipher algorithm | `aes-256-cbc` | No |
| `-e` | `--encoding` | Character encoding of returned file(s) | `utf8` | No |
| `-s` | `--silent` | Silence informational display | `false` | No |

### General Arguments

| Short | Long | Description |
| ----- | ---- | ----------- |
| `-h` | `--help` | Display help |
| `-v` | `--version` | Show version |
| `-l` | `--list` | List available ciphers |

#### Encrypt a file with a password

    $ cryptify encrypt ./configuration.props -p mySecretKey

#### Encrypt some files with a custom [cipher](https://nodejs.org/api/crypto.html#crypto_class_cipher)

    $ cryptify encrypt ./foo.json ./bar.jpg -p mySecretKey -c aes-256-cbc-hmac-sha256

#### Decrypt some files with a custom [cipher](https://nodejs.org/api/crypto.html#crypto_class_cipher)

    $ cryptify decrypt ./foo.json ./bar.jpg -p mySecretKey -c aes-256-cbc-hmac-sha256

#### Show general help

```bash
$ cryptify help encrypt

Usage: cryptify [options] [command]

Options:
  -v, --version                Display the current version
  -l, --list                   List available ciphers
  -h, --help                   Display help for the command

Commands:
  encrypt [options] <file...>  Encrypt files(s)
  decrypt [options] <file...>  Decrypt files(s)
  help <command>               Display help for the command

Example:
  $ cryptify encrypt file.txt -p 'Secret123!'
  $ cryptify decrypt file.txt -p 'Secret123!'

Password Requirements:
  1. Must contain at least 8 characters
  2. Must contain at least 1 special character
  3. Must contain at least 1 numeric character
  4. Must contain a combination of uppercase and lowercase
```

#### Show command help

```bash
$ cryptify help encrypt

Usage: cryptify encrypt <file>... (-p <password>) [-c <cipher>] [-e <encoding>] [-s]

Encrypt files(s)

Options:
  -p, --password <password>  Cryptographic key
  -c, --cipher <cipher>      Cipher algorithm (default: "aes-256-cbc")
  -e, --encoding <encoding>  Character encoding (default: "utf8")
  -s, --silent               Silence informational display (default: false)
  -h, --help                 Display help for the command
```
----

## <a id="module">Module</a>

### <a id="module-installation">Installation</a>
- ```$ npm i -S cryptify```

### <a id="commonjs">CommonJS</a>

```const Cryptify = require('cryptify');```

### <a id="es2015">ES2015</a>

```import Cryptify from 'cryptify';```

#### Constructor

```new Cryptify(files, password[, cipher][, encoding][, silent])```

#### Encrypt / Decrypt

```javascript
import Cryptify from 'cryptify';

const filePath = './example.txt';
const password = process.env.ENV_SECRET_KEY;

const instance = new Cryptify(filePath, password);
instance
    .encrypt()
    .then(files => { /* Do stuff */ })
    .then(() => instance.decrypt())
    .then(files => { /* Do stuff */ })
    .catch(e => console.error(e));
```

#### Decrypt / Encrypt

```javascript
import Cryptify from 'cryptify';

const filePath = './example.txt';
const password = process.env.ENV_SECRET_KEY;

const instance = new Cryptify(filePath, password);
instance
    .decrypt()
    .then(files => { /* Do stuff */ })
    .then(() => instance.encrypt())
    .then(files => { /* Do stuff */ })
    .catch(e => console.error(e));
```

----

## Supported Ciphers

The following ciphers are supported by `cryptify`:

```
Running cipher validation tests...

 ✓ Passed: aes-128-cbc
 ✓ Passed: aes-128-cbc-hmac-sha1
 ✓ Passed: aes-128-cbc-hmac-sha256
 ✓ Passed: aes-128-cfb
 ✓ Passed: aes-128-cfb1
 ✓ Passed: aes-128-cfb8
 ✓ Passed: aes-128-ctr
 ✓ Passed: aes-128-ofb
 ✓ Passed: aes-192-cbc
 ✓ Passed: aes-192-cfb
 ✓ Passed: aes-192-cfb1
 ✓ Passed: aes-192-cfb8
 ✓ Passed: aes-192-ctr
 ✓ Passed: aes-192-ofb
 ✓ Passed: aes-256-cbc
 ✓ Passed: aes-256-cbc-hmac-sha1
 ✓ Passed: aes-256-cbc-hmac-sha256
 ✓ Passed: aes-256-cfb
 ✓ Passed: aes-256-cfb1
 ✓ Passed: aes-256-cfb8
 ✓ Passed: aes-256-ctr
 ✓ Passed: aes-256-ofb
 ✓ Passed: aes128
 ✓ Passed: aes192
 ✓ Passed: aes256
 ✓ Passed: aria-128-cbc
 ✓ Passed: aria-128-cfb
 ✓ Passed: aria-128-cfb1
 ✓ Passed: aria-128-cfb8
 ✓ Passed: aria-128-ctr
 ✓ Passed: aria-128-ofb
 ✓ Passed: aria-192-cbc
 ✓ Passed: aria-192-cfb
 ✓ Passed: aria-192-cfb1
 ✓ Passed: aria-192-cfb8
 ✓ Passed: aria-192-ctr
 ✓ Passed: aria-192-ofb
 ✓ Passed: aria-256-cbc
 ✓ Passed: aria-256-cfb
 ✓ Passed: aria-256-cfb1
 ✓ Passed: aria-256-cfb8
 ✓ Passed: aria-256-ctr
 ✓ Passed: aria-256-ofb
 ✓ Passed: aria128
 ✓ Passed: aria192
 ✓ Passed: aria256
 ✓ Passed: camellia-128-cbc
 ✓ Passed: camellia-128-cfb
 ✓ Passed: camellia-128-cfb1
 ✓ Passed: camellia-128-cfb8
 ✓ Passed: camellia-128-ctr
 ✓ Passed: camellia-128-ofb
 ✓ Passed: camellia-192-cbc
 ✓ Passed: camellia-192-cfb
 ✓ Passed: camellia-192-cfb1
 ✓ Passed: camellia-192-cfb8
 ✓ Passed: camellia-192-ctr
 ✓ Passed: camellia-192-ofb
 ✓ Passed: camellia-256-cbc
 ✓ Passed: camellia-256-cfb
 ✓ Passed: camellia-256-cfb1
 ✓ Passed: camellia-256-cfb8
 ✓ Passed: camellia-256-ctr
 ✓ Passed: camellia-256-ofb
 ✓ Passed: camellia128
 ✓ Passed: camellia192
 ✓ Passed: camellia256
 ✓ Passed: chacha20

 ✓ Results: 68 passed, 107 total

```

----

## <a id="recommendations">Recommendations</a>
Strongly consider clearing your shell's session history of any sensitive information.

### <a id="bash">Bash</a>
Bash writes the current session history to disk (`~/.bash_history`) at the end of the session.

1. **Tactical Approach:** Clear a specific entry in the current session

        $ history
        666 cryptify --help
        667 cryptify encrypt ./myfile.txt -p mySecretKey
        $ history -d 667
        $ history -w

2. **Blunt Approach:** Clear the entire current session history (in memory)

        $ history -c

3. **Nuclear Approach:** Clear current and existing session history (in memory, and on disk)

        $ rm $HISTFILE
        $ history -c
        $ exit
        (open shell)
        $ cat $HISTFILE
        exit

### <a id="cmd">Windows Command Prompt</a>
Windows does not store history between command prompt sessions.
1. However, for safety, consider [decreasing the `Buffer Size` and `Number of Buffers`](http://imgur.com/a/osdRm)  in the Properties menu before use.
2. Per [this configuration](http://imgur.com/a/osdRm), Windows will only store the last command in the buffer.
3. Once work with `cryptify` is complete, close the command prompt:

        C:\Users\[user]> cryptify encrypt ./myfile.txt -p mySecretKey
        C:\Users\[user]> exit

### <a id="ps">Windows PowerShell</a>
1. PowerShell's [`Clear-History`](https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.core/clear-history) command [doesn't seem to work](https://blogs.msdn.microsoft.com/stevelasker/2016/03/25/clear-history-powershell-doesnt-clear-the-history-3/) as advertised, which is designed to clear the current session's history.
2. However, deleting PowerShell's history file does do the trick.

        PS C:\Users\[user]> cryptify encrypt ./myfile.txt -p mySecretKey
        PS C:\Users\[user]> del (Get-PSReadlineOption).HistorySavePath
        PS C:\Users\[user]> exit
        
----

## <a id="password-req">Password Requirements</a>
1. Must contain at least 8 characters
2. Must contain at least 1 [special character](https://www.owasp.org/index.php/Password_special_characters)
3. Must contain at least 1 numeric character
4. Must contain a combination of uppercase and lowercase
