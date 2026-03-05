package com.edu.primary

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.*
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.edu.primary.navigation.NavRoutes
import com.edu.primary.ui.login.LoginScreen
import com.edu.primary.ui.theme.GoodGoodStudyTheme
import com.edu.primary.ui.MainScreen
import com.edu.primary.ui.practice.PracticeDetailScreen
import com.edu.primary.ui.settings.SettingsScreen

/**
 * 单 Activity 入口：托管 [GoodGoodStudyTheme] 与 [NavHost]，根据登录状态决定起始路由（登录页或主界面）。
 * 负责注册登录、主界面、设置、练习详情、错题复习等路由及参数解析。
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val app = application as GoodGoodStudyApp
        setContent {
            GoodGoodStudyTheme {
                val navController = rememberNavController()
                val startDestination = if (app.userRepository.isLoggedIn()) NavRoutes.MAIN else NavRoutes.LOGIN

                NavHost(
                    navController = navController,
                    startDestination = startDestination
                ) {
                    composable(NavRoutes.LOGIN) {
                        LoginScreen(onLoginSuccess = {
                            navController.navigate(NavRoutes.MAIN) {
                                popUpTo(NavRoutes.LOGIN) { inclusive = true }
                            }
                        })
                    }
                    composable(NavRoutes.MAIN) {
                        MainScreen(
                            onNavigateToPracticeDetail = { subjectId, grade ->
                                navController.navigate(NavRoutes.practiceDetail(subjectId, grade))
                            },
                            onNavigateToPracticeReview = { wrongIds ->
                                navController.navigate(NavRoutes.practiceReview(wrongIds))
                            },
                            onNavigateToSettings = {
                                navController.navigate(NavRoutes.SETTINGS)
                            }
                        )
                    }
                    composable(
                        NavRoutes.SETTINGS
                    ) {
                        SettingsScreen(onBack = { navController.popBackStack() })
                    }
                    composable(
                        route = "practice_detail/{subjectId}/{grade}",
                        arguments = listOf(
                            navArgument("subjectId") { type = NavType.IntType },
                            navArgument("grade") { type = NavType.IntType }
                        )
                    ) { backStackEntry ->
                        val subjectId = backStackEntry.arguments?.getInt("subjectId") ?: 1
                        val grade = backStackEntry.arguments?.getInt("grade") ?: 1
                        PracticeDetailScreen(
                            subjectId = subjectId,
                            grade = grade,
                            wrongIds = null,
                            isReviewMode = false,
                            onBack = { navController.popBackStack() }
                        )
                    }
                    composable(
                        route = "practice_review/{wrongIds}",
                        arguments = listOf(navArgument("wrongIds") { type = NavType.StringType })
                    ) { backStackEntry ->
                        val wrongIdsStr = backStackEntry.arguments?.getString("wrongIds") ?: ""
                        val wrongIds = wrongIdsStr.split(",").mapNotNull { it.trim().toLongOrNull() }
                        PracticeDetailScreen(
                            subjectId = 0,
                            grade = 0,
                            wrongIds = wrongIds.ifEmpty { null },
                            isReviewMode = true,
                            onBack = { navController.popBackStack() }
                        )
                    }
                }
            }
        }
    }
}
