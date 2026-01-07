package com.edu.primary.ui.login;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.edu.primary.R;
import com.edu.primary.constants.ErrorMessages;
import com.edu.primary.repository.UserRepository;
import com.edu.primary.ui.MainActivity;
import com.edu.primary.utils.InputValidator;
import com.edu.primary.utils.Logger;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

public class LoginActivity extends AppCompatActivity {
    private EditText etUsername, etPassword;
    private Button btnLogin, btnRegister;
    private UserRepository userRepository;
    private CompositeDisposable disposables = new CompositeDisposable();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        userRepository = new UserRepository(this);
        etUsername = findViewById(R.id.et_username);
        etPassword = findViewById(R.id.et_password);
        btnLogin = findViewById(R.id.btn_login);
        btnRegister = findViewById(R.id.btn_register);

        btnLogin.setOnClickListener(v -> login());
        btnRegister.setOnClickListener(v -> register());
    }

    private void login() {
        String username = etUsername.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        // 使用InputValidator进行输入验证
        if (!InputValidator.isValidUsername(username)) {
            Toast.makeText(this, "用户名格式不正确（3-20个字符，只能包含字母、数字、下划线）", Toast.LENGTH_SHORT).show();
            Logger.w("LoginActivity", "Invalid username format");
            return;
        }
        
        if (!InputValidator.isValidPassword(password)) {
            Toast.makeText(this, "密码长度至少6个字符", Toast.LENGTH_SHORT).show();
            Logger.w("LoginActivity", "Invalid password length");
            return;
        }

        Logger.d("LoginActivity", "Attempting login for user: " + username);
        disposables.add(userRepository.login(username, password)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                user -> {
                    Logger.d("LoginActivity", "Login successful for user: " + username);
                    Toast.makeText(this, getString(R.string.login_success), Toast.LENGTH_SHORT).show();
                    // 登录成功后，启动MainActivity并关闭LoginActivity
                    Intent intent = new Intent(this, MainActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    finish();
                },
                error -> {
                    Logger.e("LoginActivity", "Login failed for user: " + username, error);
                    String message = ErrorMessages.getErrorMessage(this, error.getMessage());
                    Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
                }
            ));
    }

    private void register() {
        String username = etUsername.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        // 使用InputValidator进行输入验证
        if (!InputValidator.isValidUsername(username)) {
            Toast.makeText(this, "用户名格式不正确（3-20个字符，只能包含字母、数字、下划线）", Toast.LENGTH_SHORT).show();
            Logger.w("LoginActivity", "Invalid username format");
            return;
        }
        
        if (!InputValidator.isValidPassword(password)) {
            Toast.makeText(this, "密码长度至少6个字符", Toast.LENGTH_SHORT).show();
            Logger.w("LoginActivity", "Invalid password length");
            return;
        }

        Logger.d("LoginActivity", "Attempting registration for user: " + username);
        disposables.add(userRepository.register(username, password, username)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                userId -> {
                    // 检查userId是否有效（与Harmony项目保持一致）
                    if (userId > 0) {
                        Logger.d("LoginActivity", "Registration successful for user: " + username + ", userId: " + userId);
                        Toast.makeText(this, getString(R.string.register_success), Toast.LENGTH_SHORT).show();
                        
                        // 注册成功后自动登录（与Harmony项目保持一致）
                        // 使用延迟确保数据库操作完成后再登录
                        Logger.d("LoginActivity", "Auto-login after registration for user: " + username);
                        disposables.add(
                            io.reactivex.Single.timer(100, java.util.concurrent.TimeUnit.MILLISECONDS)
                                .flatMap(delay -> userRepository.login(username, password))
                                .subscribeOn(Schedulers.io())
                                .observeOn(AndroidSchedulers.mainThread())
                                .subscribe(
                                    user -> {
                                        Logger.d("LoginActivity", "Auto-login successful for user: " + username);
                                        Toast.makeText(this, getString(R.string.login_success), Toast.LENGTH_SHORT).show();
                                        // 登录成功后，启动MainActivity并关闭LoginActivity
                                        Intent intent = new Intent(this, MainActivity.class);
                                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                        startActivity(intent);
                                        finish();
                                    },
                                    error -> {
                                        // 登录失败，但注册成功，用户可以手动登录（与Harmony项目保持一致）
                                        Logger.e("LoginActivity", "Auto-login failed after registration", error);
                                        String errorMessage = ErrorMessages.getErrorMessage(this, error.getMessage());
                                        
                                        // 如果登录失败是因为用户不存在，说明注册可能有问题，提示用户手动登录
                                        if (errorMessage.contains(getString(R.string.user_not_found))) {
                                            Toast.makeText(this, getString(R.string.register_success_manual_login), Toast.LENGTH_SHORT).show();
                                        } else {
                                            Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show();
                                        }
                                        
                                        // 自动登录失败，清空密码框，让用户手动登录
                                        etPassword.setText("");
                                    }
                                )
                        );
                    } else {
                        Logger.w("LoginActivity", "Registration failed: invalid userId");
                        Toast.makeText(this, getString(R.string.register_failed_retry), Toast.LENGTH_SHORT).show();
                    }
                },
                error -> {
                    Logger.e("LoginActivity", "Registration failed for user: " + username, error);
                    String message = ErrorMessages.getErrorMessage(this, error.getMessage());
                    Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
                }
            ));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        disposables.clear();
    }
}
