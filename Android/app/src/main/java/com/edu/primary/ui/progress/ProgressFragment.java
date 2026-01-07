package com.edu.primary.ui.progress;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.edu.primary.R;
import com.edu.primary.repository.QuestionRepository;
import com.edu.primary.repository.UserRepository;
import com.edu.primary.utils.Logger;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

public class ProgressFragment extends Fragment {
    private TextView tvProgress;
    private TextView tvTotalQuestions;
    private TextView tvCompletedQuestions;
    private TextView tvAccuracyRate;
    private UserRepository userRepository;
    private QuestionRepository questionRepository;
    private CompositeDisposable disposables = new CompositeDisposable();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_progress, container, false);
        
        // 使用ApplicationContext防止内存泄漏
        userRepository = new UserRepository(requireContext().getApplicationContext());
        questionRepository = new QuestionRepository(requireContext().getApplicationContext());
        
        tvProgress = view.findViewById(R.id.tv_progress);
        tvTotalQuestions = view.findViewById(R.id.tv_total_questions);
        tvCompletedQuestions = view.findViewById(R.id.tv_completed_questions);
        tvAccuracyRate = view.findViewById(R.id.tv_accuracy_rate);

        loadProgress();
        
        return view;
    }

    /**
     * 加载学习进度
     * 使用Repository层替代直接访问Database
     */
    private void loadProgress() {
        long userId = userRepository.getCurrentUserId();
        if (userId == -1) {
            Logger.w("ProgressFragment", "User not logged in");
            tvProgress.setText(getString(R.string.please_login));
            return;
        }

        Logger.d("ProgressFragment", "Loading progress for user: " + userId);
        disposables.add(
            questionRepository.getProgressData(userId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                data -> {
                    Logger.d("ProgressFragment", "Progress loaded - Total: " + data.total + ", Correct: " + data.correct);
                    tvTotalQuestions.setText(getString(R.string.total_questions_format, data.total));
                    tvCompletedQuestions.setText(getString(R.string.completed_questions_format, data.total));
                    tvAccuracyRate.setText(getString(R.string.accuracy_rate_format, data.accuracy));
                },
                error -> {
                    Logger.e("ProgressFragment", "Failed to load progress", error);
                    tvProgress.setText(getString(R.string.load_failed, error.getMessage()));
                }
            )
        );
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (disposables != null && !disposables.isDisposed()) {
            disposables.clear();
        }
    }
}
