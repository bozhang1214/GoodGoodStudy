package com.edu.primary.ui.settings;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.edu.primary.R;
import com.edu.primary.repository.AIRepository;

public class SettingsActivity extends AppCompatActivity {
    private EditText etApiKey;
    private Button btnSave;
    private AIRepository aiRepository;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        aiRepository = new AIRepository(this);
        etApiKey = findViewById(R.id.et_api_key);
        btnSave = findViewById(R.id.btn_save);

        String currentKey = aiRepository.getApiKey();
        if (!currentKey.isEmpty()) {
            etApiKey.setText(currentKey);
        }

        btnSave.setOnClickListener(v -> saveApiKey());
    }

    private void saveApiKey() {
        String apiKey = etApiKey.getText().toString().trim();
        if (apiKey.isEmpty()) {
            Toast.makeText(this, getString(R.string.please_input_api_key), Toast.LENGTH_SHORT).show();
            return;
        }

        aiRepository.setApiKey(apiKey);
        Toast.makeText(this, getString(R.string.api_key_saved), Toast.LENGTH_SHORT).show();
        finish();
    }
}
