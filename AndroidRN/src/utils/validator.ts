import {MIN_GRADE, MAX_GRADE, SUBJECT_CHINESE, SUBJECT_ENGLISH} from '../constants';

/** 与 Android-1 InputValidator 一致 */
export function isValidUsername(username: string | null | undefined): boolean {
  if (username == null || username === '') return false;
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
}

export function isValidPassword(password: string | null | undefined): boolean {
  return !!(password != null && password !== '' && password.length >= 6);
}

export function isValidGrade(grade: number): boolean {
  return grade >= MIN_GRADE && grade <= MAX_GRADE;
}

export function isValidSubjectId(subjectId: number): boolean {
  return subjectId >= SUBJECT_CHINESE && subjectId <= SUBJECT_ENGLISH;
}
