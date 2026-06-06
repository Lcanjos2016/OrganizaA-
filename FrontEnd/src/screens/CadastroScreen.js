import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authApi, getApiErrorMessage } from '../services/api';

const { height } = Dimensions.get('window');

export default function CadastroScreen({ navigation }) {
  const [senhaVisivel, setSenhaVisivel] = useState(false); 
  const [repetirSenhaVisivel, setRepetirSenhaVisivel] = useState(false);
  const [instituicao, setInstituicao] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const opcoes = ['UFAM', 'UEA', 'IFAM'];
  const linkOlhoAberto = 'https://cdn-icons-png.flaticon.com/512/709/709612.png';
  const linkOlhoFechado = 'https://cdn-icons-png.flaticon.com/512/2767/2767146.png';

  const handleCadastro = async () => {
    if (!nomeUsuario.trim() || !email.trim() || !senha || !repetirSenha || !instituicao) {
      Alert.alert("Campos obrigatórios", "Preencha nome, instituição, e-mail e senha.");
      return;
    }

    if (senha !== repetirSenha) {
      Alert.alert("Senha inválida", "As senhas informadas não conferem.");
      return;
    }

    try {
      setCarregando(true);
      await authApi.register({
        nomeUsuario: nomeUsuario.trim(),
        email: email.trim(),
        senha,
        instituicao,
      });
      navigation.navigate('Preferencias');
    } catch (error) {
      Alert.alert("Erro no cadastro", getApiErrorMessage(error));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <LinearGradient colors={['#1d3264', '#4d6fbe', '#FFFFFF']} style={styles.headerGradient}>
          <View style={styles.logoContainer}>
            <Image source={{ uri: 'https://i.postimg.cc/9fLpppjm/img0303.png' }} style={styles.logoImage} />
          </View>
        </LinearGradient>

        <View style={styles.formArea}>
          <Text style={styles.title}>Cadastre - se</Text>

          <View style={styles.inputBox}>
            <TextInput style={styles.input} placeholder="Nome do Usuário" placeholderTextColor="#A0A0A0" value={nomeUsuario} onChangeText={setNomeUsuario} />
          </View>

          <TouchableOpacity style={styles.inputBox} onPress={() => setModalVisivel(true)}>
            <Text style={[styles.input, { color: instituicao ? '#333' : '#A0A0A0', lineHeight: 46 }]}>
              {instituicao || "Selecione Instituição"}
            </Text>
            <Text style={styles.iconFont}>⌄</Text>
          </TouchableOpacity>

          <View style={styles.inputBox}>
            <TextInput style={styles.input} placeholder="Insira e-mail" placeholderTextColor="#A0A0A0" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputBox}>
            <TextInput style={styles.input} placeholder="Insira senha" placeholderTextColor="#A0A0A0" secureTextEntry={!senhaVisivel} value={senha} onChangeText={setSenha} autoCapitalize="none" />
            <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
              <Image source={{ uri: senhaVisivel ? linkOlhoAberto : linkOlhoFechado }} style={styles.iconImage} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputBox}>
            <TextInput style={styles.input} placeholder="Repetir senha" placeholderTextColor="#A0A0A0" secureTextEntry={!repetirSenhaVisivel} value={repetirSenha} onChangeText={setRepetirSenha} autoCapitalize="none" />
            <TouchableOpacity onPress={() => setRepetirSenhaVisivel(!repetirSenhaVisivel)}>
              <Image source={{ uri: repetirSenhaVisivel ? linkOlhoAberto : linkOlhoFechado }} style={styles.iconImage} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.buttonCadastrar} onPress={handleCadastro} disabled={carregando}>
            <Text style={styles.buttonText}>{carregando ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </TouchableOpacity>


          <Text style={styles.loginWith}>Login com</Text>
          <TouchableOpacity style={styles.googleButton}>
             <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} style={{ width: 35, height: 35 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisivel} transparent animationType="none">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisivel(false)}>
          <View style={styles.modalContent}>
            {opcoes.map((item) => (
              <TouchableOpacity key={item} style={styles.optionItem} onPress={() => { setInstituicao(item); setModalVisivel(false); }}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { minHeight: height },
  headerGradient: { height: 220, paddingTop: 40, alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  logoImage: { width: 180, height: 180, resizeMode: 'contain' },
  formArea: { paddingHorizontal: 35, alignItems: 'center', marginTop: -10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2B4C9B', marginBottom: 25 },
  inputBox: { 
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#2B4C9B', 
    borderRadius: 20, 
    marginBottom: 15, 
    paddingHorizontal: 15, 
    height: 50,
  },
  input: { flex: 1, color: '#333', fontSize: 16, height: '100%' },
  iconFont: { fontSize: 20, color: '#2B4C9B', fontWeight: 'bold' },
  iconImage: { width: 22, height: 22, tintColor: '#333' },
  buttonCadastrar: { backgroundColor: '#1E3A8A', width: '70%', paddingVertical: 12, borderRadius: 20, marginTop: 20, alignItems: 'center', elevation: 5 },
  buttonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  loginWith: { marginTop: 20, color: '#666' },
  googleButton: { marginTop: 10, marginBottom: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '70%', backgroundColor: '#FFF', borderRadius: 15, padding: 10 },
  optionItem: { padding: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#EEE' },
  optionText: { fontSize: 18, color: '#2B4C9B', fontWeight: 'bold' }
});
