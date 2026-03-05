package com.edu.primary

import android.app.Application
import com.edu.primary.data.repository.AIRepository
import com.edu.primary.data.repository.QuestionRepository
import com.edu.primary.data.repository.UserRepository

/**
 * 应用入口，负责全局依赖提供。
 *
 * 通过懒加载创建并持有 [UserRepository]、[QuestionRepository]、[AIRepository] 单例，
 * 供 [com.edu.primary.ui.ViewModelFactory] 注入到各 ViewModel 使用。
 *
 * 在 AndroidManifest 中通过 `android:name=".GoodGoodStudyApp"` 声明。
 */
class GoodGoodStudyApp : Application() {
    /** 用户登录/注册及当前用户状态的数据仓库。 */
    val userRepository: UserRepository by lazy { UserRepository(this) }
    /** 题目、答题记录、错题本及进度统计的数据仓库。 */
    val questionRepository: QuestionRepository by lazy { QuestionRepository(this) }
    /** AI 聊天记录持久化及规则/TFLite 回复的数据仓库。 */
    val aiRepository: AIRepository by lazy { AIRepository(this) }
}
