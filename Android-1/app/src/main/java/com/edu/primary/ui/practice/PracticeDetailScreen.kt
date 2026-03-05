package com.edu.primary.ui.practice

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.edu.primary.util.AppConstants
import com.edu.primary.ui.ViewModelFactory

@Composable
fun PracticeDetailScreen(
    subjectId: Int,
    grade: Int,
    wrongIds: List<Long>?,
    isReviewMode: Boolean,
    onBack: () -> Unit,
    viewModel: PracticeDetailViewModel = viewModel(
        factory = ViewModelFactory(LocalContext.current.applicationContext as com.edu.primary.GoodGoodStudyApp)
    )
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(subjectId, grade, wrongIds) {
        viewModel.loadQuestions(subjectId, grade, wrongIds)
    }

    val questions = uiState.questions
    if (questions.isEmpty() && !uiState.loading) {
        Text("暂无题目")
        return
    }
    val idx = uiState.currentIndex.coerceIn(0, questions.size - 1)
    val q = questions.getOrNull(idx) ?: return

    val scrollState = rememberScrollState()

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            TextButton(onClick = onBack) { Text("返回") }
            Text("第 ${idx + 1} 题 / 共 ${questions.size} 题")
        }
        Spacer(Modifier.height(8.dp))
        Column(Modifier.weight(1f).verticalScroll(scrollState)) {
            Text(q.content, style = MaterialTheme.typography.bodyLarge)
            Spacer(Modifier.height(16.dp))
            when (q.type) {
                AppConstants.QUESTION_TYPE_SINGLE_CHOICE,
                AppConstants.QUESTION_TYPE_JUDGMENT -> {
                    val options = q.options ?: listOf("正确", "错误")
                    val currentAnswer = uiState.tempAnswers[q.id]
                    options.forEach { opt ->
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .padding(4.dp),
                            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = currentAnswer == opt,
                                onClick = { viewModel.setAnswer(q.id, opt) }
                            )
                            Text(opt)
                        }
                    }
                }
                AppConstants.QUESTION_TYPE_FILL_BLANK -> {
                    OutlinedTextField(
                        value = uiState.tempAnswers[q.id] ?: "",
                        onValueChange = { viewModel.setAnswer(q.id, it) },
                        label = { Text("答案") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                else -> {}
            }
        }
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            TextButton(
                onClick = { viewModel.previousQuestion() },
                enabled = idx > 0
            ) { Text("上一题") }
            TextButton(
                onClick = { viewModel.nextQuestion() },
                enabled = idx < questions.size - 1
            ) { Text("下一题") }
        }
        if (!uiState.allSubmitted) {
            val allAnswered = questions.all { uiState.tempAnswers[it.id]?.trim()?.isNotEmpty() == true }
            Button(
                onClick = { viewModel.submitAll(isReviewMode) },
                modifier = Modifier.fillMaxWidth(),
                enabled = allAnswered
            ) { Text("提交所有答案") }
        } else {
            Text("练习完成！", style = MaterialTheme.typography.titleMedium)
        }
    }

    uiState.resultDialog?.let { dialog ->
        AlertDialog(
            onDismissRequest = { viewModel.dismissResultDialog() },
            title = { Text("批改结果") },
            text = {
                Text("总答题数：${dialog.totalAnswered}\n正确：${dialog.correctCount} 题\n错误：${dialog.wrongCount} 题\n正确率：${if (dialog.totalAnswered > 0) "%.1f".format(dialog.correctCount * 100.0 / dialog.totalAnswered) else 0}%")
            },
            confirmButton = {
                TextButton(onClick = {
                    viewModel.dismissResultDialog()
                    onBack()
                }) { Text("确认") }
            }
        )
    }
}
