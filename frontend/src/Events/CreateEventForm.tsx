// frontend/components/Events/CreateEventForm.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          location,
          description,
          date: date.toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Event Created');
        setTitle('');
        setLocation('');
        setDescription('');
        setDate(new Date());
        onSuccess?.();
      } else {
        Alert.alert('Error', data.error || 'Could not create event.');
      }
    } catch (err) {
      Alert.alert('Server Error', 'Unable to create event.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Select Date & Time" onPress={() => setShowPicker(true)} />
      <Text style={styles.datePreview}>{date.toLocaleString()}</Text>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(e, selected) => {
            setShowPicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      <Button title="Create Event" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  datePreview: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});
