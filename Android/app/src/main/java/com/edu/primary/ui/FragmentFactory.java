package com.edu.primary.ui;

import androidx.fragment.app.Fragment;
import com.edu.primary.ui.aiassistant.AIAssistantFragment;
import com.edu.primary.ui.practice.PracticeFragment;
import com.edu.primary.ui.progress.ProgressFragment;
import com.edu.primary.ui.wrongbook.WrongBookFragment;

/**
 * Fragment工厂类（工厂模式）
 * 统一管理Fragment的创建，避免重复创建
 */
public class FragmentFactory {
    
    private FragmentFactory() {
        // 工具类，禁止实例化
    }
    
    /**
     * 根据导航ID创建Fragment
     * @param navItemId 导航项ID
     * @return Fragment实例
     */
    public static Fragment createFragment(int navItemId) {
        if (navItemId == com.edu.primary.R.id.nav_practice) {
            return new PracticeFragment();
        } else if (navItemId == com.edu.primary.R.id.nav_progress) {
            return new ProgressFragment();
        } else if (navItemId == com.edu.primary.R.id.nav_wrong_book) {
            return new WrongBookFragment();
        } else if (navItemId == com.edu.primary.R.id.nav_ai_assistant) {
            return new AIAssistantFragment();
        }
        return null;
    }
}
