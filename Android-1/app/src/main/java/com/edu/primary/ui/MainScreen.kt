package com.edu.primary.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.ui.platform.LocalContext
import com.edu.primary.util.DatabaseInitializer
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import com.edu.primary.ui.aiassistant.AIAssistantScreen
import com.edu.primary.ui.practice.PracticeScreen
import com.edu.primary.ui.progress.ProgressScreen
import com.edu.primary.ui.wrongbook.WrongBookScreen
import com.edu.primary.navigation.NavRoutes

data class TabItem(val title: String, val icon: ImageVector, val content: @Composable () -> Unit)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    onNavigateToPracticeDetail: (subjectId: Int, grade: Int) -> Unit,
    onNavigateToPracticeReview: (wrongIds: List<Long>) -> Unit,
    onNavigateToSettings: () -> Unit
) {
    LaunchedEffect(Unit) {
        DatabaseInitializer.initializeMathQuestions(LocalContext.current)
    }
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf(
        TabItem("练习", Icons.Default.List) {
            PracticeScreen(onStartPractice = { s, g -> onNavigateToPracticeDetail(s, g) })
        },
        TabItem("进度", Icons.Default.Info) { ProgressScreen() },
        TabItem("错题本", Icons.Default.Book) {
            WrongBookScreen(onReview = onNavigateToPracticeReview)
        },
        TabItem("AI助手", Icons.Default.Chat) { AIAssistantScreen() }
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("好好学习") },
                actions = {
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Default.Settings, contentDescription = "设置")
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar {
                tabs.forEachIndexed { index, tab ->
                    NavigationBarItem(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        icon = { Icon(tab.icon, contentDescription = tab.title) },
                        label = { Text(tab.title) }
                    )
                }
            }
        }
    ) { padding ->
        Box(Modifier.padding(padding)) {
            tabs[selectedTab].content()
        }
    }
}
