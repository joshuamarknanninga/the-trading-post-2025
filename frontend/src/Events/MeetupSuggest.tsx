// frontend/components/Events/MeetupSuggest.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MeetupSuggest({ userEmail }: { userEmail: string }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const submitMeetup = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/meetups/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          location,
          description,
          date: date.toISOString(),
          email: userEmail,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Meetup Suggested!');
        setTitle('');
        setLocation('');
        setDescription('');
        setDate(new Date());
      } else {
        Alert.alert('Error', data.error || 'Could not submit suggestion.');
      }
    } catch (err) {
      Alert.alert('Server Error', 'Unable to connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Suggest a Meetup</Text>
      <TextInput
        style={styles.input}
        placeholder="Meetup Title"
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
      <Button title="Choose Date & Time" onPress={() => setShowPicker(true)} />
      <Text style={styles.dateText}>{date.toLocaleString()}</Text>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
      <Button title="Submit Meetup" onPress={submitMeetup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 20,
  },
  heading: {
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
  dateText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
});
