/**
 * 用户模型
 */
export class User {
  id: number = 0;
  username: string = '';
  password: string = '';
  nickname: string = '';
  createTime: number = 0;

  constructor(username?: string, password?: string, nickname?: string) {
    if (username && password && nickname) {
      this.username = username;
      this.password = password;
      this.nickname = nickname;
      this.createTime = Date.now();
    }
  }
}
