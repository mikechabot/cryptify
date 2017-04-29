# cryptify
File-based encryption (FBE) with Node.js

- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
  - [CLI](#cli)
  - [Module](#module)
- [Recommendations](#recommendations)
  - [Bash](#bash)
  - [Windows Command Prompt](#cmd)
  - [Windows Powershell](#ps)
- [Password Requirements](#password-req)

## <a name="cryptify#installation">Installation</a>
Yarn or npm
- ```$ npm i -g cryptify```
- ```yarn global add cryptify```

## <a name="cryptify#usage">Usage</a>

Adheres to http://docopt.org/

```$ cryptify <file>... (-e|-d) -p <password> [options]```

### <a name="cryptify#options">Options</a>

| Short | Long | Description | Default | Required |
| ----- | ---- | ----------- | ------- | -------- |
| -e | --encrypt | Encrypt file(s) | | Yes |
| -d | --decrypt | decrypt file(s) | | Yes |
| -p | --password | Cryptographic key | | Yes |
| -c | --cipher | Cipher algorithm | aes-256-cbc-hmac-sha256 | No |
| -r | --return | Return decrypted file(s) contents | | No |
| -n | --encoding | Character encoding of returned file(s) | utf8 | No |
| -l | --log | Debug logging | | No |
| -h | --help | Show help menu | | No |
| -v | --version | Show version | | No |

### <a name="cryptify#cli">CLI</a>

- Encrypt a file with a password:

      $ cryptify ./configuration.props -e -p mySecretKey

- Encrypt some files with debug logging:

      $ cryptify ./foo.json ./bar.json ./baz.json -e -p mySecretKey -l

- Encrypt with a custom [cipher](https://nodejs.org/api/crypto.html#crypto_class_cipher):

      $ cryptify ./config.json  -e -p mySecretKey -c aes-256-cbc

- When decrypting, be sure to use the same cipher:

      $ cryptify ./config.json -d -p mySecretKey -c aes-256-cbc

 - CLI Help

       Cryptify v2.1.1 File-based Encryption Utility
       https://www.npmjs.com/package/cryptify
       Implements Node.js Crypto (https://nodejs.org/api/crypto.html)

       Usage:
          cryptify <file>... -p <password> (-e|-d) [options]
          cryptify ./configuration.props -p mySecretKey -e -c aes-256-cbc
          cryptify ./foo.json ./bar.json -p mySecretKey --decrypt --log
          cryptify --version

       Required Commands:
          -e --encrypt               Encrypt the file(s)
          -d --decrypt               Decrypt the file(s)

       Required Arguments:
          -p --password              Cryptographic key

        Optional Arguments:
           -c --cipher <algorithm>   Cipher algorithm (Default: aes-256-cbc-hmac-sha256)
           -r --return               Return decrypted file(s) in Promise
           -n --encoding <encoding>  Character encoding of returned file(s) (Default: utf8)
           -l --log                  Enable debug log
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

### <a name="cryptify#module">Module</a>
#### <a name="cryptify#commonjs">CommonJS</a>
Mimic CLI usage by passing in an argument list.
```javascript
const cryptify = require('cryptify/lib/cli');

// Encrypt the file
cryptify(['./configuration.props', '-e', '-p', 'mySecretKey'])

// Decrypt the file, and get contents
cryptify(['./configuration.props', '-d', '-p', 'mySecretKey', '-r'])
    .then(files => ({
        // Do stuff
    })
    .catch(error => ({
        console.log('Error decrypting file', error);
    });
```

#### <a name="cryptify#es2015">ES2015</a>

## <a name="cryptify#password-req">Password Requirements</a>
1. Must contain at least 8 characters
2. Must contain at least 1 [special character](https://www.owasp.org/index.php/Password_special_characters)
3. Must contain at least 1 numeric character
4. Must contain a combination of uppercase and lowercase

## <a name="cryptify#recommendations">Recommendations</a>
Strongly consider clearing your shell's session history of any sensitive information.

### <a name="cryptify#bash">Bash</a>
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
### <a name="cryptify#cmd">Windows Command Prompt</a>
Windows does not store history between command prompt sessions.
1. However, for safety, consider [decreasing the `Buffer Size` and `Number of Buffers`](http://imgur.com/a/osdRm)  in the Properties menu before use.
2. Per [this configuration](http://imgur.com/a/osdRm), Windows will only store the last command in the buffer.
3. Once work with `cryptify` is complete, close the command prompt:

        C:\Users\[user]> cryptify ./myfile.txt -e -p mySecretKey
        C:\Users\[user]> exit

### <a name="cryptify#ps">Windows PowerShell</a>
1. PowerShell's [`Clear-History`](https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.core/clear-history) command [doesn't seem to work](https://blogs.msdn.microsoft.com/stevelasker/2016/03/25/clear-history-powershell-doesnt-clear-the-history-3/) as advertised, which is designed to clear the current session's history.
2. However, deleting the file PowerShell's history does do the trick.

        PS C:\Users\[user]> cryptify ./myfile.txt -e -p mySecretKey
        PS C:\Users\[user]> del (Get-PSReadlineOption).HistorySavePath
        PS C:\Users\[user]> exit
