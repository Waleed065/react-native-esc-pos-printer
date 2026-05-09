import { Buffer } from 'buffer';

type BufferLoadStream = {
  on(event: 'data', listener: (chunk: Uint8Array) => void): void;
  on(event: 'end', listener: () => void): void;
  once(event: 'error', listener: (error: Error) => void): void;
};

type BufferLoadCallback = (error: Error | null, buffer: Buffer) => void;

export class BufferHelper {
  buffers: Buffer[];
  size: number;

  constructor() {
    this.buffers = [];
    this.size = 0;
  }

  get length() {
    return this.size;
  }

  concat(buffer: Buffer): BufferHelper {
    this.buffers.push(buffer);
    this.size += buffer.length;
    return this;
  }

  empty(): BufferHelper {
    this.buffers = [];
    this.size = 0;
    return this;
  }

  toBuffer(): Buffer {
    if (this.size === 0) {
      return Buffer.alloc(0);
    }

    return Buffer.concat(this.buffers, this.size);
  }

  toString(encoding: BufferEncoding): string {
    return this.toBuffer().toString(encoding);
  }

  load(stream: BufferLoadStream, callback: BufferLoadCallback): void {
    stream.on('data', (chunk: Uint8Array) => {
      this.concat(Buffer.from(chunk));
    });

    stream.on('end', () => {
      callback(null, this.toBuffer());
    });

    stream.once('error', (error: Error) => {
      callback(error, this.toBuffer());
    });
  }

  bytesToString(data: Uint8Array, type: 'base64' | 'hex'): string {
    this.concat(Buffer.from(data));
    const buffer = this.toBuffer();
    return buffer.toString(type);
  }
}
