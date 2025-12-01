declare type NextFunction = (...args: any[]) => void
declare interface IncomingMessageWithBody extends NodeJS.ReadableStream {
  body?: any
  on: any
}
