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
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export default function ChatBotScreen({ navigation }) {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);

  const handleCarregarDocumento = async () => {
    setMenuVisivel(false); 
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        Alert.alert("Sucesso", "Arquivo carregado: " + result.assets[0].name);
        // Lógica para enviar o PDF para a API do Gemini aqui
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o documento.");
    }
  };

  const handleCarregarFoto = async () => {
    setMenuVisivel(false); 
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permissão", "Precisamos de acesso à sua galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert("Sucesso", "Foto carregada com sucesso!");
      // Lógica para enviar a imagem para a API do Gemini aqui
    }
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
          <View style={styles.inputWrapper}>
            
            <View style={styles.inputContainer}>
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
              />
              
              <TouchableOpacity style={styles.iconMic} onPress={handleEnviar}>
                <Feather name="send" size={22} color="#1C2E4A" />
              </TouchableOpacity>
            </View>

            {/* --- MENU FLUTUANTE --- */}
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

        <View style={styles.chatArea} />

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainGradient: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  robotAvatar: { width: 50, height: 50, backgroundColor: '#8BAEE0', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 3 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C2E4A' },
  iconButton: { padding: 5 },
  keyboardWrapper: { width: '100%', paddingHorizontal: 20, marginTop: 10, zIndex: 10 },
  inputWrapper: { position: 'relative' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#8DA4C4', paddingHorizontal: 10, height: 50 },
  iconPlus: { paddingRight: 10, paddingVertical: 5 },
  input: { flex: 1, fontSize: 15, color: '#333', height: '100%' },
  iconMic: { paddingLeft: 10, paddingVertical: 5 },
  floatingMenu: { position: 'absolute', top: 55, left: 0, backgroundColor: '#8BAEE0', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, minWidth: 170, elevation: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  menuItemText: { marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: '#1C2E4A' },
  chatArea: { flex: 1, zIndex: 1 } 
});
