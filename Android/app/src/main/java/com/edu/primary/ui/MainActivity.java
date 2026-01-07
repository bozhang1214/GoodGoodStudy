package com.edu.primary.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.edu.primary.R;
import com.edu.primary.ui.settings.SettingsActivity;
import com.edu.primary.repository.UserRepository;
import com.edu.primary.utils.DatabaseInitializer;
import com.edu.primary.utils.Logger;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

public class MainActivity extends AppCompatActivity {
    private BottomNavigationView bottomNavigation;
    private UserRepository userRepository;
    private CompositeDisposable disposables = new CompositeDisposable();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Logger.d("MainActivity", "onCreate");
        
        // 显示ActionBar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(R.string.app_name);
        }

        userRepository = new UserRepository(this);
        
        // 初始化数学题目数据（使用RxJava）
        disposables.add(DatabaseInitializer.initializeMathQuestions(this)
            .subscribe(
                () -> Logger.d("MainActivity", "Math questions initialized"),
                error -> Logger.e("MainActivity", "Failed to initialize math questions", error)
            ));

        // 检查登录状态
        if (!userRepository.isLoggedIn()) {
            Logger.d("MainActivity", "User not logged in, redirecting to LoginActivity");
            startActivity(new Intent(this, com.edu.primary.ui.login.LoginActivity.class));
            finish();
            return;
        }

        bottomNavigation = findViewById(R.id.bottom_navigation);
        bottomNavigation.setOnItemSelectedListener(item -> {
            // 使用工厂模式创建Fragment
            Fragment fragment = FragmentFactory.createFragment(item.getItemId());
            
            if (fragment != null) {
                getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, fragment)
                    .commit();
                Logger.d("MainActivity", "Fragment switched: " + fragment.getClass().getSimpleName());
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
    protected void onDestroy() {
        super.onDestroy();
        if (disposables != null && !disposables.isDisposed()) {
            disposables.clear();
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

