import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  return (
    <LinearGradient 
      colors={['#2B4C9B', '#5A82E3', '#FFFFFF']} 
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo Mockup - Substitua pela sua imagem se tiver */}
        <View style={styles.logoContainer}>
           <View style={styles.iconCircle}>
              <Text style={{fontSize: 50}}>🎓</Text>
           </View>
           <Text style={styles.logoText}>OrganizaAÊ</Text>
        </View>

        <Text style={styles.label}>Login</Text>

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

        <TouchableOpacity style={styles.buttonEntrar}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.linkText}>Não é cadastrado? <Text style={{fontWeight: 'bold'}}>Clique aqui</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={{marginTop: 20}}>
          <Text style={styles.sairText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  logoText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  label: { color: '#FFF', fontSize: 18, marginBottom: 20 },
  input: { 
    width: '85%', 
    borderWidth: 2, 
    borderColor: '#FFF', 
    borderRadius: 25, 
    padding: 12, 
    marginBottom: 15, 
    color: '#FFF',
    textAlign: 'center'
  },
  buttonEntrar: { 
    backgroundColor: '#1E3A8A', 
    paddingHorizontal: 50, 
    paddingVertical: 12, 
    borderRadius: 25, 
    marginTop: 20 
  },
  buttonText: { color: '#FFF', fontSize: 18 },
  linkText: { color: '#1E3A8A', marginTop: 30 },
  sairText: { color: '#1E3A8A', fontSize: 16 }
});