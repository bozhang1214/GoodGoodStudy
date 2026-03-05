package com.edu.primary.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.edu.primary.GoodGoodStudyApp
import com.edu.primary.ui.aiassistant.AIAssistantViewModel
import com.edu.primary.ui.login.LoginViewModel
import com.edu.primary.ui.practice.PracticeDetailViewModel
import com.edu.primary.ui.practice.PracticeViewModel
import com.edu.primary.ui.progress.ProgressViewModel
import com.edu.primary.ui.wrongbook.WrongBookViewModel

/**
 * 根据 [ViewModel] 类型从 [GoodGoodStudyApp] 注入 Repository，创建对应 ViewModel 实例。
 *
 * 支持的 ViewModel：LoginViewModel、PracticeViewModel、PracticeDetailViewModel、
 * ProgressViewModel、WrongBookViewModel、AIAssistantViewModel。
 *
 * @param app 应用实例，提供 userRepository、questionRepository、aiRepository
 */
class ViewModelFactory(private val app: GoodGoodStudyApp) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return when {
            modelClass.isAssignableFrom(LoginViewModel::class.java) ->
                LoginViewModel(app.userRepository) as T
            modelClass.isAssignableFrom(PracticeViewModel::class.java) ->
                PracticeViewModel(app.questionRepository, app.userRepository) as T
            modelClass.isAssignableFrom(ProgressViewModel::class.java) ->
                ProgressViewModel(app.userRepository, app.questionRepository) as T
            modelClass.isAssignableFrom(WrongBookViewModel::class.java) ->
                WrongBookViewModel(app.userRepository, app.questionRepository) as T
            modelClass.isAssignableFrom(AIAssistantViewModel::class.java) ->
                AIAssistantViewModel(app.userRepository, app.aiRepository) as T
            modelClass.isAssignableFrom(PracticeDetailViewModel::class.java) ->
                PracticeDetailViewModel(app.userRepository, app.questionRepository) as T
            else -> throw IllegalArgumentException("Unknown ViewModel: ${modelClass.name}")
        }
    }
}
