import { Auth0NextResponseCookies } from '../../src/http';
import { NextResponse } from 'next/server';

describe('auth0-next-response', () => {
  it('should set a cookie', async () => {
    const cookies = new Auth0NextResponseCookies();
    const res = new NextResponse();
    jest.doMock('next/headers', () => ({ cookies: () => Promise.resolve(res.cookies) }));
    await cookies.setCookie('foo', 'bar');
    expect(res.cookies.get('foo')?.value).toEqual('bar');
  });

  it('should not throw when setting a cookie fails', async () => {
    const cookies = new Auth0NextResponseCookies();
    jest.doMock('next/headers', () => ({
      cookies() {
        return Promise.resolve({
          set: () => {
            throw new Error();
          }
        } as any);
      }
    }));
    expect(async () => await cookies.setCookie('foo', 'bar')).not.toThrow();
  });

  it('should delete cookies', async () => {
    const cookies = new Auth0NextResponseCookies();
    const res = new NextResponse();
    jest.doMock('next/headers', () => ({ cookies: () => Promise.resolve(res.cookies) }));
    await cookies.clearCookie('foo');
    expect(res.headers.get('set-cookie')).toEqual('foo=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });

  it('should delete cookies with a domain', async () => {
    const cookies = new Auth0NextResponseCookies();
    const res = new NextResponse();
    jest.doMock('next/headers', () => ({ cookies: () => Promise.resolve(res.cookies) }));
    await cookies.clearCookie('foo', { domain: 'example.com' });
    expect(res.headers.get('set-cookie')).toEqual(
      'foo=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=example.com'
    );
  });

  it('should delete cookies with a path', async () => {
    const cookies = new Auth0NextResponseCookies();
    const res = new NextResponse();
    jest.doMock('next/headers', () => ({ cookies: () => Promise.resolve(res.cookies) }));
    await cookies.clearCookie('foo', { path: '/foo' });
    expect(res.headers.get('set-cookie')).toEqual('foo=; Path=/foo; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });

  it('should not throw when deleting a cookie fails', async () => {
    const cookies = new Auth0NextResponseCookies();
    jest.doMock('next/headers', () => ({
      cookies() {
        return Promise.resolve({
          delete: () => {
            throw new Error();
          }
        } as any);
      }
    }));
    expect(async () => await cookies.clearCookie('foo')).not.toThrow();
  });
});
