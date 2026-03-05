import md5 from 'js-md5';

/** 与 Android-1 PasswordUtil 一致：MD5 十六进制小写 */
export function encrypt(password: string | null | undefined): string {
  if (password == null || password === '') return '';
  try {
    return md5(password);
  } catch {
    return password as string;
  }
}

export function verify(
  input: string | null | undefined,
  stored: string | null | undefined,
): boolean {
  return !!(
    input != null &&
    input !== '' &&
    stored != null &&
    stored !== '' &&
    encrypt(input) === stored
  );
}
