package com.edu.primary.ui.progress

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.edu.primary.ui.ViewModelFactory

@Composable
fun ProgressScreen(
    viewModel: ProgressViewModel = viewModel(
        factory = ViewModelFactory(LocalContext.current.applicationContext as com.edu.primary.GoodGoodStudyApp)
    )
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) { viewModel.loadProgress() }

    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("学习进度", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(24.dp))
        uiState.error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
        if (!uiState.loading && uiState.error == null) {
            Card {
                Column(Modifier.padding(24.dp)) {
                    Text("总题数: ${uiState.total}")
                    Text("正确: ${uiState.correct}")
                    Text("正确率: ${"%.1f".format(uiState.accuracy)}%")
                }
            }
        } else if (uiState.loading) {
            CircularProgressIndicator()
        }
    }
}
