import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AreaEstudoScreen({ navigation }) {
  
  // --- Funções de Navegação ---
  // Quando você criar as outras telas no AppNavigator, basta trocar o console.log
  // pelo comando de navegação, por exemplo: navigation.navigate('Cronograma')
  const handleSair = () => navigation.navigate('Login');
  const irParaCronograma = () => console.log('Navegar para Cronograma');
  const irParaDisciplinas = () => console.log('Navegar para Disciplinas');
  const irParaFaltas = () => console.log('Navegar para Faltas');
  const irParaNotas = () => console.log('Navegar para Notas');

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="bookshelf" size={28} color="#3B4E6B" />
          <Text style={styles.headerTitle}>Área de Estudos</Text>
        </View>
        <TouchableOpacity onPress={handleSair} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={26} color="#3B4E6B" />
        </TouchableOpacity>
      </View>

      {/* --- Conteúdo Principal com Gradiente --- */}
      <LinearGradient 
        colors={['#38519E', '#DCE7F3']} 
        style={styles.mainGradient}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={{ fontSize: 32 }}>🎓</Text>
          </View>
          <Text style={styles.logoText}>OrganizaAê</Text>
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

        {/* --- Barra de Pesquisa / Dicas (Com ajuste para o teclado) --- */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardWrapper}
        >
          <View style={styles.chatInputContainer}>
            <View style={styles.chatAvatar}>
              <Text style={{ fontSize: 20 }}>🤖</Text>
            </View>
            <TextInput 
              style={styles.input} 
              placeholder="Peça suas dicas aqui" 
              placeholderTextColor="#829DC0"
            />
            <TouchableOpacity>
              <Feather name="mic" size={22} color="#3B4E6B" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* --- Menu de Navegação Inferior --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Feather name="settings" size={26} color="#3B4E6B" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="tablet-dashboard" size={26} color="#3B4E6B" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="home" size={28} color="#1A2A4A" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="school-outline" size={28} color="#3B4E6B" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="bell" size={26} color="#3B4E6B" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFF' 
  },
  headerTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#3B4E6B', 
    marginLeft: 10 
  },
  logoutButton: {
    padding: 5,
  },
  mainGradient: { 
    flex: 1, 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    paddingTop: 25, 
    paddingHorizontal: 25,
    alignItems: 'center'
  },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  logoIcon: { 
    width: 65, 
    height: 65, 
    borderRadius: 35, 
    borderWidth: 2, 
    borderColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  logoText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  subtitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#FFF', 
    marginBottom: 20 
  },
  menuContainer: { 
    width: '100%' 
  },
  menuButton: { 
    backgroundColor: '#B4C7DF', 
    paddingVertical: 18, 
    paddingHorizontal: 20, 
    borderRadius: 15, 
    marginBottom: 15,
    // Efeitos de sombra para o botão saltar na tela (Neumorfismo leve)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5 
  },
  menuButtonText: { 
    color: '#2B3F66', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  keyboardWrapper: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 20,
  },
  chatInputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: '#829DC0', 
    borderRadius: 30, 
    padding: 6, 
    paddingRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Fundo levemente translúcido
  },
  chatAvatar: { 
    width: 42, 
    height: 42, 
    backgroundColor: '#B4C7DF', 
    borderRadius: 21, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  input: { 
    flex: 1, 
    paddingVertical: 10, 
    color: '#3B4E6B', 
    fontSize: 15,
    fontWeight: '500'
  },
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingVertical: 15, 
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#EAEAEA',
    elevation: 10, // Sombra sutil na barra de baixo
  }
});