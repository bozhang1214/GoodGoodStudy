import { User } from '../model/User';

/**
 * 用户仓库接口
 * 定义用户相关的数据操作接口，提高可测试性和可维护性
 */
export interface IUserRepository {
  /**
   * 初始化仓库
   */
  init(): Promise<void>;

  /**
   * 注册用户
   */
  register(username: string, password: string, nickname: string): Promise<{ userId: number, user: User }>;

  /**
   * 登录
   */
  login(username: string, password: string): Promise<User>;

  /**
   * 注册并登录
   */
  registerAndLogin(username: string, password: string, nickname: string): Promise<User>;

  /**
   * 登出
   */
  logout(): Promise<void>;

  /**
   * 检查是否已登录
   */
  isLoggedIn(): Promise<boolean>;

  /**
   * 获取当前用户ID
   */
  getCurrentUserId(): Promise<number>;

  /**
   * 获取当前用户名
   */
  getCurrentUsername(): Promise<string>;

  /**
   * 获取当前用户
   */
  getCurrentUser(): Promise<User | null>;
}
