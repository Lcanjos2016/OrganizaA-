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
  Alert,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { aiApi, getApiErrorMessage } from '../services/api';

export default function ChatBotScreen({ navigation }) {
  
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);

  
  const handleCarregarDocumento = () => {
    setMenuVisivel(false); 
    Alert.alert("Documento", "Aqui abrirá a pasta do celular para escolher um PDF ou DOC.");
  };

  const handleCarregarFoto = () => {
    setMenuVisivel(false); 
    Alert.alert("Foto", "Aqui abrirá a galeria do celular para escolher uma imagem.");
  };

  const handleEnviar = async () => {
    if (!mensagem.trim()) return;

    const texto = mensagem.trim();
    setMensagem('');
    setMensagens((atuais) => [...atuais, { tipo: 'user', texto }]);

    try {
      const resposta = await aiApi.analyzeProgress();
      const dicas = resposta.dicas?.length
        ? resposta.dicas.join('\n')
        : 'Ainda nao encontrei dicas disponiveis para seu progresso.';
      setMensagens((atuais) => [...atuais, { tipo: 'bot', texto: dicas }]);
    } catch (error) {
      setMensagens((atuais) => [...atuais, { tipo: 'bot', texto: getApiErrorMessage(error) }]);
    }
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
                value={mensagem}
                onChangeText={setMensagem}
                onSubmitEditing={handleEnviar}
              />
              
              <TouchableOpacity style={styles.iconMic} onPress={handleEnviar}>
                <Feather name="send" size={22} color="#1C2E4A" />
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
        <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
          {mensagens.map((item, index) => (
            <View key={`${item.tipo}-${index}`} style={[styles.messageBubble, item.tipo === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={styles.messageText}>{item.texto}</Text>
            </View>
          ))}
        </ScrollView>

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

  chatArea: { flex: 1, zIndex: 1, paddingHorizontal: 20, marginTop: 20 },
  chatContent: { paddingBottom: 30 },
  messageBubble: { padding: 12, borderRadius: 12, marginBottom: 10, maxWidth: '88%' },
  userBubble: { backgroundColor: '#FFF', alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#8BAEE0', alignSelf: 'flex-start' },
  messageText: { color: '#1C2E4A', fontWeight: '600', lineHeight: 18 }
});
