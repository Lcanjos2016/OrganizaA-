import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, userApi } from '../services/api';

export default function ConfiguracaoScreen({ navigation }) {
  const [userData, setUserData] = useState({
    nome: 'Usuário',
    email: 'email@exemplo.com',
    foto: null,
  });

  const [iaAtivada, setIaAtivada] = useState(true);
  const [notificacoesAtivadas, setNotificacoesAtivadas] =
    useState(true);

  const [curso, setCurso] = useState('');

  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        try {
          const dadosUsuario =
            await AsyncStorage.getItem(
              '@storage_user_data'
            );

          if (dadosUsuario) {
            setUserData(JSON.parse(dadosUsuario));
          }

          const prefs =
            await AsyncStorage.getItem(
              '@user_prefs'
            );

          if (prefs) {
            const dadosPrefs =
              JSON.parse(prefs);

            setCurso(
              dadosPrefs.curso || ''
            );
          }

          const statusIA =
            await AsyncStorage.getItem(
              '@ia_ativada'
            );

          if (statusIA !== null) {
            setIaAtivada(
              JSON.parse(statusIA)
            );
          }

          const statusNotif =
            await AsyncStorage.getItem(
              '@notificacoes_ativadas'
            );

          if (statusNotif !== null) {
            setNotificacoesAtivadas(
              JSON.parse(statusNotif)
            );
          }
        } catch (error) {
          console.log(error);
        }
      };

      carregarDados();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          '#c2d5e5',
          '#EBF3FA',
          '#EBF3FA',
          '#c2d5e5',
        ]}
        style={styles.mainGradient}
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}

          <View style={styles.header}>
            <View
              style={
                styles.headerTitleContainer
              }
            >
              <Feather
                name="settings"
                size={28}
                color="#1C2E4A"
              />

              <Text
                style={styles.headerTitle}
              >
                Configurações
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'Login'
                )
              }
            >
              <MaterialCommunityIcons
                name="logout"
                size={28}
                color="#1C2E4A"
              />
            </TouchableOpacity>
          </View>

          {/* PERFIL */}

          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View
                style={
                  styles.avatarContainer
                }
              >
                {userData?.foto ? (
                  <Image
                    source={{
                      uri: userData.foto,
                    }}
                    style={
                      styles.avatarImage
                    }
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={35}
                    color="#6A7A8C"
                  />
                )}
              </View>

              <View
                style={styles.profileInfo}
              >
                <Text
                  style={
                    styles.profileName
                  }
                >
                  {userData.nome}
                </Text>

                <Text
                  style={
                    styles.profileEmail
                  }
                >
                  {userData.email}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() =>
                  navigation.navigate(
                    'EditarPerfil'
                  )
                }
              >
                <Text
                  style={
                    styles.btnEditarText
                  }
                >
                  Editar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RESUMO */}

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="school-outline"
                size={24}
                color="#1C2E4A"
              />

              <Text
                style={styles.infoLabel}
              >
                Curso
              </Text>

              <Text
                style={styles.infoValue}
              >
                {curso ||
                  'Não informado'}
              </Text>
            </View>

            <View
              style={styles.divider}
            />

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="robot-outline"
                size={24}
                color="#1C2E4A"
              />

              <Text
                style={styles.infoLabel}
              >
                Inteligência Artificial
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  {
                    color: iaAtivada
                      ? 'green'
                      : 'red',
                  },
                ]}
              >
                {iaAtivada
                  ? 'Ativada'
                  : 'Desativada'}
              </Text>
            </View>

            <View
              style={styles.divider}
            />

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="#1C2E4A"
              />

              <Text
                style={styles.infoLabel}
              >
                Notificações
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  {
                    color:
                      notificacoesAtivadas
                        ? 'green'
                        : 'red',
                  },
                ]}
              >
                {notificacoesAtivadas
                  ? 'Ativadas'
                  : 'Desativadas'}
              </Text>
            </View>
          </View>

          {/* MENU */}

          <View style={styles.listCard}>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() =>
                navigation.navigate(
                  'Receber'
                )
              }
            >
              <View
                style={
                  styles.listItemLeft
                }
              >
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color="#1C2E4A"
                />

                <Text
                  style={
                    styles.listItemText
                  }
                >
                  Notificações
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={20}
                color="#1C2E4A"
              />
            </TouchableOpacity>

            <View
              style={styles.divider}
            />

            <TouchableOpacity
              style={styles.listItem}
              onPress={() =>
                navigation.navigate(
                  'PreferenciaConfig'
                )
              }
            >
              <View
                style={
                  styles.listItemLeft
                }
              >
                <Feather
                  name="sliders"
                  size={22}
                  color="#1C2E4A"
                />

                <Text
                  style={
                    styles.listItemText
                  }
                >
                  Preferências
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={20}
                color="#1C2E4A"
              />
            </TouchableOpacity>

            <View
              style={styles.divider}
            />

            <TouchableOpacity
              style={styles.listItem}
              onPress={() =>
                navigation.navigate(
                  'IA'
                )
              }
            >
              <View
                style={
                  styles.listItemLeft
                }
              >
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={24}
                  color="#1C2E4A"
                />

                <Text
                  style={
                    styles.listItemText
                  }
                >
                  IA
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={20}
                color="#1C2E4A"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mainGradient: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 25,
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginLeft: 10,
  },

  card: {
    backgroundColor:
      'rgba(165,192,223,0.6)',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#BDC3C7',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },

  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },

  profileEmail: {
    fontSize: 13,
    color: '#4A5B6D',
  },

  btnEditar: {
    backgroundColor: '#FFF',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
  },

  btnEditarText: {
    fontWeight: 'bold',
    color: '#1C2E4A',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },

  infoLabel: {
    flex: 1,
    marginLeft: 12,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },

  infoValue: {
    fontWeight: 'bold',
  },

  listCard: {
    backgroundColor:
      'rgba(165,192,223,0.6)',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  listItem: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },

  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  listItemText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5B6D',
  },

  divider: {
    height: 1,
    backgroundColor: '#8DA4C4',
    opacity: 0.5,
  },
});
