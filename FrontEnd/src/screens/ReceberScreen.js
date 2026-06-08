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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { userApi, getApiErrorMessage } from '../services/api';
=======
import {
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
>>>>>>> abdab57 (Front Finalizado)

export default function Receber({ navigation }) {
  const [notificacoes, setNotificacoes] =
    useState(true);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const valor =
      await AsyncStorage.getItem(
        '@notificacoes_ativadas'
      );

    if (valor !== null) {
      setNotificacoes(JSON.parse(valor));
    }
  };

  const salvar = async () => {
    await AsyncStorage.setItem(
      '@notificacoes_ativadas',
      JSON.stringify(notificacoes)
    );

<<<<<<< HEAD
  const handleSalvar = async () => {
    try {
      await userApi.savePreferences({ notificacoesAtivas: isEnabled });
      Alert.alert("Sucesso", "Preferência de notificação salva!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
=======
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
              name="bell-outline"
              size={30}
              color="#1C2E4A"
            />

            <Text style={styles.title}>
              Notificações
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
            name="bell-ring-outline"
            size={55}
            color="#4A69BD"
          />

          <Text style={styles.cardTitle}>
            Receber notificações
          </Text>

          <Text style={styles.cardText}>
            Receba lembretes de tarefas,
            compromissos e avisos do
            aplicativo.
          </Text>

          <Switch
            value={notificacoes}
            onValueChange={
              setNotificacoes
            }
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
    fontSize: 28,
    fontWeight: 'bold',
<<<<<<< HEAD
  }
});
=======
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
