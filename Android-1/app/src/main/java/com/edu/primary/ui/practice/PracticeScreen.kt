package com.edu.primary.ui.practice

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.edu.primary.util.AppConstants
import com.edu.primary.ui.ViewModelFactory

@Composable
fun PracticeScreen(
    onStartPractice: (subjectId: Int, grade: Int) -> Unit,
    viewModel: PracticeViewModel = viewModel(
        factory = ViewModelFactory(LocalContext.current.applicationContext as com.edu.primary.GoodGoodStudyApp)
    )
) {
    val uiState by viewModel.uiState.collectAsState()
    var subjectIndex by remember { mutableIntStateOf(0) }
    var gradeIndex by remember { mutableIntStateOf(0) }
    val subjects = listOf("语文", "数学", "英语")
    val grades = listOf("一年级", "二年级", "三年级", "四年级", "五年级", "六年级")

    LaunchedEffect(Unit) {
        viewModel.loadQuestionCount(
            subjectIndex + AppConstants.SUBJECT_CHINESE,
            gradeIndex + AppConstants.MIN_GRADE
        )
    }
    LaunchedEffect(subjectIndex, gradeIndex) {
        viewModel.loadQuestionCount(
            subjectIndex + AppConstants.SUBJECT_CHINESE,
            gradeIndex + AppConstants.MIN_GRADE
        )
    }

    Column(Modifier.padding(16.dp)) {
        Text("练习", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(16.dp))
        Text("选择科目")
        Spacer(Modifier.height(8.dp))
        subjects.forEachIndexed { i, s ->
            FilterChip(
                selected = subjectIndex == i,
                onClick = { subjectIndex = i },
                label = { Text(s) }
            )
            Spacer(Modifier.height(4.dp))
        }
        Spacer(Modifier.height(16.dp))
        Text("选择年级")
        Spacer(Modifier.height(8.dp))
        grades.forEachIndexed { i, g ->
            FilterChip(
                selected = gradeIndex == i,
                onClick = { gradeIndex = i },
                label = { Text(g) }
            )
            Spacer(Modifier.height(4.dp))
        }
        Spacer(Modifier.height(24.dp))
        if (uiState.loading) CircularProgressIndicator()
        else uiState.statusMessage?.let { Text(it) }
        Spacer(Modifier.height(16.dp))
        Button(
            onClick = {
                onStartPractice(
                    subjectIndex + AppConstants.SUBJECT_CHINESE,
                    gradeIndex + AppConstants.MIN_GRADE
                )
            },
            enabled = uiState.subjectGradeCount > 0
        ) { Text("开始练习") }
    }
}
