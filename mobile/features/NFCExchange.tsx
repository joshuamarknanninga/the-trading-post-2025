// frontend/mobile/features/NFCExchange.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';

// Pre-step: initialize NFC
NfcManager.start();

export default function NFCExchange() {
  const [isSupported, setIsSupported] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    NfcManager.isSupported()
      .then(supported => {
        setIsSupported(supported);
      });
  }, []);

  const sendNFCMessage = async () => {
    try {
      await NfcManager.requestTechnology(NfcManager.Tech.Ndef);
      await NfcManager.writeNdefMessage([
        Ndef.textRecord('The Trading Post: Trade confirmed'),
      ]);
      setMessageSent(true);
      Alert.alert('✅ NFC Message Sent');
    } catch (err) {
      Alert.alert('❌ NFC Error', err.message);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤝 NFC Exchange</Text>
      {isSupported ? (
        <>
          <Text style={styles.message}>
            Tap another device to confirm a trade or badge swap.
          </Text>
          <Button title="Send NFC Message" onPress={sendNFCMessage} />
          {messageSent && <Text style={styles.confirmed}>Message sent ✅</Text>}
        </>
      ) : (
        <Text style={styles.error}>NFC is not supported on this device.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  message: {
    marginVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  confirmed: {
    marginTop: 10,
    color: 'green',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
