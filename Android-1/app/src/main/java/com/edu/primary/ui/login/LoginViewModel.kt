package com.edu.primary.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edu.primary.data.repository.UserRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** 登录/注册界面 UI 状态。 */
data class LoginUiState(
    val loading: Boolean = false,
    val error: String? = null,
    val loginSuccess: Boolean = false
)

/**
 * 登录页 ViewModel：调用 [UserRepository] 完成登录、注册，通过 [uiState] 驱动 UI。
 */
class LoginViewModel(private val userRepository: UserRepository) : ViewModel() {
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun login(username: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            userRepository.login(username, password)
                .onSuccess {
                    _uiState.value = _uiState.value.copy(loading = false, loginSuccess = true)
                }
                .onFailure { e ->
                    _uiState.value = _uiState.value.copy(
                        loading = false,
                        error = e.message ?: "登录失败"
                    )
                }
        }
    }

    fun register(username: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            userRepository.register(username, password, username)
                .onSuccess { _ ->
                    userRepository.login(username, password)
                        .onSuccess {
                            _uiState.value = _uiState.value.copy(loading = false, loginSuccess = true)
                        }
                        .onFailure { e ->
                            _uiState.value = _uiState.value.copy(loading = false, error = e.message)
                        }
                }
                .onFailure { e ->
                    _uiState.value = _uiState.value.copy(
                        loading = false,
                        error = e.message ?: "注册失败"
                    )
                }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
