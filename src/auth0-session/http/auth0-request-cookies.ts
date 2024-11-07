export default abstract class Auth0RequestCookies {
  public abstract getCookies(): Promise<Record<string, string>>;
}
