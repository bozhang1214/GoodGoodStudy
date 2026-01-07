import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
/**
 * 输入验证工具类（防御性编程）
 * 提供统一的输入验证方法
 */
export class InputValidator {
    private constructor() {
        // 工具类，禁止实例化
    }
    /**
     * 验证用户名
     * @param username 用户名
     * @returns 是否有效
     */
    static isValidUsername(username: string | null | undefined): boolean {
        if (!username || username.length === 0) {
            return false;
        }
        // 用户名长度3-20个字符，只能包含字母、数字、下划线
        return username.length >= 3 && username.length <= 20
            && /^[a-zA-Z0-9_]+$/.test(username);
    }
    /**
     * 验证密码
     * @param password 密码
     * @returns 是否有效
     */
    static isValidPassword(password: string | null | undefined): boolean {
        if (!password || password.length === 0) {
            return false;
        }
        // 密码长度至少6个字符
        return password.length >= 6;
    }
    /**
     * 验证答案
     * @param answer 答案
     * @returns 是否有效
     */
    static isValidAnswer(answer: string | null | undefined): boolean {
        return answer !== null && answer !== undefined && answer.trim().length > 0;
    }
    /**
     * 验证年级
     * @param grade 年级
     * @returns 是否有效
     */
    static isValidGrade(grade: number): boolean {
        return grade >= AppConstants.MIN_GRADE && grade <= AppConstants.MAX_GRADE;
    }
    /**
     * 验证科目ID
     * @param subjectId 科目ID
     * @returns 是否有效
     */
    static isValidSubjectId(subjectId: number): boolean {
        return subjectId >= AppConstants.SUBJECT_CHINESE && subjectId <= AppConstants.SUBJECT_ENGLISH;
    }
}
