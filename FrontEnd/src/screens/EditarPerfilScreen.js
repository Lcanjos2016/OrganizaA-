import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { userApi, getApiErrorMessage } from '../services/api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function EditarPerfilScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await AsyncStorage.getItem(
        '@storage_user_data'
      );

      if (dados) {
        const usuario = JSON.parse(dados);

        setNome(usuario.nome || '');
        setEmail(usuario.email || '');
        setFoto(usuario.foto || null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const escolherFoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Autorize o acesso à galeria.'
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

      if (!result.canceled) {
        setFoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSalvar = async () => {
    try {
      const dadosUsuario = {
        nome,
        email,
        foto,
      };

      await AsyncStorage.setItem(
        '@storage_user_data',
        JSON.stringify(dadosUsuario)
      );

      Alert.alert(
        'Sucesso',
        'Perfil atualizado com sucesso!'
      );

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar os dados.'
      );
    }
  };

  return (
    <LinearGradient
      colors={['#4A69BD', '#EBF3FA', '#4A69BD']}
      style={styles.mainGradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={32}
              color="#1C2E4A"
            />

            <Text style={styles.headerTitle}>
              Editar Perfil
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              name="exit-to-app"
              size={28}
              color="#1C2E4A"
            />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          style={styles.content}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarPlaceholder}>
              {foto ? (
                <Image
                  source={{ uri: foto }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons
                  name="person"
                  size={80}
                  color="#6A7A8C"
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.btnAlterarFoto}
              onPress={escolherFoto}
            >
              <MaterialCommunityIcons
                name="camera"
                size={20}
                color="#1C2E4A"
              />

              <Text style={styles.txtAlterarFoto}>
                Alterar foto de perfil
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              Nome ou Apelido
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Digite seu nome"
              placeholderTextColor="#8DA4C4"
              value={nome}
              onChangeText={setNome}
            />

            <Text
              style={[
                styles.inputLabel,
                { marginTop: 20 },
              ]}
            >
              E-mail
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#8DA4C4"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.footerSection}>
            <TouchableOpacity
              style={styles.btnSalvar}
              onPress={handleSalvar}
            >
              <Text style={styles.btnSalvarText}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainGradient: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 20,
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

  iconButton: {
    padding: 5,
  },

  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },

  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#C8D1DA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  btnAlterarFoto: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  txtAlterarFoto: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },

  inputSection: {
    width: '100%',
    marginBottom: 60,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 10,
    paddingLeft: 10,
  },

  textInput: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#2B4C9B',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1C2E4A',
  },

  footerSection: {
    alignItems: 'center',
    marginBottom: 50,
  },

  btnSalvar: {
    backgroundColor: '#1B3668',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    minWidth: 150,
    alignItems: 'center',
  },

  btnSalvarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
