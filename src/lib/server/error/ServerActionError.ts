
export default class ServerActionError extends Error {
  code: string;
  
  constructor(code: string, message?: string) {
    super(message);
    this.code = code || 'UNKNOWN_ERROR';
  }
}
