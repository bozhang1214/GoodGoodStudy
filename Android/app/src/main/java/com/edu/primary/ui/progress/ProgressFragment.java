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
import com.edu.primary.database.AppDatabase;
import com.edu.primary.repository.UserRepository;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

public class ProgressFragment extends Fragment {
    private TextView tvProgress;
    private TextView tvTotalQuestions;
    private TextView tvCompletedQuestions;
    private TextView tvAccuracyRate;
    private UserRepository userRepository;
    private AppDatabase database;
    private CompositeDisposable disposables = new CompositeDisposable();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_progress, container, false);
        
        userRepository = new UserRepository(requireContext());
        database = AppDatabase.getInstance(requireContext());
        
        tvProgress = view.findViewById(R.id.tv_progress);
        tvTotalQuestions = view.findViewById(R.id.tv_total_questions);
        tvCompletedQuestions = view.findViewById(R.id.tv_completed_questions);
        tvAccuracyRate = view.findViewById(R.id.tv_accuracy_rate);

        loadProgress();
        
        return view;
    }

    private void loadProgress() {
        long userId = userRepository.getCurrentUserId();
        if (userId == -1) {
            tvProgress.setText(getString(R.string.please_login));
            return;
        }

        disposables.add(
            io.reactivex.Single.fromCallable(() -> {
                int total = database.answerDao().getTotalCount(userId);
                int correct = database.answerDao().getCorrectCount(userId);
                double accuracy = total > 0 ? (correct * 100.0 / total) : 0.0;
                return new ProgressData(total, correct, accuracy);
            })
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                data -> {
                    tvTotalQuestions.setText(getString(R.string.total_questions_format, data.total));
                    tvCompletedQuestions.setText(getString(R.string.completed_questions_format, data.total));
                    tvAccuracyRate.setText(getString(R.string.accuracy_rate_format, data.accuracy));
                },
                error -> {
                    tvProgress.setText(getString(R.string.load_failed, error.getMessage()));
                }
            )
        );
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        disposables.clear();
    }

    private static class ProgressData {
        int total;
        int correct;
        double accuracy;

        ProgressData(int total, int correct, double accuracy) {
            this.total = total;
            this.correct = correct;
            this.accuracy = accuracy;
        }
    }
}
