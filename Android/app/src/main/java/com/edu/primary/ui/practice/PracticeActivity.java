package com.edu.primary.ui.practice;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.edu.primary.BuildConfig;
import com.edu.primary.R;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.entity.AnswerEntity;
import com.edu.primary.database.entity.QuestionEntity;
import com.edu.primary.repository.QuestionRepository;
import com.edu.primary.repository.UserRepository;
import com.edu.primary.utils.InputValidator;
import com.edu.primary.utils.Logger;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class PracticeActivity extends AppCompatActivity {
    public static final String EXTRA_SUBJECT_ID = "subject_id";
    public static final String EXTRA_GRADE = "grade";
    public static final String EXTRA_REVIEW_MODE = "is_review_mode";

    private TextView tvQuestionNumber;
    private TextView tvQuestionContent;
    private LinearLayout llOptions;
    private EditText etFillAnswer;
    private Button btnSubmitAll;
    private Button btnPrevious;
    private Button btnNext;
    private LinearLayout llNavigationButtons;
    private TextView tvResult;
    private TextView tvExplanation;

    private QuestionRepository questionRepository;
    private UserRepository userRepository;
    private CompositeDisposable disposables = new CompositeDisposable();

    private List<QuestionEntity> questions;
    private volatile int currentIndex = 0; // 使用volatile保证线程可见性
    private long userId;
    private int subjectId;
    private int grade;
    // 保存临时答案：questionId -> answer，使用ConcurrentHashMap保证线程安全
    private final Map<Long, String> tempAnswers = new ConcurrentHashMap<>();
    // 是否已提交所有答案
    private volatile boolean allSubmitted = false; // 使用volatile保证线程可见性
    // 是否为复习模式
    private volatile boolean isReviewMode = false; // 使用volatile保证线程可见性
    
    // TextWatcher实例，避免重复创建和内存泄漏
    private TextWatcher textWatcher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_practice);

        // 恢复保存的状态
        if (savedInstanceState != null) {
            currentIndex = savedInstanceState.getInt("current_index", 0);
            allSubmitted = savedInstanceState.getBoolean("all_submitted", false);
            isReviewMode = savedInstanceState.getBoolean(EXTRA_REVIEW_MODE, false);
            subjectId = savedInstanceState.getInt("subject_id", getIntent().getIntExtra(EXTRA_SUBJECT_ID, AppConstants.SUBJECT_MATH));
            grade = savedInstanceState.getInt("grade", getIntent().getIntExtra(EXTRA_GRADE, 1));
        } else {
            subjectId = getIntent().getIntExtra(EXTRA_SUBJECT_ID, AppConstants.SUBJECT_MATH);
            grade = getIntent().getIntExtra(EXTRA_GRADE, 1);
            isReviewMode = getIntent().getBooleanExtra(EXTRA_REVIEW_MODE, false);
        }
        
        // 输入验证
        if (!InputValidator.isValidSubjectId(subjectId)) {
            Logger.w("PracticeActivity", "Invalid subjectId: " + subjectId);
            subjectId = AppConstants.SUBJECT_MATH;
        }
        if (!InputValidator.isValidGrade(grade)) {
            Logger.w("PracticeActivity", "Invalid grade: " + grade);
            grade = 1;
        }
        
        Logger.d("PracticeActivity", "onCreate - subjectId: " + subjectId + ", grade: " + grade + ", reviewMode: " + isReviewMode);

        questionRepository = new QuestionRepository(this);
        userRepository = new UserRepository(this);
        userId = userRepository.getCurrentUserId();

        initViews();
        
        if (isReviewMode) {
            // 复习模式：只加载错题
            loadWrongQuestions();
        } else {
            // 正常模式：加载所有题目
            loadQuestions();
        }
    }

    private void initViews() {
        tvQuestionNumber = findViewById(R.id.tv_question_number);
        tvQuestionContent = findViewById(R.id.tv_question_content);
        llOptions = findViewById(R.id.ll_options);
        etFillAnswer = findViewById(R.id.et_fill_answer);
        btnSubmitAll = findViewById(R.id.btn_submit_all);
        btnPrevious = findViewById(R.id.btn_previous);
        btnNext = findViewById(R.id.btn_next);
        llNavigationButtons = findViewById(R.id.ll_navigation_buttons);
        tvResult = findViewById(R.id.tv_result);
        tvExplanation = findViewById(R.id.tv_explanation);

        // 初始化提交按钮状态（禁用，直到所有题目答完）
        btnSubmitAll.setEnabled(false);
        btnSubmitAll.setAlpha(0.5f);
        
        btnSubmitAll.setOnClickListener(v -> {
            // 检查是否所有题目都已答题
            if (checkAllQuestionsAnswered()) {
                showSubmitAllConfirmDialog();
            } else {
                int unansweredCount = getUnansweredCount();
                Toast.makeText(this, getString(R.string.unanswered_questions_count, unansweredCount), Toast.LENGTH_LONG).show();
            }
        });
        btnPrevious.setOnClickListener(v -> {
            saveCurrentAnswer();
            previousQuestion();
            updateSubmitButtonState();
        });
        btnNext.setOnClickListener(v -> {
            saveCurrentAnswer();
            nextQuestion();
            updateSubmitButtonState();
        });
    }

    private void loadQuestions() {
        disposables.add(questionRepository.getQuestions(subjectId, grade)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                questionList -> {
                    if (questionList == null || questionList.isEmpty()) {
                        Toast.makeText(this, getString(R.string.no_questions), Toast.LENGTH_SHORT).show();
                        finish();
                        return;
                    }
                    questions = questionList;
                    
                    // 根据BuildConfig.DEBUG限制题目数量
                    int maxQuestions = BuildConfig.DEBUG ? AppConstants.DEBUG_QUESTIONS_PER_PRACTICE : AppConstants.RELEASE_QUESTIONS_PER_PRACTICE;
                    if (questions.size() > maxQuestions) {
                        questions = questions.subList(0, maxQuestions);
                    }
                    
                    // 打乱题目顺序
                    Collections.shuffle(questions);
                    // 初始化提交按钮状态（禁用，直到所有题目答完）
                    updateSubmitButtonState();
                    showQuestion(0);
                },
                error -> {
                    Toast.makeText(this, getString(R.string.load_failed, error.getMessage()), Toast.LENGTH_SHORT).show();
                    finish();
                }
            ));
    }

    /**
     * 加载错题（复习模式）
     */
    private void loadWrongQuestions() {
        long[] wrongQuestionIds = getIntent().getLongArrayExtra("wrong_question_ids");
        if (wrongQuestionIds == null || wrongQuestionIds.length == 0) {
            Logger.w("PracticeActivity", "No wrong question IDs provided");
            Toast.makeText(this, getString(R.string.no_wrong_questions_to_review), Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        Logger.d("PracticeActivity", "Loading wrong questions, count: " + wrongQuestionIds.length);

        // 设置标题
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(getString(R.string.review_wrong_questions));
        }

        // 转换long[]为List<Long>
        List<Long> wrongIdsList = new ArrayList<>();
        for (long id : wrongQuestionIds) {
            wrongIdsList.add(id);
        }

        // 使用getQuestionsByIds方法直接加载错题
        disposables.add(questionRepository.getQuestionsByIds(wrongIdsList)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                questionList -> {
                    if (questionList == null || questionList.isEmpty()) {
                        Logger.w("PracticeActivity", "No questions found for review");
                        Toast.makeText(this, getString(R.string.no_wrong_questions_to_review), Toast.LENGTH_SHORT).show();
                        finish();
                        return;
                    }

                    questions = questionList;
                    Logger.d("PracticeActivity", "Loaded " + questions.size() + " wrong questions for review");
                    
                    // 复习模式下，按钮文本保持"提交所有答案"
                    btnSubmitAll.setText(getString(R.string.submit_all_answers));
                    // 初始化提交按钮状态（禁用，直到所有题目答完）
                    updateSubmitButtonState();
                    showQuestion(0);
                },
                error -> {
                    Toast.makeText(this, getString(R.string.load_failed, error.getMessage()), Toast.LENGTH_SHORT).show();
                    finish();
                }
            ));
    }

    /**
     * 显示题目
     * 空值安全：增强空值检查，防止NullPointerException
     */
    private void showQuestion(int index) {
        if (questions == null || questions.isEmpty()) {
            Toast.makeText(this, getString(R.string.no_questions), Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
        
        if (index < 0 || index >= questions.size()) {
            if (index >= questions.size()) {
                Toast.makeText(this, getString(R.string.practice_completed), Toast.LENGTH_SHORT).show();
                finish();
            }
            return;
        }

        currentIndex = index;
        QuestionEntity question = questions.get(index);
        
        if (question == null) {
            return;
        }

        // 更新题目编号
        if (tvQuestionNumber != null) {
            tvQuestionNumber.setText(getString(R.string.question_number, index + 1, questions.size()));
        }

        // 显示题目内容
        if (tvQuestionContent != null) {
            tvQuestionContent.setText(question.content != null ? question.content : "");
        }

        // 更新导航按钮状态
        updateNavigationButtons();
        
        // 更新提交按钮状态
        updateSubmitButtonState();

        // 显示题目（如果已提交则显示结果，否则显示临时答案）
        if (allSubmitted) {
            // 已提交，显示结果
            checkAndShowSubmittedAnswer(question);
        } else {
            // 未提交，显示临时答案或空白
            showQuestionWithTempAnswer(question);
        }
    }

    /**
     * 显示已提交题目的答案和结果
     */
    private void checkAndShowSubmittedAnswer(QuestionEntity question) {
        disposables.add(questionRepository.getAnswer(userId, question.id)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                answer -> {
                    showQuestionWithAnswer(question, answer);
                },
                error -> {
                    // 未找到已提交的答案，显示空白
                    showQuestionBlank(question);
                }
            ));
    }

    /**
     * 显示已答题目的答案和结果（只读模式）
     */
    private void showQuestionWithAnswer(QuestionEntity question, AnswerEntity answer) {
        if (question == null || answer == null) {
            return;
        }
        
        // 根据题目类型显示答案
        showQuestionByType(question, answer.userAnswer, true);

        // 显示结果
        showResult(question, answer.isCorrect);
        
        // 显示导航按钮（在结果下方）
        llNavigationButtons.setVisibility(View.VISIBLE);
    }
    
    /**
     * 根据题目类型显示题目（提取公共逻辑）
     */
    private void showQuestionByType(QuestionEntity question, String answer, boolean readOnly) {
        if (question == null) {
            return;
        }
        
        if (AppConstants.QUESTION_TYPE_SINGLE_CHOICE.equals(question.type)) {
            showSingleChoiceOptionsWithAnswer(question, answer, readOnly);
        } else if (AppConstants.QUESTION_TYPE_FILL_BLANK.equals(question.type)) {
            showFillBlankInputWithAnswer(question, answer, readOnly);
        } else if (AppConstants.QUESTION_TYPE_JUDGMENT.equals(question.type)) {
            showJudgmentOptionsWithAnswer(question, answer, readOnly);
        }
    }

    /**
     * 显示题目（显示临时答案或空白）
     */
    private void showQuestionWithTempAnswer(QuestionEntity question) {
        // 隐藏结果
        tvResult.setVisibility(View.GONE);
        tvExplanation.setVisibility(View.GONE);

        // 获取临时答案
        String tempAnswer = tempAnswers.get(question.id);

        // 根据题目类型显示不同的输入方式
        showQuestionByType(question, tempAnswer, false);
    }

    /**
     * 显示空白题目（未答题）
     */
    private void showQuestionBlank(QuestionEntity question) {
        // 隐藏结果
        tvResult.setVisibility(View.GONE);
        tvExplanation.setVisibility(View.GONE);

        // 根据题目类型显示不同的输入方式
        showQuestionByType(question, null, false);
    }

    /**
     * 保存当前题目的答案
     * 线程安全：使用ConcurrentHashMap保证线程安全
     * 空值安全：增强空值检查
     */
    private void saveCurrentAnswer() {
        if (allSubmitted || questions == null || currentIndex < 0 || currentIndex >= questions.size()) {
            return;
        }

        QuestionEntity question = questions.get(currentIndex);
        if (question == null) {
            return;
        }
        
        String answer = getCurrentAnswer();

        if (answer != null && !answer.isEmpty()) {
            tempAnswers.put(question.id, answer);
        } else {
            tempAnswers.remove(question.id);
        }
        
        // 保存答案后更新提交按钮状态（确保在主线程执行）
        if (btnSubmitAll != null) {
            runOnUiThread(this::updateSubmitButtonState);
        }
    }

    /**
     * 获取当前题目的答案
     * 空值安全：增强空值检查，防止NullPointerException
     */
    private String getCurrentAnswer() {
        if (questions == null || currentIndex < 0 || currentIndex >= questions.size()) {
            return null;
        }

        QuestionEntity question = questions.get(currentIndex);
        if (question == null || question.type == null) {
            return null;
        }

        if (AppConstants.QUESTION_TYPE_SINGLE_CHOICE.equals(question.type) ||
            AppConstants.QUESTION_TYPE_JUDGMENT.equals(question.type)) {
            if (llOptions == null || llOptions.getChildCount() == 0) {
                return null;
            }
            RadioGroup radioGroup = (RadioGroup) llOptions.getChildAt(0);
            if (radioGroup != null) {
                int selectedId = radioGroup.getCheckedRadioButtonId();
                if (selectedId != -1) {
                    RadioButton selectedButton = findViewById(selectedId);
                    if (selectedButton != null && selectedButton.getText() != null) {
                        return selectedButton.getText().toString();
                    }
                }
            }
        } else if (AppConstants.QUESTION_TYPE_FILL_BLANK.equals(question.type)) {
            if (etFillAnswer != null && etFillAnswer.getText() != null) {
                return etFillAnswer.getText().toString().trim();
            }
        }

        return null;
    }

    private void showSingleChoiceOptions(QuestionEntity question) {
        showSingleChoiceOptionsWithAnswer(question, null, false);
    }

    private void showSingleChoiceOptionsWithAnswer(QuestionEntity question, String selectedAnswer, boolean readOnly) {
        llOptions.setVisibility(View.VISIBLE);
        etFillAnswer.setVisibility(View.GONE);
        llOptions.removeAllViews();

        RadioGroup radioGroup = new RadioGroup(this);
        radioGroup.setOrientation(LinearLayout.VERTICAL);

        if (question.options != null) {
            for (int i = 0; i < question.options.size(); i++) {
                RadioButton radioButton = new RadioButton(this);
                String optionText = question.options.get(i);
                radioButton.setText(optionText);
                radioButton.setId(i);
                
                // 如果已有答案，选中
                if (selectedAnswer != null && selectedAnswer.equals(optionText)) {
                    radioButton.setChecked(true);
                }
                
                // 只读模式时禁用选项
                radioButton.setEnabled(!readOnly);
                
                radioGroup.addView(radioButton);
            }
        }

        // 添加选项变化监听器
        if (!readOnly) {
            radioGroup.setOnCheckedChangeListener((group, checkedId) -> {
                saveCurrentAnswer();
            });
        }

        llOptions.addView(radioGroup);
    }

    private void showFillBlankInput(QuestionEntity question) {
        showFillBlankInputWithAnswer(question, null, false);
    }

    private void showFillBlankInputWithAnswer(QuestionEntity question, String answer, boolean readOnly) {
        llOptions.setVisibility(View.GONE);
        etFillAnswer.setVisibility(View.VISIBLE);
        
        if (answer != null) {
            etFillAnswer.setText(answer);
        } else {
            etFillAnswer.setText("");
        }
        
        // 只读模式时禁用输入
        etFillAnswer.setEnabled(!readOnly);
        
        if (!readOnly) {
            etFillAnswer.requestFocus();
            // 移除旧的监听器，防止内存泄漏和重复添加
            if (textWatcher != null) {
                etFillAnswer.removeTextChangedListener(textWatcher);
            }
            // 创建并添加文本变化监听器
            textWatcher = new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {
                }

                @Override
                public void afterTextChanged(android.text.Editable s) {
                    saveCurrentAnswer();
                }
            };
            etFillAnswer.addTextChangedListener(textWatcher);
        } else {
            // 只读模式下移除监听器
            if (textWatcher != null) {
                etFillAnswer.removeTextChangedListener(textWatcher);
            }
        }
    }

    private void showJudgmentOptions(QuestionEntity question) {
        showJudgmentOptionsWithAnswer(question, null, false);
    }

    private void showJudgmentOptionsWithAnswer(QuestionEntity question, String selectedAnswer, boolean readOnly) {
        llOptions.setVisibility(View.VISIBLE);
        etFillAnswer.setVisibility(View.GONE);
        llOptions.removeAllViews();

        RadioGroup radioGroup = new RadioGroup(this);
        radioGroup.setOrientation(LinearLayout.VERTICAL);

        RadioButton rbCorrect = new RadioButton(this);
        rbCorrect.setText(getString(R.string.correct));
        rbCorrect.setId(0);
        if (selectedAnswer != null && selectedAnswer.equals(getString(R.string.correct))) {
            rbCorrect.setChecked(true);
        }
        rbCorrect.setEnabled(!readOnly);
        radioGroup.addView(rbCorrect);

        RadioButton rbWrong = new RadioButton(this);
        rbWrong.setText(getString(R.string.wrong));
        rbWrong.setId(1);
        if (selectedAnswer != null && selectedAnswer.equals(getString(R.string.wrong))) {
            rbWrong.setChecked(true);
        }
        rbWrong.setEnabled(!readOnly);
        radioGroup.addView(rbWrong);

        // 添加选项变化监听器
        if (!readOnly) {
            radioGroup.setOnCheckedChangeListener((group, checkedId) -> {
                saveCurrentAnswer();
            });
        }

        llOptions.addView(radioGroup);
    }

    /**
     * 显示提交所有答案的确认对话框
     */
    private void showSubmitAllConfirmDialog() {
        // 先保存当前答案
        saveCurrentAnswer();

        // 再次检查是否所有题目都已答题（防止状态不一致）
        if (!checkAllQuestionsAnswered()) {
            int unansweredCount = getUnansweredCount();
            Toast.makeText(this, getString(R.string.unanswered_questions_count, unansweredCount), Toast.LENGTH_LONG).show();
            return;
        }

        if (questions == null || questions.isEmpty()) {
            Toast.makeText(this, getString(R.string.no_questions), Toast.LENGTH_SHORT).show();
            return;
        }

        StringBuilder message = new StringBuilder();
        message.append(getString(R.string.answer_summary)).append("\n\n");

        for (int i = 0; i < questions.size(); i++) {
            QuestionEntity question = questions.get(i);
            if (question == null) {
                continue;
            }
            
            String answer = tempAnswers.get(question.id);

            message.append("【第 ").append(i + 1).append(" 题】\n");
            message.append(getString(R.string.question_content_label))
                   .append(question.content != null ? question.content : "").append("\n");
            message.append(getString(R.string.your_answer_label));
            if (answer != null && !answer.isEmpty()) {
                message.append(answer);
            } else {
                message.append(getString(R.string.unanswered_question));
            }
            message.append("\n\n");
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getString(R.string.check_all_answers));
        builder.setMessage(message.toString());
        builder.setPositiveButton(getString(R.string.submit_confirm), (dialog, which) -> {
            // 确认提交所有答案
            submitAllAnswers();
        });
        builder.setNegativeButton(getString(R.string.cancel), (dialog, which) -> {
            dialog.dismiss();
        });
        builder.setCancelable(true);

        AlertDialog dialog = builder.create();
        dialog.show();

        // 设置对话框消息文本大小和样式
        TextView messageView = dialog.findViewById(android.R.id.message);
        if (messageView != null) {
            messageView.setTextSize(14);
            messageView.setLineSpacing(6, 1.0f);
        }
    }

    /**
     * 提交所有答案
     */
    private void submitAllAnswers() {
        if (allSubmitted) {
            return;
        }

        // 保存当前答案
        saveCurrentAnswer();

        // 统计结果
        int totalAnswered = 0;
        int correctCount = 0;
        int wrongCount = 0;
        List<Long> wrongQuestionIds = new ArrayList<>();

        // 提交所有答案
        for (QuestionEntity question : questions) {
            String answer = tempAnswers.get(question.id);
            if (answer != null && !answer.isEmpty()) {
                totalAnswered++;
                boolean isCorrect = checkAnswer(question, answer);
                saveAnswer(question.id, answer, isCorrect);
                
                if (isCorrect) {
                    correctCount++;
                    // 如果是复习模式且答对了，从错题本中移除
                    if (isReviewMode) {
                        disposables.add(questionRepository.removeWrongQuestion(userId, question.id)
                            .subscribe());
                    }
                } else {
                    wrongCount++;
                    wrongQuestionIds.add(question.id);
                    // 如果是复习模式且答错了，增加复习次数
                    if (isReviewMode) {
                        disposables.add(questionRepository.incrementReviewCount(userId, question.id)
                            .subscribe());
                    }
                }
            }
        }

        allSubmitted = true;
        tempAnswers.clear();

        // 刷新当前题目显示（显示结果）
        if (currentIndex >= 0 && currentIndex < questions.size()) {
            showQuestion(currentIndex);
        }

        // 禁用提交按钮
        btnSubmitAll.setEnabled(false);
        btnSubmitAll.setText(getString(R.string.practice_completed));

        // 显示批改结果对话框
        showGradingResultDialog(totalAnswered, correctCount, wrongCount, wrongQuestionIds);
    }

    /**
     * 显示批改结果对话框
     */
    private void showGradingResultDialog(int totalAnswered, int correctCount, int wrongCount, List<Long> wrongQuestionIds) {
        StringBuilder message = new StringBuilder();
        message.append(getString(R.string.total_answered, totalAnswered)).append("\n");
        message.append(getString(R.string.correct_count, correctCount)).append("\n");
        message.append(getString(R.string.wrong_count, wrongCount)).append("\n");
        
        if (totalAnswered > 0) {
            double accuracy = (double) correctCount / totalAnswered * 100;
            message.append(getString(R.string.accuracy_display, accuracy)).append("\n");
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getString(R.string.grading_result));
        builder.setMessage(message.toString());
        
        // 如果有错题，添加"复习错题"按钮
        if (wrongCount > 0 && !wrongQuestionIds.isEmpty()) {
            builder.setPositiveButton(getString(R.string.review_wrong_questions), (dialog, which) -> {
                // 跳转到错题复习页面
                startWrongQuestionReview(wrongQuestionIds);
            });
            builder.setNeutralButton(getString(R.string.confirm), (dialog, which) -> {
                dialog.dismiss();
            });
        } else {
            builder.setPositiveButton(getString(R.string.confirm), (dialog, which) -> {
                dialog.dismiss();
            });
        }
        
        builder.setCancelable(false);
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    /**
     * 启动错题复习
     */
    private void startWrongQuestionReview(List<Long> wrongQuestionIds) {
        // 创建Intent传递错题ID列表
        Intent intent = new Intent(this, PracticeActivity.class);
        intent.putExtra(EXTRA_SUBJECT_ID, subjectId);
        intent.putExtra(EXTRA_GRADE, grade);
        
        // 转换List<Long>为long[]
        long[] wrongIds = new long[wrongQuestionIds.size()];
        for (int i = 0; i < wrongQuestionIds.size(); i++) {
            wrongIds[i] = wrongQuestionIds.get(i);
        }
        intent.putExtra("wrong_question_ids", wrongIds);
        intent.putExtra(EXTRA_REVIEW_MODE, true);
        startActivity(intent);
    }

    /**
     * 检查答案是否正确
     * 空值安全：增强空值检查，防止NullPointerException
     */
    private boolean checkAnswer(QuestionEntity question, String answer) {
        if (question == null || answer == null || answer.isEmpty()) {
            return false;
        }
        
        if (question.correctAnswer == null) {
            return false;
        }
        
        if (AppConstants.QUESTION_TYPE_JUDGMENT.equals(question.type)) {
            // 判断题需要特殊处理
            String correctText = getString(R.string.correct);
            boolean userChoice = answer.equals(correctText);
            boolean correctAnswer = question.correctAnswer.equals(correctText);
            return userChoice == correctAnswer;
        } else {
            return question.correctAnswer.equals(answer);
        }
    }

    /**
     * 显示答题结果
     * 空值安全：增强空值检查
     */
    private void showResult(QuestionEntity question, boolean isCorrect) {
        if (tvResult == null || tvExplanation == null) {
            return;
        }
        
        tvResult.setVisibility(View.VISIBLE);
        tvExplanation.setVisibility(View.VISIBLE);

        if (isCorrect) {
            tvResult.setText(getString(R.string.answer_correct));
            tvResult.setTextColor(getResources().getColor(android.R.color.holo_green_dark));
        } else {
            String correctAnswer = question != null && question.correctAnswer != null 
                ? question.correctAnswer : "";
            tvResult.setText(getString(R.string.answer_wrong, correctAnswer));
            tvResult.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
        }

        if (question != null && question.explanation != null && !question.explanation.isEmpty()) {
            tvExplanation.setText(question.explanation);
        } else {
            tvExplanation.setText("");
        }
    }

    private void saveAnswer(long questionId, String answer, boolean isCorrect) {
        AnswerEntity answerEntity = new AnswerEntity();
        answerEntity.userId = userId;
        answerEntity.questionId = questionId;
        answerEntity.userAnswer = answer;
        answerEntity.isCorrect = isCorrect;
        answerEntity.answerTime = System.currentTimeMillis();

        // 保存答案
        disposables.add(questionRepository.insertAnswer(answerEntity)
            .subscribe(() -> {
                // 如果答错了，添加到错题本
                if (!isCorrect) {
                    disposables.add(questionRepository.addWrongQuestion(userId, questionId, answer)
                        .subscribe(() -> {
                            // 错题已添加
                        }, error -> {
                            // 错误处理
                        }));
                }
            }, error -> {
                // 错误处理
            }));
    }

    /**
     * 更新导航按钮状态
     */
    private void updateNavigationButtons() {
        // 第一题时禁用上一题按钮
        btnPrevious.setEnabled(currentIndex > 0);
        
        // 最后一题时禁用下一题按钮
        btnNext.setEnabled(currentIndex < questions.size() - 1);
    }

    /**
     * 检查是否所有题目都已答题
     */
    private boolean checkAllQuestionsAnswered() {
        if (questions == null || questions.isEmpty()) {
            return false;
        }
        
        for (QuestionEntity question : questions) {
            String answer = tempAnswers.get(question.id);
            if (answer == null || answer.isEmpty()) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * 获取未答题数量
     */
    private int getUnansweredCount() {
        if (questions == null || questions.isEmpty()) {
            return 0;
        }
        
        int count = 0;
        for (QuestionEntity question : questions) {
            String answer = tempAnswers.get(question.id);
            if (answer == null || answer.isEmpty()) {
                count++;
            }
        }
        
        return count;
    }

    /**
     * 更新提交按钮状态
     */
    private void updateSubmitButtonState() {
        if (allSubmitted) {
            btnSubmitAll.setEnabled(false);
            return;
        }
        
        // 只有所有题目都答完才能提交
        boolean allAnswered = checkAllQuestionsAnswered();
        btnSubmitAll.setEnabled(allAnswered);
        
        if (allAnswered) {
            btnSubmitAll.setAlpha(1.0f);
        } else {
            btnSubmitAll.setAlpha(0.5f);
        }
    }

    /**
     * 上一题
     */
    private void previousQuestion() {
        if (currentIndex > 0) {
            showQuestion(currentIndex - 1);
        }
    }

    /**
     * 下一题
     */
    private void nextQuestion() {
        if (currentIndex < questions.size() - 1) {
            showQuestion(currentIndex + 1);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        // 保存当前答案
        if (!allSubmitted) {
            saveCurrentAnswer();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        // 保存当前状态
        outState.putInt("current_index", currentIndex);
        outState.putBoolean("all_submitted", allSubmitted);
        outState.putBoolean(EXTRA_REVIEW_MODE, isReviewMode);
        outState.putInt("subject_id", subjectId);
        outState.putInt("grade", grade);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 清理资源，防止内存泄漏
        if (disposables != null && !disposables.isDisposed()) {
            disposables.clear();
        }
        // 移除TextWatcher，防止内存泄漏
        if (etFillAnswer != null && textWatcher != null) {
            etFillAnswer.removeTextChangedListener(textWatcher);
            textWatcher = null;
        }
        // 清理引用
        if (questions != null) {
            questions.clear();
        }
        if (tempAnswers != null) {
            tempAnswers.clear();
        }
    }
}
