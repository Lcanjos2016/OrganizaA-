import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AreaEstudoScreen({ navigation }) {
  
  // --- Funções de Navegação do Menu Central ---
  const handleSair = () => navigation.navigate('Login');
  const irParaCronograma = () => navigation.navigate('Cronograma');
  const irParaDisciplinas = () => navigation.navigate('Disciplinas');
  const irParaFaltas = () => navigation.navigate('Faltas');
  const irParaNotas = () => navigation.navigate('SituacaoNotas');

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="bookshelf" size={28} color="#2B4C9B" />
          <Text style={styles.headerTitle}>Área de Estudos</Text>
        </View>
        <TouchableOpacity onPress={handleSair} style={styles.iconButton}>
          <MaterialCommunityIcons name="exit-to-app" size={28} color="#2B4C9B" />
        </TouchableOpacity>
      </View>

      {/* --- Conteúdo Principal com Gradiente --- */}
      <LinearGradient colors={['#2B4C9B', '#9DBCE0', '#EBF3FA']} style={styles.mainGradient}>
        
        {/* --- LOGO --- */}
        <View style={styles.logoContainer}>
          <Image source={{ uri: 'https://i.postimg.cc/9fLpppjm/img0303.png' }} style={styles.logoImage} />
        </View>

        <Text style={styles.subtitle}>O que deseja?</Text>

        {/* --- Botões do Menu Central --- */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuButton} onPress={irParaCronograma}>
            <Text style={styles.menuButtonText}>Montar cronograma</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton} onPress={irParaDisciplinas}>
            <Text style={styles.menuButtonText}>Adicionar Disciplinas{'\n'}e Atividades</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton} onPress={irParaFaltas}>
            <Text style={styles.menuButtonText}>Adicionar Faltas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton} onPress={irParaNotas}>
            <Text style={styles.menuButtonText}>Situação de Notas</Text>
          </TouchableOpacity>
        </View>

        {/* --- Barra de Pesquisa / Dicas (Agora é um botão!) --- */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardWrapper}>
          
          {/* Transformado em TouchableOpacity para levar à tela do ChatBot */}
          <TouchableOpacity 
            style={styles.chatInputContainer} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ChatBot')}
          >
            <View style={styles.chatAvatar}>
              <MaterialCommunityIcons name="robot-outline" size={24} color="#2B4C9B" />
            </View>
            
            {/* editable={false} evita que o teclado abra aqui e garante a navegação */}
            <TextInput 
              style={styles.input} 
              placeholder="Peça suas dicas aqui" 
              placeholderTextColor="#798C9C"
              editable={false} 
              pointerEvents="none" 
            />
            
            <View style={{ paddingRight: 10 }}>
              <Feather name="mic" size={22} color="#2B4C9B" />
            </View>
          </TouchableOpacity>
          
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* --- Menu de Navegação Inferior --- */}
      <View style={styles.bottomNav}>
        
        {/* 1. Engrenagem (Configurações) */}
        <TouchableOpacity>
          <Feather name="settings" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        
        {/* 2. Livros (Disciplinas/Materiais) */}
        <TouchableOpacity>
          <MaterialCommunityIcons name="book-multiple-outline" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        
        {/* 3. Casinha (Ativa: Azul Escuro) */}
        <TouchableOpacity onPress={() => navigation.navigate('Área de Estudos')}>
          <Feather name="home" size={28} color="#1E3A8A" />
        </TouchableOpacity>
        
        {/* 4. Chapéu de Formatura (Inativo: Cinza) -> Vai para Progresso */}
        <TouchableOpacity onPress={() => navigation.navigate('Progresso')}>
          <MaterialCommunityIcons name="school-outline" size={30} color="#6A7A8C" />
        </TouchableOpacity>

        {/* 5. Sino de Notificações (Inativo: Cinza) -> Vai para Notificações */}
        <TouchableOpacity onPress={() => navigation.navigate('Notificacoes')}>
          <Feather name="bell" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        
      </View>

    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 35, paddingBottom: 10, backgroundColor: '#FFF' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2B4C9B', marginLeft: 10 },
  iconButton: { padding: 5 },
  mainGradient: { flex: 1, borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingTop: 15, paddingHorizontal: 25, alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  logoImage: { width: 90, height: 90, resizeMode: 'contain', marginBottom: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 15 },
  menuContainer: { width: '100%' },
  menuButton: { backgroundColor: '#A5C0DF', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 15, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4.5, elevation: 6 },
  menuButtonText: { color: '#1E3A8A', fontSize: 16, fontWeight: 'bold' },
  keyboardWrapper: { width: '100%', marginTop: 'auto', marginBottom: 35 },
  
  // O container do input agora age como um botão
  chatInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#8DA4C4', borderRadius: 30, padding: 6, backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  chatAvatar: { width: 44, height: 44, backgroundColor: '#A5C0DF', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  input: { flex: 1, paddingVertical: 10, color: '#2B4C9B', fontSize: 15, fontWeight: '500' },
  
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 15, paddingBottom: 35, backgroundColor: '#FFF', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: -3 }, shadowRadius: 5 }
});