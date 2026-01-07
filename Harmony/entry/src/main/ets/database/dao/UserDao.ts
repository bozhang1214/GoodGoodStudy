import relationalStore from '@ohos.data.relationalStore';
import { User } from '../../model/User';
import { ResultSetManager } from '../../utils/ResultSetManager';
import { Logger } from '../../utils/Logger';

/**
 * 用户数据访问对象
 */
export class UserDao {
  private rdbStore: relationalStore.RdbStore;

  constructor(rdbStore: relationalStore.RdbStore) {
    this.rdbStore = rdbStore;
  }

  /**
   * 插入用户
   */
  async insertUser(user: User): Promise<number> {
    const valueBucket: relationalStore.ValuesBucket = {
      'username': user.username,
      'password': user.password,
      'nickname': user.nickname,
      'createTime': user.createTime
    };
    try {
      const insertId = await this.rdbStore.insert('users', valueBucket);
      return Number(insertId);
    } catch (error) {
      // 如果是唯一约束错误，重新抛出以便上层处理
      if (error instanceof Error) {
        const errorMessage = error.message || String(error);
        if (errorMessage.includes('UNIQUE') || errorMessage.includes('unique')) {
          throw new Error('用户名已存在');
        }
      }
      throw error;
    }
  }

  /**
   * 使用事务插入用户并返回用户ID
   * 如果insert返回的ID无效，会在事务中查询获取真实的ID
   */
  async insertUserWithTransaction(user: User): Promise<number> {
    const valueBucket: relationalStore.ValuesBucket = {
      'username': user.username,
      'password': user.password,
      'nickname': user.nickname,
      'createTime': user.createTime
    };
    
    return new Promise<number>((resolve, reject) => {
      this.rdbStore.createTransaction().then((transaction) => {
        try {
          // 在事务中插入
          const insertId = transaction.insertSync('users', valueBucket, relationalStore.ConflictResolution.ON_CONFLICT_ROLLBACK);
          const userId = Number(insertId);
          
          // 如果insert返回的ID无效，在事务中查询
          if (userId <= 0) {
            const predicates = new relationalStore.RdbPredicates('users');
            predicates.equalTo('username', user.username);
            const resultSet = transaction.querySync(predicates, ['id']);
            if (resultSet.goToFirstRow()) {
              const queriedId = resultSet.getLong(resultSet.getColumnIndex('id'));
              resultSet.close();
              transaction.commit();
              resolve(Number(queriedId));
              return;
            }
            resultSet.close();
          }
          
          // 提交事务
          transaction.commit();
          resolve(userId);
        } catch (error) {
          // 回滚事务
          transaction.rollback();
          // 如果是唯一约束错误，重新抛出以便上层处理
          if (error instanceof Error) {
            const errorMessage = error.message || String(error);
            if (errorMessage.includes('UNIQUE') || errorMessage.includes('unique')) {
              reject(new Error('用户名已存在'));
              return;
            }
          }
          reject(error);
        }
      }).catch((err) => {
        reject(new Error(`Transaction creation failed: ${err.message || String(err)}`));
      });
    });
  }

  /**
   * 更新用户
   */
  async updateUser(user: User): Promise<void> {
    const valueBucket: relationalStore.ValuesBucket = {
      'id': user.id,
      'username': user.username,
      'password': user.password,
      'nickname': user.nickname,
      'createTime': user.createTime
    };
    const predicates = new relationalStore.RdbPredicates('users');
    predicates.equalTo('id', user.id);
    await this.rdbStore.update(valueBucket, predicates);
  }

  /**
   * 根据用户名获取用户
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getUserByUsername(username: string): Promise<User | null> {
    const predicates = new relationalStore.RdbPredicates('users');
    predicates.equalTo('username', username);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates, ['id', 'username', 'password', 'nickname', 'createTime']);
      if (resultSet.goToFirstRow()) {
        const user = new User();
        user.id = resultSet.getLong(resultSet.getColumnIndex('id'));
        user.username = resultSet.getString(resultSet.getColumnIndex('username'));
        user.password = resultSet.getString(resultSet.getColumnIndex('password'));
        user.nickname = resultSet.getString(resultSet.getColumnIndex('nickname'));
        user.createTime = resultSet.getLong(resultSet.getColumnIndex('createTime'));
        return user;
      }
      return null;
    } catch (error) {
      Logger.errorWithTag('UserDao', `Failed to get user by username: ${username}`, error as Error);
      throw error;
    } finally {
      // 确保ResultSet被关闭
      ResultSetManager.safeClose(resultSet);
    }
  }

  /**
   * 根据ID获取用户
   * 使用资源管理器确保ResultSet正确关闭
   */
  async getUserById(id: number): Promise<User | null> {
    const predicates = new relationalStore.RdbPredicates('users');
    predicates.equalTo('id', id);
    let resultSet: relationalStore.ResultSet | null = null;
    try {
      resultSet = await this.rdbStore.query(predicates, ['id', 'username', 'password', 'nickname', 'createTime']);
      if (resultSet.goToFirstRow()) {
        const user = new User();
        user.id = resultSet.getLong(resultSet.getColumnIndex('id'));
        user.username = resultSet.getString(resultSet.getColumnIndex('username'));
        user.password = resultSet.getString(resultSet.getColumnIndex('password'));
        user.nickname = resultSet.getString(resultSet.getColumnIndex('nickname'));
        user.createTime = resultSet.getLong(resultSet.getColumnIndex('createTime'));
        return user;
      }
      return null;
    } catch (error) {
      Logger.errorWithTag('UserDao', `Failed to get user by id: ${id}`, error as Error);
      throw error;
    } finally {
      // 确保ResultSet被关闭
      ResultSetManager.safeClose(resultSet);
    }
  }
}
