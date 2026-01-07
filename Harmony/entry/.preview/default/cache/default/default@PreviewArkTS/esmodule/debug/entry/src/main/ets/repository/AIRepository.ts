import preferences from "@ohos:data.preferences";
import relationalStore from "@ohos:data.relationalStore";
import { AppConstants } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
import { AppDatabase } from "@normalized:N&&&entry/src/main/ets/database/AppDatabase&";
import { ApiClient } from "@normalized:N&&&entry/src/main/ets/network/ApiClient&";
import { DeepseekRequest, Message } from "@normalized:N&&&entry/src/main/ets/network/model/DeepseekRequest&";
import { getContext } from "@normalized:N&&&entry/src/main/ets/utils/ContextUtil&";
import { getString } from "@normalized:N&&&entry/src/main/ets/utils/ResourceUtil&";
/**
 * AI仓库
 */
export class AIRepository {
    private database: Promise<AppDatabase>;
    private apiClient: ApiClient;
    private prefsStore: preferences.Preferences | null = null;
    constructor() {
        this.database = AppDatabase.getInstance();
        this.apiClient = ApiClient.getInstance();
    }
    /**
     * 初始化
     */
    async init(): Promise<void> {
        if (this.prefsStore) {
            return;
        }
        const context = getContext();
        this.prefsStore = await preferences.getPreferences(context, AppConstants.PREFS_AI);
    }
    /**
     * 设置API密钥
     */
    async setApiKey(apiKey: string): Promise<void> {
        await this.ensureInit();
        await this.prefsStore!.put(AppConstants.KEY_API_KEY, apiKey);
        await this.prefsStore!.flush();
    }
    /**
     * 获取API密钥
     */
    async getApiKey(): Promise<string> {
        await this.ensureInit();
        const value = await this.prefsStore!.get(AppConstants.KEY_API_KEY, '');
        return typeof value === 'string' ? value : '';
    }
    /**
     * 发送消息
     */
    async sendMessage(userId: number, message: string): Promise<string> {
        await this.ensureInit();
        const apiKey = await this.getApiKey();
        if (!apiKey) {
            throw new Error(AppConstants.ERROR_API_KEY_NOT_SET);
        }
        // 保存用户消息到数据库
        const db = await this.database;
        const rdbStore = db.getRdbStore();
        const userMessageBucket = {
            'userId': userId,
            'role': AppConstants.ROLE_USER,
            'content': message,
            'messageTime': Date.now()
        };
        await rdbStore.insert('chat_messages', userMessageBucket);
        // 获取历史消息
        const predicates = new relationalStore.RdbPredicates('chat_messages');
        predicates.equalTo('userId', userId);
        predicates.orderByAsc('messageTime');
        const resultSet = await rdbStore.query(predicates, ['role', 'content']);
        const history: Array<{
            role: string;
            content: string;
        }> = [];
        while (resultSet.goToNextRow()) {
            history.push({
                role: resultSet.getString(resultSet.getColumnIndex('role')),
                content: resultSet.getString(resultSet.getColumnIndex('content'))
            });
        }
        resultSet.close();
        // 限制历史消息数量
        let messages = history;
        if (messages.length > AppConstants.MAX_HISTORY_MESSAGES) {
            messages = messages.slice(-AppConstants.MAX_HISTORY_MESSAGES);
        }
        // 构建请求
        const request = new DeepseekRequest();
        const requestMessages: Message[] = [];
        // 添加系统提示
        requestMessages.push(new Message(AppConstants.ROLE_SYSTEM, getString('ai_system_prompt')));
        // 添加历史消息
        for (const msg of messages) {
            requestMessages.push(new Message(msg.role, msg.content));
        }
        request.messages = requestMessages;
        // 发送API请求
        const response = await this.apiClient.chat(apiKey, request);
        const assistantMessage = response.getContent();
        // 保存助手回复到数据库
        const assistantMessageBucket = {
            'userId': userId,
            'role': AppConstants.ROLE_ASSISTANT,
            'content': assistantMessage,
            'messageTime': Date.now()
        };
        await rdbStore.insert('chat_messages', assistantMessageBucket);
        return assistantMessage;
    }
    /**
     * 获取聊天历史
     */
    async getChatHistory(userId: number): Promise<Array<{
        role: string;
        content: string;
        messageTime: number;
    }>> {
        await this.ensureInit();
        const db = await this.database;
        const rdbStore = db.getRdbStore();
        const predicates = new relationalStore.RdbPredicates('chat_messages');
        predicates.equalTo('userId', userId);
        predicates.orderByAsc('messageTime');
        const resultSet = await rdbStore.query(predicates, ['role', 'content', 'messageTime']);
        const history: Array<{
            role: string;
            content: string;
            messageTime: number;
        }> = [];
        while (resultSet.goToNextRow()) {
            history.push({
                role: resultSet.getString(resultSet.getColumnIndex('role')),
                content: resultSet.getString(resultSet.getColumnIndex('content')),
                messageTime: resultSet.getLong(resultSet.getColumnIndex('messageTime'))
            });
        }
        resultSet.close();
        return history;
    }
    /**
     * 清空聊天历史
     */
    async clearChatHistory(userId: number): Promise<void> {
        await this.ensureInit();
        const db = await this.database;
        const rdbStore = db.getRdbStore();
        const predicates = new relationalStore.RdbPredicates('chat_messages');
        predicates.equalTo('userId', userId);
        await rdbStore.delete(predicates);
    }
    /**
     * 确保已初始化
     */
    private async ensureInit(): Promise<void> {
        if (!this.prefsStore) {
            await this.init();
        }
    }
}
