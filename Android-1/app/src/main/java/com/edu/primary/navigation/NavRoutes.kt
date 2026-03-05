package com.edu.primary.navigation

/**
 * 导航路由常量与路径构造方法。
 *
 * 与 [androidx.navigation.compose.NavHost] 配合使用，定义登录、主界面、设置、练习详情、错题复习等路由。
 */
object NavRoutes {
    /** 登录页 */
    const val LOGIN = "login"
    /** 主界面（含底部 Tab：练习/进度/错题本/AI 助手） */
    const val MAIN = "main"
    /** 设置页 */
    const val SETTINGS = "settings"
    /** 练习详情：学科 ID + 年级 */
    const val PRACTICE_DETAIL = "practice_detail/{subjectId}/{grade}"
    /** 错题复习：错题 ID 列表，逗号分隔 */
    const val PRACTICE_REVIEW = "practice_review/{wrongIds}"

    /** 构造练习详情路径。 */
    fun practiceDetail(subjectId: Int, grade: Int) = "practice_detail/$subjectId/$grade"
    /** 构造错题复习路径，[wrongIds] 以逗号拼接。 */
    fun practiceReview(wrongIds: List<Long>) = "practice_review/${wrongIds.joinToString(",")}"
}
