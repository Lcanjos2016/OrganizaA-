import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function EditarPerfilScreen({ navigation }) {
  
  
  const [nome, setNome] = useState('');

  
  const handleSalvar = () => {
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    navigation.goBack(); 
  };

  return (
    <LinearGradient 
      
      colors={['#4A69BD', '#EBF3FA', '#4A69BD']} 
      style={styles.mainGradient}
    >
      <SafeAreaView style={styles.container}>
        
        {/* --- Cabeçalho --- */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <MaterialCommunityIcons name="account-edit-outline" size={32} color="#1C2E4A" />
            <Text style={styles.headerTitle}>Editar Perfil</Text>
          </View>
          
          {/* Botão de Sair / Voltar */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          {/* --- Área da Foto de Perfil --- */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={80} color="#6A7A8C" />
            </View>
            
            <TouchableOpacity style={styles.btnAlterarFoto} onPress={() => Alert.alert("Foto", "Abrir galeria")}>
              <MaterialCommunityIcons name="account-edit-outline" size={20} color="#1C2E4A" />
              <Text style={styles.txtAlterarFoto}>Alterar foto de perfil</Text>
            </TouchableOpacity>
          </View>

          {/* --- Área do Input (Nome ou Apelido) --- */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Alterar nome ou apelido</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="Nome/Apelido"
              placeholderTextColor="#8DA4C4"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* --- Botão Salvar --- */}
          <View style={styles.footerSection}>
            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
              <Text style={styles.btnSalvarText}>Salvar</Text>
            </TouchableOpacity>
          </View>
          
        </KeyboardAvoidingView>

      </SafeAreaView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  mainGradient: { 
    flex: 1 
  },
  container: { 
    flex: 1 
  },
  
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: 50, 
    paddingBottom: 20 
  },
  headerTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1C2E4A', 
    marginLeft: 10 
  },
  iconButton: { 
    padding: 5 
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
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
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
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
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
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  btnSalvarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});