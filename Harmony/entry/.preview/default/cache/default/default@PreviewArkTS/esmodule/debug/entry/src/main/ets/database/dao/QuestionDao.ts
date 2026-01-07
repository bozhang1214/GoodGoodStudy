import relationalStore from "@ohos:data.relationalStore";
import { Question } from "@normalized:N&&&entry/src/main/ets/model/Question&";
/**
 * 题目数据访问对象
 */
export class QuestionDao {
    private rdbStore: relationalStore.RdbStore;
    constructor(rdbStore: relationalStore.RdbStore) {
        this.rdbStore = rdbStore;
    }
    /**
     * 插入题目列表
     */
    async insertQuestions(questions: Question[]): Promise<void> {
        for (const question of questions) {
            await this.insertQuestion(question);
        }
    }
    /**
     * 插入单个题目
     */
    async insertQuestion(question: Question): Promise<number> {
        const valueBucket: relationalStore.ValuesBucket = {
            'subjectId': question.subjectId,
            'grade': question.grade,
            'type': question.type,
            'content': question.content,
            'options': JSON.stringify(question.options),
            'correctAnswer': question.correctAnswer,
            'explanation': question.explanation || '',
            'difficulty': question.difficulty
        };
        const insertId = await this.rdbStore.insert('questions', valueBucket);
        return Number(insertId);
    }
    /**
     * 根据科目和年级获取题目
     */
    async getQuestionsBySubjectAndGrade(subjectId: number, grade: number): Promise<Question[]> {
        const predicates = new relationalStore.RdbPredicates('questions');
        predicates.equalTo('subjectId', subjectId);
        predicates.equalTo('grade', grade);
        const resultSet = await this.rdbStore.query(predicates);
        return this.parseQuestions(resultSet);
    }
    /**
     * 根据ID列表获取题目
     */
    async getQuestionsByIds(ids: number[]): Promise<Question[]> {
        if (ids.length === 0) {
            return [];
        }
        const predicates = new relationalStore.RdbPredicates('questions');
        predicates.in('id', ids);
        const resultSet = await this.rdbStore.query(predicates);
        return this.parseQuestions(resultSet);
    }
    /**
     * 根据ID获取题目
     */
    async getQuestionById(id: number): Promise<Question | null> {
        const predicates = new relationalStore.RdbPredicates('questions');
        predicates.equalTo('id', id);
        const resultSet = await this.rdbStore.query(predicates);
        if (resultSet.goToFirstRow()) {
            const question = this.parseQuestion(resultSet);
            resultSet.close();
            return question;
        }
        resultSet.close();
        return null;
    }
    /**
     * 获取题目数量
     */
    async getQuestionCount(subjectId: number, grade: number): Promise<number> {
        const predicates = new relationalStore.RdbPredicates('questions');
        predicates.equalTo('subjectId', subjectId);
        predicates.equalTo('grade', grade);
        const resultSet = await this.rdbStore.query(predicates, ['id']);
        let count = 0;
        while (resultSet.goToNextRow()) {
            count++;
        }
        resultSet.close();
        return count;
    }
    /**
     * 解析题目列表
     */
    private parseQuestions(resultSet: relationalStore.ResultSet): Question[] {
        const questions: Question[] = [];
        while (resultSet.goToNextRow()) {
            questions.push(this.parseQuestion(resultSet));
        }
        return questions;
    }
    /**
     * 解析单个题目
     */
    private parseQuestion(resultSet: relationalStore.ResultSet): Question {
        const question = new Question();
        question.id = resultSet.getLong(resultSet.getColumnIndex('id'));
        question.subjectId = resultSet.getLong(resultSet.getColumnIndex('subjectId'));
        question.grade = resultSet.getLong(resultSet.getColumnIndex('grade'));
        question.type = resultSet.getString(resultSet.getColumnIndex('type'));
        question.content = resultSet.getString(resultSet.getColumnIndex('content'));
        const optionsStr = resultSet.getString(resultSet.getColumnIndex('options'));
        try {
            question.options = JSON.parse(optionsStr) as string[];
        }
        catch {
            question.options = [];
        }
        question.correctAnswer = resultSet.getString(resultSet.getColumnIndex('correctAnswer'));
        question.explanation = resultSet.getString(resultSet.getColumnIndex('explanation')) || '';
        question.difficulty = resultSet.getLong(resultSet.getColumnIndex('difficulty'));
        return question;
    }
}
