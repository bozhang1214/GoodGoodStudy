import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SUBJECT_MATH, MIN_GRADE, QUESTIONS_PER_PRACTICE} from '../../constants';

const SUBJECTS = [
  {id: 1, name: '语文'},
  {id: 2, name: '数学'},
  {id: 3, name: '英语'},
];
const GRADES = [1, 2, 3, 4, 5, 6];

type Props = {
  onStartPractice: (subjectId: number, grade: number) => void;
};

const PracticeScreen: React.FC<Props> = ({onStartPractice}) => {
  const [subjectId, setSubjectId] = useState(SUBJECT_MATH);
  const [grade, setGrade] = useState(MIN_GRADE);

  const canStart = subjectId === SUBJECT_MATH;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>练习</Text>

      <Text style={styles.label}>选择科目</Text>
      <View style={styles.chipRow}>
        {SUBJECTS.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.chip, subjectId === s.id && styles.chipSelected]}
            onPress={() => setSubjectId(s.id)}>
            <Text style={[styles.chipText, subjectId === s.id && styles.chipTextSelected]}>
              {s.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>选择年级</Text>
      <View style={styles.chipRow}>
        {GRADES.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, grade === g && styles.chipSelected]}
            onPress={() => setGrade(g)}>
            <Text style={[styles.chipText, grade === g && styles.chipTextSelected]}>
              {g}年级
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {subjectId === SUBJECT_MATH && (
        <Text style={styles.hint}>将生成 {QUESTIONS_PER_PRACTICE} 道数学题</Text>
      )}
      {!canStart && (
        <Text style={styles.hint}>当前仅支持数学练习</Text>
      )}

      <TouchableOpacity
        style={[styles.button, !canStart && styles.buttonDisabled]}
        onPress={() => canStart && onStartPractice(subjectId, grade)}
        disabled={!canStart}>
        <Text style={styles.buttonText}>开始练习</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  chipSelected: {
    backgroundColor: '#2196F3',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
  },
  hint: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PracticeScreen;
