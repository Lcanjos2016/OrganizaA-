import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AreaEstudoScreen({ navigation }) {
  
  const irParaCronograma = () => navigation.navigate('Cronograma');
  const irParaDisciplinas = () => navigation.navigate('DisciplinaAtividade');
  const irParaFaltas = () => navigation.navigate('Faltas');
  const irParaNotas = () => navigation.navigate('Notas');

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho (Sem botão de sair) --- */}
      <View style={styles.header}>
        {/* Espaçador do lado esquerdo para ajudar na centralização */}
        <View style={styles.headerSpacer} />
        
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="bookshelf" size={28} color="#2B4C9B" />
          <Text style={styles.headerTitle}>Área de Estudos</Text>
        </View>
        
        {/* Espaçador do lado direito substituindo o botão de logout */}
        <View style={styles.headerSpacer} />
      </View>

      {/* --- Conteúdo Principal com Gradiente --- */}
      <LinearGradient colors={['#6482c8', '#9DBCE0', '#EBF3FA']} style={styles.mainGradient}>
        
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

      </LinearGradient>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 35, paddingBottom: 10, backgroundColor: '#FFF' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2B4C9B', marginLeft: 10 },
  headerSpacer: { width: 38 }, // Garante que o título permaneça alinhado no meio certinho
  mainGradient: { flex: 1, borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingTop: 25, paddingHorizontal: 25, alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  logoImage: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 20 },
  menuContainer: { width: '100%', flex: 1, justifyContent: 'center', paddingBottom: 40 },
  menuButton: { backgroundColor: '#A5C0DF', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 15, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4.5, elevation: 6 },
  menuButtonText: { color: '#1E3A8A', fontSize: 17, fontWeight: 'bold' }
});