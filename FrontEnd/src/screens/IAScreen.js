import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
<<<<<<< HEAD
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { userApi, getApiErrorMessage } from '../services/api';
=======
import {
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
>>>>>>> abdab57 (Front Finalizado)

export default function IA({
  navigation,
}) {
  const [iaAtivada, setIaAtivada] =
    useState(true);

<<<<<<< HEAD
  const handleSalvar = async () => {
    try {
      await userApi.savePreferences({ iaAtiva: isEnabled });
      Alert.alert("Sucesso", "Configurações da Inteligência Artificial salvas!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
=======
  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const valor =
      await AsyncStorage.getItem(
        '@ia_ativada'
      );

    if (valor !== null) {
      setIaAtivada(JSON.parse(valor));
    }
  };

  const salvar = async () => {
    await AsyncStorage.setItem(
      '@ia_ativada',
      JSON.stringify(iaAtivada)
    );

    navigation.goBack();
>>>>>>> abdab57 (Front Finalizado)
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          '#9DBCE0',
          '#9DBCE0',
          '#EBF3FA',
          '#FFFFFF',
        ]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons
              name="robot-outline"
              size={30}
              color="#1C2E4A"
            />

            <Text style={styles.title}>
              Inteligência Artificial
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <MaterialCommunityIcons
              name="window-close"
              size={30}
              color="#1C2E4A"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <MaterialCommunityIcons
            name="robot-happy-outline"
            size={60}
            color="#4A69BD"
          />

          <Text style={styles.cardTitle}>
            Assistente Inteligente
          </Text>

          <Text style={styles.cardText}>
            Permite sugestões automáticas,
            lembretes inteligentes e ajuda
            personalizada dentro do app.
          </Text>

          <Switch
            value={iaAtivada}
            onValueChange={setIaAtivada}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={salvar}
        >
          <Text style={styles.buttonText}>
            Salvar
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1C2E4A',
  },

  card: {
    marginTop: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
<<<<<<< HEAD
  }
});
=======
    marginTop: 15,
    color: '#1C2E4A',
  },

  cardText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#6A7A8C',
    lineHeight: 22,
  },

  button: {
    marginTop: 40,
    backgroundColor: '#1C3D7A',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
>>>>>>> abdab57 (Front Finalizado)
