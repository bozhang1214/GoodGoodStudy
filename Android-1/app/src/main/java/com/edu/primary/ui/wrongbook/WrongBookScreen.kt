package com.edu.primary.ui.wrongbook

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.edu.primary.ui.ViewModelFactory
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun WrongBookScreen(
    onReview: (questionIds: List<Long>) -> Unit,
    viewModel: WrongBookViewModel = viewModel(
        factory = ViewModelFactory(LocalContext.current.applicationContext as com.edu.primary.GoodGoodStudyApp)
    )
) {
    val uiState by viewModel.uiState.collectAsState()
    LaunchedEffect(Unit) { viewModel.loadWrongQuestions() }

    Column(Modifier.padding(16.dp)) {
        Text("错题本", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(16.dp))
        when {
            uiState.loading -> CircularProgressIndicator()
            uiState.error != null -> Text(uiState.error!!, color = MaterialTheme.colorScheme.error)
            uiState.items.isEmpty() -> Text("暂无错题")
            else -> LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(uiState.items) { item ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onReview(listOf(item.questionId)) }
                    ) {
                        Column(Modifier.padding(16.dp)) {
                            Text("题目ID: ${item.questionId}")
                            Text("你的答案: ${item.userAnswer}")
                            Text("时间: ${SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault()).format(Date(item.wrongTime))}")
                            Text("复习次数: ${item.reviewCount}")
                        }
                    }
                }
            }
        }
    }
}
