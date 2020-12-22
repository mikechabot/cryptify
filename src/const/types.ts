/**
 * Supported encoding types
 */
export type BufferEncoding =
  | 'ascii'
  | 'utf8'
  | 'utf-8'
  | 'utf16le'
  | 'ucs2'
  | 'ucs-2'
  | 'base64'
  | 'latin1'
  | 'binary'
  | 'hex';

/**
 * Stream events
 */
export enum StreamEvent {
  Error = 'error',
  Close = 'close',
  Data = 'data',
  End = 'end',
}

/**
 * Available commands
 */
export enum CommandMode {
  Encrypt = 'encrypt',
  Decrypt = 'decrypt',
}

export interface Command {
  mode: CommandMode;
  description: string;
}

export type Commands = Command[];

interface Option {
  label: string;
  description: string;
  defaultValue?: string | boolean;
}

export interface Options {
  [key: string]: Option;
}
