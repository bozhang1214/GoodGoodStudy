import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import type {Question, WrongQuestion} from '../../types';
import {QUESTIONS_PER_PRACTICE, QUESTION_TYPE_SINGLE_CHOICE, QUESTION_TYPE_FILL_BLANK, QUESTION_TYPE_JUDGMENT} from '../../constants';
import {generateMathQuestions} from '../../utils/questionGenerator';
import {getCurrentUserId} from '../../storage/store';
import {
  insertAnswer,
  addWrong,
  removeWrong,
  incrementReviewCount,
} from '../../storage/store';

type Props = {
  subjectId: number;
  grade: number;
  wrongList: WrongQuestion[] | null;
  isReviewMode: boolean;
  onBack: () => void;
};

function checkAnswer(q: Question, answer: string): boolean {
  const trimmed = answer.trim();
  if (q.type === QUESTION_TYPE_JUDGMENT) {
    return (trimmed === '正确') === (q.correctAnswer === '正确');
  }
  return q.correctAnswer === trimmed;
}

const PracticeDetailScreen: React.FC<Props> = ({
  subjectId,
  grade,
  wrongList,
  isReviewMode,
  onBack,
}) => {
  const questions = useMemo(() => {
    if (isReviewMode && wrongList && wrongList.length > 0) {
      return wrongList.map((w) => w.question);
    }
    return generateMathQuestions(grade, QUESTIONS_PER_PRACTICE);
  }, [isReviewMode, wrongList, grade]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [tempAnswers, setTempAnswers] = useState<Record<string, string>>({});
  const [allSubmitted, setAllSubmitted] = useState(false);
  const [resultDialog, setResultDialog] = useState<{
    totalAnswered: number;
    correctCount: number;
    wrongCount: number;
  } | null>(null);

  const q = questions[currentIndex];
  const total = questions.length;
  const allAnswered = total > 0 && questions.every((qu) => (tempAnswers[qu.id] ?? '').trim() !== '');

  const setAnswer = (questionId: string, value: string) => {
    setTempAnswers((prev) => ({...prev, [questionId]: value}));
  };

  const handleSubmitAll = async () => {
    if (allSubmitted || questions.length === 0 || !allAnswered) return;
    const userId = await getCurrentUserId();
    if (userId === -1) return;

    let correctCount = 0;
    for (const qu of questions) {
      const ans = (tempAnswers[qu.id] ?? '').trim();
      if (ans === '') continue;
      const correct = checkAnswer(qu, ans);
      await insertAnswer({
        userId,
        questionId: qu.id,
        userAnswer: ans,
        isCorrect: correct,
        answerTime: Date.now(),
      });
      if (correct) {
        correctCount++;
        if (isReviewMode) await removeWrong(userId, qu.id);
      } else {
        await addWrong({
          userId,
          question: qu,
          userAnswer: ans,
          wrongTime: Date.now(),
          reviewCount: 0,
        });
        if (isReviewMode) await incrementReviewCount(userId, qu.id);
      }
    }

    setAllSubmitted(true);
    setResultDialog({
      totalAnswered: questions.length,
      correctCount,
      wrongCount: questions.length - correctCount,
    });
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.empty}>暂无题目</Text>
      </View>
    );
  }

  const options = q.type === QUESTION_TYPE_SINGLE_CHOICE || q.type === QUESTION_TYPE_JUDGMENT
    ? (q.options ?? ['正确', '错误'])
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          第 {currentIndex + 1} 题 / 共 {total} 题
        </Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.content}>{q.content}</Text>

        {options.length > 0 ? (
          <View style={styles.options}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionRow,
                  tempAnswers[q.id] === opt && styles.optionSelected,
                ]}
                onPress={() => setAnswer(q.id, opt)}>
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="请输入答案"
            value={tempAnswers[q.id] ?? ''}
            onChangeText={(t) => setAnswer(q.id, t)}
            keyboardType="numeric"
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}>
          <Text style={styles.navText}>上一题</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navBtn,
            currentIndex >= total - 1 && styles.navBtnDisabled,
          ]}
          onPress={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
          disabled={currentIndex >= total - 1}>
          <Text style={styles.navText}>下一题</Text>
        </TouchableOpacity>
      </View>

      {!allSubmitted && (
        <TouchableOpacity
          style={[styles.submitBtn, !allAnswered && styles.submitBtnDisabled]}
          onPress={handleSubmitAll}
          disabled={!allAnswered}>
          <Text style={styles.submitText}>提交所有答案</Text>
        </TouchableOpacity>
      )}
      {allSubmitted && (
        <Text style={styles.done}>练习完成！</Text>
      )}

      <Modal
        visible={resultDialog != null}
        transparent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>批改结果</Text>
            {resultDialog && (
              <Text style={styles.modalBody}>
                总答题数：{resultDialog.totalAnswered}{'\n'}
                正确：{resultDialog.correctCount} 题{'\n'}
                错误：{resultDialog.wrongCount} 题{'\n'}
                正确率：
                {resultDialog.totalAnswered > 0
                  ? ((resultDialog.correctCount / resultDialog.totalAnswered) * 100).toFixed(1)
                  : 0}
                %
              </Text>
            )}
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setResultDialog(null);
                onBack();
              }}>
              <Text style={styles.modalBtnText}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    color: '#2196F3',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  headerTitle: {
    fontSize: 14,
    color: '#666',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
  },
  content: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 20,
  },
  options: {
    gap: 8,
  },
  optionRow: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  optionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  optionText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  navBtn: {
    padding: 12,
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  navText: {
    color: '#2196F3',
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  done: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    margin: 16,
  },
  empty: {
    padding: 24,
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalBody: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  modalBtn: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PracticeDetailScreen;
