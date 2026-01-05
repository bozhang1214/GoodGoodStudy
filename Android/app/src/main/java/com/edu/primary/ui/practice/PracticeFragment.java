package com.edu.primary.ui.practice;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.edu.primary.R;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.repository.QuestionRepository;
import com.edu.primary.repository.UserRepository;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

public class PracticeFragment extends Fragment {
    private Spinner spinnerSubject, spinnerGrade;
    private Button btnStartPractice;
    private TextView tvStatus;
    private UserRepository userRepository;
    private QuestionRepository questionRepository;
    private CompositeDisposable disposables = new CompositeDisposable();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_practice, container, false);
        
        userRepository = new UserRepository(requireContext());
        questionRepository = new QuestionRepository(requireContext());
        
        spinnerSubject = view.findViewById(R.id.spinner_subject);
        spinnerGrade = view.findViewById(R.id.spinner_grade);
        btnStartPractice = view.findViewById(R.id.btn_start_practice);
        tvStatus = view.findViewById(R.id.tv_status);

        String[] subjects = {
            getString(R.string.subject_chinese),
            getString(R.string.subject_math),
            getString(R.string.subject_english)
        };
        ArrayAdapter<String> subjectAdapter = new ArrayAdapter<>(requireContext(), 
            android.R.layout.simple_spinner_item, subjects);
        subjectAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerSubject.setAdapter(subjectAdapter);

        String[] grades = {
            getString(R.string.grade_one),
            getString(R.string.grade_two),
            getString(R.string.grade_three),
            getString(R.string.grade_four),
            getString(R.string.grade_five),
            getString(R.string.grade_six)
        };
        ArrayAdapter<String> gradeAdapter = new ArrayAdapter<>(requireContext(), 
            android.R.layout.simple_spinner_item, grades);
        gradeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerGrade.setAdapter(gradeAdapter);

        btnStartPractice.setOnClickListener(v -> startPractice());
        
        return view;
    }

    private void startPractice() {
        int subjectId = spinnerSubject.getSelectedItemPosition() + AppConstants.SUBJECT_CHINESE;
        int grade = spinnerGrade.getSelectedItemPosition() + AppConstants.MIN_GRADE;

        tvStatus.setText(getString(R.string.loading));
        btnStartPractice.setEnabled(false);

        disposables.add(questionRepository.getQuestionCount(subjectId, grade)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                count -> {
                    btnStartPractice.setEnabled(true);
                    if (count > 0) {
                        tvStatus.setText(getString(R.string.found_questions, count));
                    } else {
                        tvStatus.setText(getString(R.string.no_questions));
                    }
                },
                error -> {
                    btnStartPractice.setEnabled(true);
                    tvStatus.setText(getString(R.string.load_failed, error.getMessage()));
                }
            ));
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        disposables.clear();
    }
}
