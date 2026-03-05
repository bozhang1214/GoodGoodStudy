package com.edu.primary.ui.settings

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.edu.primary.GoodGoodStudyApp

@Composable
fun SettingsScreen(onBack: () -> Unit) {
    val app = LocalContext.current.applicationContext as GoodGoodStudyApp
    var apiKey by remember { mutableStateOf(app.aiRepository.getApiKey()) }
    var saved by remember { mutableStateOf(false) }

    Column(Modifier.padding(16.dp)) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("设置", style = MaterialTheme.typography.titleLarge)
            TextButton(onClick = onBack) { Text("返回") }
        }
        Spacer(Modifier.height(24.dp))
        OutlinedTextField(
            value = apiKey,
            onValueChange = { apiKey = it },
            label = { Text("Deepseek API 密钥（可选）") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(16.dp))
        Button(onClick = {
            app.aiRepository.setApiKey(apiKey)
            saved = true
        }) { Text("保存") }
        if (saved) Text("已保存", color = MaterialTheme.colorScheme.primary)
    }
}
