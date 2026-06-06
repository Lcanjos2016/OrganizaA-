import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { authApi, getApiErrorMessage } from '../services/api';

export default function LoginScreen({ navigation }) {
  // Estados para os campos obrigatórios
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  // Estado para mostrar/esconder a senha
  const [esconderSenha, setEsconderSenha] = useState(true);

  // Função para validar campos obrigatórios antes de entrar
  const handleEntrar = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Campos Obrigatórios", "Por favor, preencha o e-mail e a senha.");
      return;
    }

    try {
      setCarregando(true);
      await authApi.login(email.trim(), senha);
      navigation.navigate('MainHome', { screen: 'HomeTab' });
    } catch (error) {
      Alert.alert("Erro no login", getApiErrorMessage(error));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <LinearGradient
      colors={['#28468d', '#5a7fd4', '#FFFFFF']}
      style={styles.container}
    >
      {/* Evita que o teclado cubra os inputs no iOS/Android */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
          {/* Logo via Link Direto */}
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://i.postimg.cc/9fLpppjm/img0303.png' }}
              style={styles.logoImage}
            />
            <Text style={styles.logoText}>Login</Text>
          </View>

          {/* Campo de E-mail */}
          <TextInput
            style={styles.input}
            placeholder="Insira o e-mail"
            placeholderTextColor="#FFF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Container do Campo de Senha + Olho */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Insira senha"
              placeholderTextColor="#FFF"
              autoCapitalize="none"
              secureTextEntry={esconderSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setEsconderSenha(!esconderSenha)}
            >
              <Feather 
                name={esconderSenha ? "eye-off" : "eye"} 
                size={20} 
                color="#FFF" 
              />
            </TouchableOpacity>
          </View>

          {/* Botão Entrar com Validação */}
          <TouchableOpacity 
            style={[styles.buttonEntrar, { marginTop: 40 }]}
            onPress={handleEntrar}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>

          {/* Link para Cadastro */}
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.linkText}>
              Não é cadastrado? <Text style={{ fontWeight: 'bold' }}>Clique aqui</Text>
            </Text>
          </TouchableOpacity>

          {/* Botão Sair */}
          <TouchableOpacity style={{ marginTop: 50 }}>
            <Text style={styles.sairText}>Sair</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  logoText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  input: {
    width: '85%',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 20,
    padding: 13,
    marginBottom: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  passwordContainer: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 20,
    marginBottom: 20,
    position: 'relative'
  },
  passwordInput: {
    flex: 1,
    padding: 13,
    color: '#FFF',
    textAlign: 'center',
    paddingLeft: 45, // Equilibra o espaçamento por causa do ícone na direita
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
  buttonEntrar: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 50,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  linkText: {
    color: '#1E3A8A',
    marginTop: 25,
  },
  sairText: {
    color: '#1E3A8A',
    fontSize: 16,
  },
});
