// frontend/components/Events/EventCalendar.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
}

export default function EventCalendar({ email }: { email: string }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/events/list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setEvents(data);
      } catch {
        setEvents([]);
      }
    };

    fetchEvents();
  }, [email]);

  const eventsOnDate = events.filter(event => event.date.startsWith(selectedDate));

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#007bff' },
        }}
        theme={{
          todayTextColor: '#007bff',
          arrowColor: '#007bff',
        }}
      />

      {selectedDate ? (
        <>
          <Text style={styles.header}>Events on {selectedDate}</Text>
          <FlatList
            data={eventsOnDate}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventCard}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.time}>{new Date(item.date).toLocaleTimeString()}</Text>
              </View>
            )}
          />
        </>
      ) : (
        <Text style={styles.prompt}>Select a date to view events</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  prompt: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  eventCard: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
});

