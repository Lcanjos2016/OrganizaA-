import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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

  const validarDados = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;

    if (!nomeUsuario.trim() || !email.trim() || !senha || !repetirSenha || !instituicao) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("E-mail inválido", "O e-mail deve seguir o formato nome@dominio.com");
      return false;
    }
    if (!senhaRegex.test(senha)) {
      Alert.alert("Senha insegura", "A senha deve ter: 8+ caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.");
      return false;
    }
    if (senha !== repetirSenha) {
      Alert.alert("Senha inválida", "As senhas não conferem.");
      return false;
    }
    return true;
  };

  const handleCadastro = () => {
    if (!validarDados()) return;

    Alert.alert(
      "Confirmar",
      "Deseja realmente finalizar o cadastro?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: () => enviarDados() }
      ]
    );
  };

  const enviarDados = async () => {
    try {
      setCarregando(true);
      await authApi.register({
        nomeUsuario: nomeUsuario.trim(),
        email: email.trim(),
        senha,
        instituicao,
      });
      navigation.navigate('Login', { mensagem: 'Cadastro realizado com sucesso!' });
    } catch (error) {
      Alert.alert("Erro no cadastro", getApiErrorMessage(error));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <LinearGradient colors={['#1d3264', '#4d6fbe', '#FFFFFF']} style={styles.headerGradient}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: 'https://i.postimg.cc/9fLpppjm/img0303.png' }} style={styles.logoImage} />
            </View>
          </LinearGradient>

          <View style={styles.formArea}>
            <Text style={styles.title}>Cadastre-se</Text>

            <View style={styles.inputBox}>
              <TextInput style={styles.input} placeholder="Nome do Usuário" maxLength={30} placeholderTextColor="#A0A0A0" value={nomeUsuario} onChangeText={setNomeUsuario} />
            </View>

            <TouchableOpacity style={styles.inputBox} onPress={() => setModalVisivel(true)}>
              <Text style={[styles.input, { color: instituicao ? '#333' : '#A0A0A0', lineHeight: 46 }]}>
                {instituicao || "Selecione Instituição"}
              </Text>
              <Text style={styles.iconFont}>⌄</Text>
            </TouchableOpacity>

            <View style={styles.inputBox}>
              <TextInput style={styles.input} placeholder="Insira e-mail (ex: email@site.com)" placeholderTextColor="#A0A0A0" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.passwordWrapper}>
              <View style={styles.inputBox}>
                <TextInput style={styles.input} placeholder="Insira senha" placeholderTextColor="#A0A0A0" maxLength={20} secureTextEntry={!senhaVisivel} value={senha} onChangeText={setSenha} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                  <Image source={{ uri: senhaVisivel ? linkOlhoAberto : linkOlhoFechado }} style={styles.iconImage} />
                </TouchableOpacity>
              </View>
              <Text style={styles.infoText}>* 8+ caracteres, letra maiúscula, letra minúscula, números e símbolos.</Text>
            </View>

            <View style={styles.inputBox}>
              <TextInput style={styles.input} placeholder="Repetir senha" placeholderTextColor="#A0A0A0" maxLength={20} secureTextEntry={!repetirSenhaVisivel} value={repetirSenha} onChangeText={setRepetirSenha} autoCapitalize="none" />
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

            {/* NOVO BOTÃO PARA VOLTAR AO LOGIN */}
            <TouchableOpacity style={styles.loginRedirectButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginRedirectText}>
                Já tem uma conta? <Text style={styles.loginRedirectLink}>Entre aqui</Text>
              </Text>
            </TouchableOpacity>

          </View>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  headerGradient: { height: 220, paddingTop: 40, alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  logoImage: { width: 180, height: 180, resizeMode: 'contain' },
  formArea: { paddingHorizontal: 35, alignItems: 'center', marginTop: -10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2B4C9B', marginBottom: 25 },
  inputBox: { width: '100%', flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#2B4C9B', borderRadius: 20, marginBottom: 15, paddingHorizontal: 15, height: 50 },
  input: { flex: 1, color: '#333', fontSize: 16, height: '100%' },
  iconFont: { fontSize: 20, color: '#2B4C9B', fontWeight: 'bold' },
  iconImage: { width: 22, height: 22, tintColor: '#333' },
  passwordWrapper: { width: '100%' },
  infoText: { fontSize: 8, color: '#b11111', marginTop: -10, marginBottom: 10, marginLeft: 15 },
  buttonCadastrar: { backgroundColor: '#1E3A8A', width: '70%', paddingVertical: 12, borderRadius: 20, marginTop: 20, alignItems: 'center', elevation: 5 },
  buttonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  loginWith: { marginTop: 20, color: '#666' },
  googleButton: { marginTop: 10, marginBottom: 15 }, // Diminuído o marginBottom de 30 para 15 para aproximar o texto abaixo
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '70%', backgroundColor: '#FFF', borderRadius: 15, padding: 10 },
  optionItem: { padding: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#EEE' },
  optionText: { fontSize: 18, color: '#2B4C9B', fontWeight: 'bold' },
  
  // ESTILOS DO NOVO BOTÃO
  loginRedirectButton: { marginTop: 10, marginBottom: 30, padding: 10 },
  loginRedirectText: { fontSize: 15, color: '#666' },
  loginRedirectLink: { color: '#1E3A8A', fontWeight: 'bold', textDecorationLine: 'underline' }
});