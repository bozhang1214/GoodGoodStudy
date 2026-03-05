package com.edu.primary.ui.aiassistant

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
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
fun AIAssistantScreen(
    viewModel: AIAssistantViewModel = viewModel(
        factory = ViewModelFactory(LocalContext.current.applicationContext as com.edu.primary.GoodGoodStudyApp)
    )
) {
    val uiState by viewModel.uiState.collectAsState()
    var input by remember { mutableStateOf("") }
    val listState = rememberLazyListState()

    LaunchedEffect(Unit) { viewModel.loadHistory() }
    LaunchedEffect(uiState.messages.size) {
        if (uiState.messages.isNotEmpty())
            listState.animateScrollToItem(uiState.messages.size - 1)
    }

    Column(Modifier.fillMaxSize()) {
        LazyColumn(
            state = listState,
            modifier = Modifier.weight(1f).padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(uiState.messages) { msg ->
                val isUser = msg.role == AppConstants.ROLE_USER
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
                ) {
                    Surface(
                        color = if (isUser) MaterialTheme.colorScheme.primaryContainer
                        else MaterialTheme.colorScheme.surfaceVariant,
                        shape = MaterialTheme.shapes.medium
                    ) {
                        Text(
                            msg.content,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }
            }
        }
        uiState.error?.let { Text(it, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(8.dp)) }
        Row(
            Modifier
                .fillMaxWidth()
                .padding(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = input,
                onValueChange = { input = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("输入您的问题…") },
                singleLine = false
            )
            Spacer(Modifier.width(8.dp))
            Button(
                onClick = {
                    val msg = input
                    input = ""
                    viewModel.sendMessage(msg) { }
                },
                enabled = !uiState.loading && input.isNotBlank()
            ) {
                Text(if (uiState.loading) "…" else "发送")
            }
        }
    }
}
