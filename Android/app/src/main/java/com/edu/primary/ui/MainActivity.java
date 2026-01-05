package com.edu.primary.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.edu.primary.R;
import com.edu.primary.ui.aiassistant.AIAssistantFragment;
import com.edu.primary.ui.practice.PracticeFragment;
import com.edu.primary.ui.progress.ProgressFragment;
import com.edu.primary.ui.settings.SettingsActivity;
import com.edu.primary.ui.wrongbook.WrongBookFragment;
import com.edu.primary.repository.UserRepository;

public class MainActivity extends AppCompatActivity {
    private BottomNavigationView bottomNavigation;
    private UserRepository userRepository;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // 显示ActionBar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(R.string.app_name);
        }

        userRepository = new UserRepository(this);

        // 检查登录状�?
        if (!userRepository.isLoggedIn()) {
            startActivity(new Intent(this, com.edu.primary.ui.login.LoginActivity.class));
            finish();
            return;
        }

        bottomNavigation = findViewById(R.id.bottom_navigation);
        bottomNavigation.setOnItemSelectedListener(item -> {
            Fragment fragment = null;
            int itemId = item.getItemId();
            
            if (itemId == R.id.nav_practice) {
                fragment = new PracticeFragment();
            } else if (itemId == R.id.nav_progress) {
                fragment = new ProgressFragment();
            } else if (itemId == R.id.nav_wrong_book) {
                fragment = new WrongBookFragment();
            } else if (itemId == R.id.nav_ai_assistant) {
                fragment = new AIAssistantFragment();
            }

            if (fragment != null) {
                getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, fragment)
                    .commit();
                return true;
            }
            return false;
        });

        // 默认显示练习页面
        if (savedInstanceState == null) {
            bottomNavigation.setSelectedItemId(R.id.nav_practice);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.menu_settings) {
            startActivity(new Intent(this, SettingsActivity.class));
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}

