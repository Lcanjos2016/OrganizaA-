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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ChatBotScreen({ navigation }) {
  
  const [menuVisivel, setMenuVisivel] = useState(false);

  
  const handleCarregarDocumento = () => {
    setMenuVisivel(false); 
    Alert.alert("Documento", "Aqui abrirá a pasta do celular para escolher um PDF ou DOC.");
  };

  const handleCarregarFoto = () => {
    setMenuVisivel(false); 
    Alert.alert("Foto", "Aqui abrirá a galeria do celular para escolher uma imagem.");
  };

  return (
    <LinearGradient 
      colors={['#2B4C9B', '#9DBCE0', '#EBF3FA', '#EBF3FA']} 
      style={styles.mainGradient}
    >
      <SafeAreaView style={styles.container}>
        
        {/* --- Cabeçalho --- */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.robotAvatar}>
              <MaterialCommunityIcons name="robot-outline" size={30} color="#2B4C9B" />
            </View>
            <Text style={styles.headerTitle}>Área de Estudos</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
          </TouchableOpacity>
        </View>

        {/* --- Barra de Entrada (Chat) e Menu Flutuante --- */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardWrapper}
        >
          {/* Usamos uma View (Wrapper) para segurar o input e o menu flutuante juntos */}
          <View style={styles.inputWrapper}>
            
            <View style={styles.inputContainer}>
              {/* Botão de MAIS (+) que abre/fecha o menu */}
              <TouchableOpacity 
                style={styles.iconPlus} 
                onPress={() => setMenuVisivel(!menuVisivel)}
              >
                <Feather name="plus" size={24} color="#1C2E4A" />
              </TouchableOpacity>
              
              <TextInput 
                style={styles.input} 
                placeholder="Peça suas dicas aqui" 
                placeholderTextColor="#A0A0A0"
                autoFocus={true} 
              />
              
              <TouchableOpacity style={styles.iconMic}>
                <Feather name="mic" size={22} color="#1C2E4A" />
              </TouchableOpacity>
            </View>

            {/* --- MENU FLUTUANTE (Só aparece se menuVisivel for TRUE) --- */}
            {menuVisivel && (
              <View style={styles.floatingMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={handleCarregarDocumento}>
                  <MaterialCommunityIcons name="file-document-outline" size={18} color="#1C2E4A" />
                  <Text style={styles.menuItemText}>Carregar Documento</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem} onPress={handleCarregarFoto}>
                  <MaterialCommunityIcons name="image-multiple-outline" size={18} color="#1C2E4A" />
                  <Text style={styles.menuItemText}>Carregar Foto</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </KeyboardAvoidingView>

        {/* --- Área de Mensagens --- */}
        <View style={styles.chatArea}>
          {/* Futuras mensagens renderizadas aqui */}
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  mainGradient: { flex: 1 },
  container: { flex: 1 },
  
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  robotAvatar: {
    width: 50, height: 50, backgroundColor: '#8BAEE0', borderRadius: 25, 
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C2E4A' },
  iconButton: { padding: 5 },

  
  keyboardWrapper: { 
    width: '100%', paddingHorizontal: 20, marginTop: 10, zIndex: 10 
  },
  inputWrapper: {
    position: 'relative', 
  },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    borderRadius: 10, borderWidth: 1, borderColor: '#8DA4C4', 
    paddingHorizontal: 10, height: 50,
  },
  iconPlus: { paddingRight: 10, paddingVertical: 5 },
  input: { flex: 1, fontSize: 15, color: '#333', height: '100%' },
  iconMic: { paddingLeft: 10, paddingVertical: 5 },

  
  floatingMenu: {
    position: 'absolute',
    top: 55, 
    left: 0,
    backgroundColor: '#8BAEE0', 
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    minWidth: 170,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1C2E4A'
  },

  chatArea: { flex: 1, zIndex: 1 } 
});