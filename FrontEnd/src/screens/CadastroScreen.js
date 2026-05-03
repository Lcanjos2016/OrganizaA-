import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CadastroScreen({ navigation }) {
  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <LinearGradient 
        colors={['#2B4C9B', '#FFFFFF']} 
        style={styles.headerGradient}
      >
        <View style={styles.topIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{fontSize: 24}}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{fontSize: 24}}>↪</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoSmall}>
           <Text style={{fontSize: 30}}>🎓</Text>
           <Text style={styles.logoTextSmall}>OrganizaAÊ</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Cadastre - se</Text>

        <View style={styles.inputBox}>
          <TextInput style={styles.input} placeholder="Nome do Usuário" />
          <Text style={styles.iconInside}>👤</Text>
        </View>

        <View style={styles.inputBox}>
          <TextInput style={styles.input} placeholder="Selecione Instituição" />
          <Text style={styles.iconInside}>⌄</Text>
        </View>

        <View style={styles.inputBox}>
          <TextInput style={styles.input} placeholder="Insira e-mail" />
          <Text style={styles.iconInside}>✉</Text>
        </View>

        <View style={styles.inputBox}>
          <TextInput style={styles.input} placeholder="Insira senha" secureTextEntry />
          <Text style={styles.iconInside}>👁</Text>
        </View>

        <View style={styles.inputBox}>
          <TextInput style={styles.input} placeholder="Repetir senha" secureTextEntry />
          <Text style={styles.iconInside}>👁</Text>
        </View>

        <TouchableOpacity style={styles.buttonCadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <Text style={styles.loginWith}>Login com</Text>
        <TouchableOpacity style={styles.googleButton}>
           <Text style={{fontSize: 24}}>G</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: { height: '35%', padding: 20 },
  topIcons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  logoSmall: { alignItems: 'center', marginTop: 10 },
  logoTextSmall: { color: '#FFF', fontWeight: 'bold' },
  formContainer: { alignItems: 'center', paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2B4C9B', marginVertical: 20 },
  inputBox: { 
    width: '85%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: '#2B4C9B', 
    borderRadius: 20, 
    marginBottom: 12,
    paddingHorizontal: 15
  },
  input: { flex: 1, paddingVertical: 10, color: '#333' },
  iconInside: { fontSize: 18, color: '#666' },
  buttonCadastrar: { 
    backgroundColor: '#1E3A8A', 
    paddingHorizontal: 60, 
    paddingVertical: 12, 
    borderRadius: 25, 
    marginTop: 20 
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  loginWith: { marginTop: 20, color: '#666' },
  googleButton: { marginTop: 10, width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' }
});