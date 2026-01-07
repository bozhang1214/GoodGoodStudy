package com.edu.primary.ui.wrongbook;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.edu.primary.R;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.entity.WrongQuestionEntity;
import com.edu.primary.repository.QuestionRepository;
import com.edu.primary.repository.UserRepository;
import com.edu.primary.ui.practice.PracticeActivity;
import com.edu.primary.utils.Logger;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

import java.util.ArrayList;
import java.util.List;

public class WrongBookFragment extends Fragment {
    private RecyclerView recyclerView;
    private TextView tvEmpty;
    private UserRepository userRepository;
    private QuestionRepository questionRepository;
    private CompositeDisposable disposables = new CompositeDisposable();
    private WrongQuestionAdapter adapter;
    private List<WrongQuestionEntity> wrongQuestions = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_wrong_book, container, false);
        
        // 使用ApplicationContext防止内存泄漏
        userRepository = new UserRepository(requireContext().getApplicationContext());
        questionRepository = new QuestionRepository(requireContext().getApplicationContext());
        
        recyclerView = view.findViewById(R.id.recycler_view);
        tvEmpty = view.findViewById(R.id.tv_empty);

        adapter = new WrongQuestionAdapter(wrongQuestions, requireContext().getApplicationContext());
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerView.setAdapter(adapter);
        
        // 设置点击事件监听器
        adapter.setOnItemClickListener(wrongQuestion -> {
            Logger.d("WrongBookFragment", "Clicked wrong question: " + wrongQuestion.questionId);
            startReviewActivity(wrongQuestion);
        });

        loadWrongQuestions();
        
        return view;
    }
    
    /**
     * 启动复习Activity
     */
    private void startReviewActivity(WrongQuestionEntity wrongQuestion) {
        // 需要获取题目的科目和年级信息
        disposables.add(
            questionRepository.getQuestionById(wrongQuestion.questionId)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    question -> {
                        if (question != null) {
                            // 创建Intent，跳转到复习页面
                            Intent intent = new Intent(requireContext(), PracticeActivity.class);
                            intent.putExtra(PracticeActivity.EXTRA_SUBJECT_ID, question.subjectId);
                            intent.putExtra(PracticeActivity.EXTRA_GRADE, question.grade);
                            intent.putExtra(PracticeActivity.EXTRA_REVIEW_MODE, true);
                            
                            // 传递错题ID列表（单个错题）
                            List<Long> wrongQuestionIds = new ArrayList<>();
                            wrongQuestionIds.add(wrongQuestion.questionId);
                            long[] wrongIds = new long[wrongQuestionIds.size()];
                            for (int i = 0; i < wrongQuestionIds.size(); i++) {
                                wrongIds[i] = wrongQuestionIds.get(i);
                            }
                            intent.putExtra("wrong_question_ids", wrongIds);
                            
                            Logger.d("WrongBookFragment", "Starting review for question: " + wrongQuestion.questionId);
                            startActivity(intent);
                        } else {
                            Logger.w("WrongBookFragment", "Question not found: " + wrongQuestion.questionId);
                        }
                    },
                    error -> {
                        Logger.e("WrongBookFragment", "Failed to load question", error);
                    }
                )
        );
    }

    /**
     * 加载错题列表
     * 使用Repository层替代直接访问Database
     */
    private void loadWrongQuestions() {
        long userId = userRepository.getCurrentUserId();
        if (userId == -1) {
            Logger.w("WrongBookFragment", "User not logged in");
            tvEmpty.setText(getString(R.string.please_login));
            tvEmpty.setVisibility(View.VISIBLE);
            return;
        }

        Logger.d("WrongBookFragment", "Loading wrong questions for user: " + userId);
        disposables.add(
            questionRepository.getWrongQuestions(userId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                questions -> {
                    Logger.d("WrongBookFragment", "Loaded " + questions.size() + " wrong questions");
                    wrongQuestions.clear();
                    wrongQuestions.addAll(questions);
                    adapter.notifyDataSetChanged();
                    
                    if (questions.isEmpty()) {
                        tvEmpty.setText(getString(R.string.no_wrong_questions));
                        tvEmpty.setVisibility(View.VISIBLE);
                        recyclerView.setVisibility(View.GONE);
                    } else {
                        tvEmpty.setVisibility(View.GONE);
                        recyclerView.setVisibility(View.VISIBLE);
                    }
                },
                error -> {
                    Logger.e("WrongBookFragment", "Failed to load wrong questions", error);
                    tvEmpty.setText(getString(R.string.load_failed, error.getMessage()));
                    tvEmpty.setVisibility(View.VISIBLE);
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
        if (wrongQuestions != null) {
            wrongQuestions.clear();
        }
    }
}
