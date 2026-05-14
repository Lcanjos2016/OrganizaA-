import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function ConfiguracaoScreen({ navigation }) {
  
  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Fundo com Gradiente --- */}
      <LinearGradient 
        colors={['#4A69BD', '#9DBCE0', '#EBF3FA', '#FFFFFF']} 
        style={styles.mainGradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- Cabeçalho --- */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Feather name="settings" size={28} color="#1C2E4A" />
              <Text style={styles.headerTitle}>Configurações</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.iconButton}>
              <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
            </TouchableOpacity>
          </View>

          {/* --- Cartão de Perfil --- */}
          <View style={styles.card}>
            <View style={styles.profileRow}>
              
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={35} color="#6A7A8C" />
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Escolhe nome</Text>
                <Text style={styles.profileEmail}>xxxxxxxx@gmail.com</Text>
              </View>
              
              <TouchableOpacity style={styles.btnEditar}>
                <Text style={styles.btnEditarText}>Editar</Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* --- Cartão de Instituição --- */}
          <View style={styles.card}>
            <View style={styles.instRow}>
              <MaterialCommunityIcons name="school-outline" size={26} color="#1C2E4A" />
              <Text style={styles.instText}>Instituição</Text>
              
              <TouchableOpacity style={styles.dropdownBtn}>
                <Text style={styles.dropdownText}>UFAM</Text>
                <Feather name="chevron-down" size={18} color="#1C2E4A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* --- Lista de Opções --- */}
          <View style={styles.listCard}>
            
            {/* Notificações */}
            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Notificacoes')}>
              <View style={styles.listItemLeft}>
                <MaterialCommunityIcons name="bell-cog-outline" size={24} color="#1C2E4A" />
                <Text style={styles.listItemText}>Notificações</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#1C2E4A" />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            {/* Preferências */}
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <Feather name="sliders" size={22} color="#1C2E4A" />
                <Text style={styles.listItemText}>Preferências</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#1C2E4A" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Ativar/Desativar IA */}
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <MaterialCommunityIcons name="robot-outline" size={24} color="#1C2E4A" />
                <Text style={styles.listItemText}>Ativar/Desativar IA</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#1C2E4A" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Sobre */}
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <Ionicons name="information-circle" size={26} color="#000" />
                <Text style={styles.listItemText}>Sobre</Text>
              </View>
              <Text style={styles.versionText}>Versão 1.0</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </LinearGradient>

      {/* --- Menu de Navegação Inferior --- */}
      <View style={styles.bottomNav}>
        
        {/* 1. Engrenagem (Ativa: Azul Escuro) */}
        <TouchableOpacity onPress={() => navigation.navigate('Configuracao')}>
          <Feather name="settings" size={26} color="#1E3A8A" />
        </TouchableOpacity>
        
        {/* 2. Livros (Disciplinas/Materiais) */}
        <TouchableOpacity>
          <MaterialCommunityIcons name="book-multiple-outline" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        
        {/* 3. Casinha (Voltar para Área de Estudos) */}
        <TouchableOpacity onPress={() => navigation.navigate('AreaEstudo')}>
          <Feather name="home" size={28} color="#6A7A8C" />
        </TouchableOpacity>
        
        {/* 4. Chapéu de Formatura (Ir para Progresso) */}
        <TouchableOpacity onPress={() => navigation.navigate('Progresso')}>
          <MaterialCommunityIcons name="school-outline" size={30} color="#6A7A8C" />
        </TouchableOpacity>
        
        {/* 5. Sino de Notificações */}
        <TouchableOpacity onPress={() => navigation.navigate('Notificacao')}>
          <Feather name="bell" size={26} color="#6A7A8C" />
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  mainGradient: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },

  // --- Cabeçalho ---
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 25, paddingTop: 50, paddingBottom: 25 
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 10 },
  iconButton: { padding: 5 },

  // --- Cartões Base (Fundo Translúcido) ---
  card: {
    backgroundColor: 'rgba(165, 192, 223, 0.6)', 
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // --- Perfil ---
  profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatarContainer: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#BDC3C7',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1C2E4A' },
  profileEmail: { fontSize: 12, color: '#4A5B6D', marginTop: 2 },
  btnEditar: {
    backgroundColor: '#FFF', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }
  },
  btnEditarText: { color: '#1C2E4A', fontWeight: 'bold', fontSize: 13 },

  // --- Instituição ---
  instRow: { flexDirection: 'row', alignItems: 'center' },
  instText: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 15 },
  dropdownBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#8BAEE0',
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15
  },
  dropdownText: { fontSize: 14, fontWeight: 'bold', color: '#1C2E4A', marginRight: 5 },

  // --- Lista de Opções ---
  listCard: {
    backgroundColor: 'rgba(165, 192, 223, 0.6)',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  listItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15
  },
  listItemLeft: { flexDirection: 'row', alignItems: 'center' },
  listItemText: { fontSize: 16, fontWeight: 'bold', color: '#4A5B6D', marginLeft: 15 },
  versionText: { fontSize: 12, fontWeight: 'bold', color: '#6A7A8C' },
  divider: { height: 1, backgroundColor: '#8DA4C4', opacity: 0.5 },

  // --- Menu de Navegação Inferior ---
  bottomNav: { 
    position: 'absolute', bottom: 0, width: '100%',
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    paddingTop: 15, paddingBottom: 35, backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: '#EEE',
    elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: -3 }
  }
});