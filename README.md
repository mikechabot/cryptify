# cryptify

A dead simple file-based encyrption (FBE) utitily for Node.js.

:heart: CLI or module-based usage
<br/>
:heart: Implements [Node.js crypto](https://nodejs.org/api/crypto.html)
<br/>
:heart: Zero dependencies
<br/>

<div align="center">
<br />
  <a href="https://www.npmjs.com/package/cryptify">
    <img src="https://img.shields.io/npm/v/cryptify.svg?style=flat-square" alt="npm version" />
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

Adheres to http://docopt.org/

```$ cryptify <file>... (-e|-d) -p <password> [options]```

### Arguments

| Short | Long | Description | Default | Required |
| ----- | ---- | ----------- | ------- | -------- |
| -e | --encrypt | Encrypt file(s) | | Yes |
| -d | --decrypt | Decrypt file(s) | | Yes |
| -p | --password | Cryptographic key | | Yes |
| -c | --cipher | Cipher algorithm | aes-256-cbc-hmac-sha256 | No |
| -n | --encoding | Character encoding of returned file(s) | utf8 | No |
| -l | --list | List available cipher algorithms |  | No |
| -h | --help | Show help menu | | No |
| -v | --version | Show version | | No |

#### Encrypt a file with a password

    $ cryptify ./configuration.props -e -p mySecretKey

#### Encrypt some files with a custom [cipher](https://nodejs.org/api/crypto.html#crypto_class_cipher)

    $ cryptify ./foo.json ./bar.json ./baz.json -e -p mySecretKey -c aes-256-cbc

#### Decrypt some files with a custom [cipher](https://nodejs.org/api/crypto.html#crypto_class_cipher)

> Omit the cipher if the default was used

    $ cryptify ./foo.json ./bar.json ./baz.json -d -p mySecretKey -c aes-256-cbc
      
#### Show help
 
    $ cryptify --help

    Cryptify v3.0.1 File-based Encryption Utility
    https://www.npmjs.com/package/cryptify
    Implements Node.js Crypto (https://nodejs.org/api/crypto.html)

    Usage:
      cryptify <file>... -p <password> (-e|-d) [options]
      cryptify ./configuration.props -p mySecretKey -e -c aes-256-cbc
      cryptify ./foo.json ./bar.json -p mySecretKey --decrypt
      cryptify --version

    Required Commands:
      -e --encrypt               Encrypt the file(s)
      -d --decrypt               Decrypt the file(s)

    Required Arguments:
      -p --password              Cryptographic key

    Optional Arguments:
       -c --cipher <algorithm>   Cipher algorithm (Default: aes-256-cbc-hmac-sha256)
       -n --encoding <encoding>  Character encoding of returned file(s) (Default: utf8)
       -l --list                 List available ciphers
       -h --help                 Show this menu
       -v --version              Show version

    Required Password Wrapping:
       Bash                       single-quotes
       Command Prompt             double-quotes
       PowerShell                 single-quotes

    Password Requirements:
       1) Must contain at least 8 characters
       2) Must contain at least 1 special character
       3) Must contain at least 1 numeric character
       4) Must contain a combination of uppercase and lowercase

----

## <a id="module">Module</a>

### <a id="module-installation">Installation</a>
- ```$ npm i -S cryptify```

### <a id="commonjs">CommonJS</a>

```const Cryptify = require('cryptify');```

### <a id="es2015">ES2015</a>

```import Cryptify from 'cryptify';```

#### Constructor

```new Cryptify(files, password, cipher, encoding)```

#### Encrypt / Decrypt

```javascript
import Cryptify from 'cryptify';

const filePath = './example.txt';
const password = process.env.ENV_SECRET_KEY;

try {
    const instance = new Cryptify(filePath, password);
    instance
      .encrypt()
      .then(files => { /* Do stuff */ })
      .then(() => instance.decrypt())
      .then(files => { /* Do stuff */ })
} catch (error) {
    console.error(error.message);
}
```

#### Decrypt / Encrypt

```javascript
import Cryptify from 'cryptify';

const filePaths = ['./foo.props', './bar.json'];
const password = process.env.ENV_SECRET_KEY;

try {
    const instance = new Cryptify(filePaths, password);
    instance
      .decrypt()
      .then(files => { /* Do stuff */ })
      .then(() => instance.encrypt())
      .then(files => { /* Do stuff */ })
} catch (error) {
    console.error(error.message);
}
```

----

## <a id="password-req">Password Requirements</a>
1. Must contain at least 8 characters
2. Must contain at least 1 [special character](https://www.owasp.org/index.php/Password_special_characters)
3. Must contain at least 1 numeric character
4. Must contain a combination of uppercase and lowercase

## <a id="recommendations">Recommendations</a>
Strongly consider clearing your shell's session history of any sensitive information.

### <a id="bash">Bash</a>
Bash writes the current session history to disk (`~/.bash_history`) at the end of the session.

1. **Tactical Approach:** Clear a specific entry in the current session

        $ history
        666 cryptify --help
        667 cryptify ./myfile.txt -e -p mySecretKey
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

        C:\Users\[user]> cryptify ./myfile.txt -e -p mySecretKey
        C:\Users\[user]> exit

### <a id="ps">Windows PowerShell</a>
1. PowerShell's [`Clear-History`](https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.core/clear-history) command [doesn't seem to work](https://blogs.msdn.microsoft.com/stevelasker/2016/03/25/clear-history-powershell-doesnt-clear-the-history-3/) as advertised, which is designed to clear the current session's history.
2. However, deleting PowerShell's history file does do the trick.

        PS C:\Users\[user]> cryptify ./myfile.txt -e -p mySecretKey
        PS C:\Users\[user]> del (Get-PSReadlineOption).HistorySavePath
        PS C:\Users\[user]> exit
