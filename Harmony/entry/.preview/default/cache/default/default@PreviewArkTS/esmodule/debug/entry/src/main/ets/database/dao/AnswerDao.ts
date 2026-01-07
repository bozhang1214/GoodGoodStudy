import relationalStore from "@ohos:data.relationalStore";
/**
 * 答案实体
 */
export interface AnswerEntity {
    id?: number;
    userId: number;
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
    answerTime: number;
}
/**
 * 答案数据访问对象
 */
export class AnswerDao {
    private rdbStore: relationalStore.RdbStore;
    constructor(rdbStore: relationalStore.RdbStore) {
        this.rdbStore = rdbStore;
    }
    /**
     * 插入答案
     */
    async insertAnswer(answer: AnswerEntity): Promise<number> {
        const valueBucket: relationalStore.ValuesBucket = {
            'userId': answer.userId,
            'questionId': answer.questionId,
            'userAnswer': answer.userAnswer,
            'isCorrect': answer.isCorrect ? 1 : 0,
            'answerTime': answer.answerTime
        };
        const insertId = await this.rdbStore.insert('answers', valueBucket);
        return Number(insertId);
    }
    /**
     * 根据用户ID获取答案列表
     */
    async getAnswersByUser(userId: number): Promise<AnswerEntity[]> {
        const predicates = new relationalStore.RdbPredicates('answers');
        predicates.equalTo('userId', userId);
        const resultSet = await this.rdbStore.query(predicates);
        return this.parseAnswers(resultSet);
    }
    /**
     * 获取用户的答案
     */
    async getAnswer(userId: number, questionId: number): Promise<AnswerEntity | null> {
        const predicates = new relationalStore.RdbPredicates('answers');
        predicates.equalTo('userId', userId);
        predicates.equalTo('questionId', questionId);
        const resultSet = await this.rdbStore.query(predicates);
        if (resultSet.goToFirstRow()) {
            const answer = this.parseAnswer(resultSet);
            resultSet.close();
            return answer;
        }
        resultSet.close();
        return null;
    }
    /**
     * 获取用户答对的数量
     */
    async getCorrectCount(userId: number): Promise<number> {
        const predicates = new relationalStore.RdbPredicates('answers');
        predicates.equalTo('userId', userId);
        predicates.equalTo('isCorrect', 1);
        const resultSet = await this.rdbStore.query(predicates, ['id']);
        let count = 0;
        while (resultSet.goToNextRow()) {
            count++;
        }
        resultSet.close();
        return count;
    }
    /**
     * 获取用户答题总数
     */
    async getTotalCount(userId: number): Promise<number> {
        const predicates = new relationalStore.RdbPredicates('answers');
        predicates.equalTo('userId', userId);
        const resultSet = await this.rdbStore.query(predicates, ['id']);
        let count = 0;
        while (resultSet.goToNextRow()) {
            count++;
        }
        resultSet.close();
        return count;
    }
    /**
     * 解析答案列表
     */
    private parseAnswers(resultSet: relationalStore.ResultSet): AnswerEntity[] {
        const answers: AnswerEntity[] = [];
        while (resultSet.goToNextRow()) {
            answers.push(this.parseAnswer(resultSet));
        }
        return answers;
    }
    /**
     * 解析单个答案
     */
    private parseAnswer(resultSet: relationalStore.ResultSet): AnswerEntity {
        return {
            id: resultSet.getLong(resultSet.getColumnIndex('id')),
            userId: resultSet.getLong(resultSet.getColumnIndex('userId')),
            questionId: resultSet.getLong(resultSet.getColumnIndex('questionId')),
            userAnswer: resultSet.getString(resultSet.getColumnIndex('userAnswer')),
            isCorrect: resultSet.getLong(resultSet.getColumnIndex('isCorrect')) === 1,
            answerTime: resultSet.getLong(resultSet.getColumnIndex('answerTime'))
        };
    }
}
