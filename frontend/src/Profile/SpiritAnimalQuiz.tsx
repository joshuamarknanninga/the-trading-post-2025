// frontend/components/Profile/SpiritAnimalQuiz.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const questions = [
  {
    text: 'How do you prefer to spend your free time?',
    options: [
      { text: 'Exploring nature', value: 'wolf' },
      { text: 'Helping others', value: 'dolphin' },
      { text: 'Working on creative projects', value: 'owl' },
    ],
  },
  {
    text: 'Pick a quality you value most:',
    options: [
      { text: 'Independence', value: 'wolf' },
      { text: 'Empathy', value: 'dolphin' },
      { text: 'Wisdom', value: 'owl' },
    ],
  },
  {
    text: 'How do you approach challenges?',
    options: [
      { text: 'Head-on with determination', value: 'wolf' },
      { text: 'Cooperate and adapt', value: 'dolphin' },
      { text: 'Analyze before acting', value: 'owl' },
    ],
  },
];

export default function SpiritAnimalQuiz() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    const updatedAnswers = [...answers, value];
    setAnswers(updatedAnswers);

    if (updatedAnswers.length === questions.length) {
      const counts: Record<string, number> = {};
      updatedAnswers.forEach((val) => {
        counts[val] = (counts[val] || 0) + 1;
      });
      const topAnimal = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      setResult(topAnimal);
    }
  };

  const restartQuiz = () => {
    setAnswers([]);
    setResult(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Your Spirit Animal is: {result.toUpperCase()} 🐾</Text>
          <TouchableOpacity style={styles.button} onPress={restartQuiz}>
            <Text style={styles.buttonText}>Retake Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        questions.map((q, idx) =>
          idx === answers.length ? (
            <View key={q.text} style={styles.questionBox}>
              <Text style={styles.question}>{q.text}</Text>
              {q.options.map((opt) => (
                <TouchableOpacity
                  key={opt.text}
                  style={styles.option}
                  onPress={() => handleSelect(opt.value)}
                >
                  <Text style={styles.optionText}>{opt.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  questionBox: {
    marginBottom: 30,
    width: '100%',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
  },
  resultBox: {
    alignItems: 'center',
    marginTop: 50,
  },
  resultText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
