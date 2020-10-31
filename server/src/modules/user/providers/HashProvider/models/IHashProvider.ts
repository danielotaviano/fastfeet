export default interface IHashProvider {
  createHash(payload: string): Promise<string>;
  compareHash(payload: string, hashedPayload: string): Promise<boolean>;
}
