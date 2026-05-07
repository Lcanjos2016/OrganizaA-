import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#28468d', '#5a7fd4', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo via Link Direto */}
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
        />

        <TextInput
          style={styles.input}
          placeholder="Insira senha"
          placeholderTextColor="#FFF"
          secureTextEntry
        />

        <TouchableOpacity style={[styles.buttonEntrar, { marginTop: 50 }]}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.linkText}>
            Não é cadastrado? <Text style={{ fontWeight: 'bold' }}>Clique aqui</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 60 }}>
          <Text style={styles.sairText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    // Sombra para destacar a logo
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  logoText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  label: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '85%',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 20,
    padding: 13,
    marginBottom: 25,
    color: '#FFF',
    textAlign: 'center',
  },
  buttonEntrar: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 50,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  linkText: {
    color: '#1E3A8A',
    marginTop: 30,
  },
  sairText: {
    color: '#1E3A8A',
    fontSize: 16,
  },
});