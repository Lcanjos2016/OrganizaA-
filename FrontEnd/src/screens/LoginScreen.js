import React, { useState, useEffect } from 'react';
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
import { useRoute } from '@react-navigation/native'; // Import necessário
import { authApi, getApiErrorMessage } from '../services/api';

export default function LoginScreen({ navigation }) {
  const route = useRoute(); // Captura os parâmetros passados
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [esconderSenha, setEsconderSenha] = useState(true);

  // Exibe o alerta assim que a tela é carregada, se houver mensagem
  useEffect(() => {
    if (route.params?.mensagem) {
      Alert.alert("Aviso", route.params.mensagem);
    }
  }, [route.params?.mensagem]);

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
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://i.postimg.cc/9fLpppjm/img0303.png' }}
              style={styles.logoImage}
            />
            <Text style={styles.logoText}>Login</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Insira o e-mail"
            placeholderTextColor="#FFF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

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

          <TouchableOpacity 
            style={[styles.buttonEntrar, { marginTop: 40 }]}
            onPress={handleEntrar}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.linkText}>
              Não é cadastrado? <Text style={{ fontWeight: 'bold' }}>Clique aqui</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 50 }}>
           
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // ... (Mantenha seus estilos originais aqui)
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoImage: { width: 220, height: 220, resizeMode: 'contain' },
  logoText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  input: { width: '85%', borderWidth: 2, borderColor: '#FFF', borderRadius: 20, padding: 13, marginBottom: 20, color: '#FFF', textAlign: 'center' },
  passwordContainer: { width: '85%', flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', borderRadius: 20, marginBottom: 20 },
  passwordInput: { flex: 1, padding: 13, color: '#FFF', textAlign: 'center' },
  eyeIcon: { position: 'absolute', right: 15 },
  buttonEntrar: { backgroundColor: '#1E3A8A', paddingHorizontal: 50, paddingVertical: 12, borderRadius: 20 },
  buttonText: { color: '#FFF', fontSize: 18 },
  linkText: { color: '#1E3A8A', marginTop: 25 },
  sairText: { color: '#1E3A8A', fontSize: 16 },
});