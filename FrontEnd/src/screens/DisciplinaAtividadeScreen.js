import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function DisciplinaAtividadeScreen({ navigation }) {
  // Estado para alternar entre as abas 'Disciplinas' e 'Atividades'
  const [abaAtiva, setAbaAtiva] = useState('Disciplinas');
  
  // Estados para os inputs
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');

  // Funções dos botões
  const handleSalvar = () => {
    Alert.alert("Sucesso", "Disciplina adicionada com sucesso no teste!");
    setCodigo('');
    setNome('');
  };

  const handleExcluir = () => {
    Alert.alert("Atenção", "Os itens selecionados foram excluídos.");
  };

  // Lista de exemplo para preencher o quadro de baixo
  const disciplinasExemplo = [
    { id: '1', texto: '1 - xxxxxxxxxxxxxxx' },
    { id: '2', texto: '2 - xxxxxxxxxxxxxxx' },
    { id: '3', texto: '3 - xxxxxxxxxxxxxxx' },
    { id: '4', texto: '4 - xxxxxxxxxxxxxxx' },
    { id: '5', texto: '5 - xxxxxxxxxxxxxxx' },
    { id: '6', texto: '6 - xxxxxxxxxxxxxxx' },
    { id: '7', texto: '7 - xxxxxxxxxxxxxxx' },
    { id: '8', texto: '8 - xxxxxxxxxxxxxxx' },
  ];

  return (
    <LinearGradient colors={['#3A5CA8', '#9DBCE0', '#EBF3FA']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* --- Cabeçalho --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="arrow-back-circle-outline" size={32} color="#1C2E4A" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Adicionar Disciplinas e{'\n'}Atividades</Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.iconButton}>
            <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
          </TouchableOpacity>
        </View>

        {/* --- Área Branca Arredondada (Resto da tela) --- */}
        <View style={styles.whiteContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* --- Toggle (Abas: Disciplinas / Atividades) --- */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleBtn, abaAtiva === 'Disciplinas' && styles.toggleBtnActive]}
                onPress={() => setAbaAtiva('Disciplinas')}
              >
                <Text style={[styles.toggleText, abaAtiva === 'Disciplinas' && styles.toggleTextActive]}>
                  Disciplinas
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.toggleBtn, abaAtiva === 'Atividades' && styles.toggleBtnActive]}
                onPress={() => setAbaAtiva('Atividades')}
              >
                <Text style={[styles.toggleText, abaAtiva === 'Atividades' && styles.toggleTextActive]}>
                  Atividades
                </Text>
              </TouchableOpacity>
            </View>

            {/* --- Formulário (Cartão Azul Central) --- */}
            <View style={styles.formCard}>
              <Text style={styles.label}>Código da disciplina:</Text>
              <TextInput 
                style={styles.input}
                value={codigo}
                onChangeText={setCodigo}
              />
              
              <Text style={styles.label}>Nome da disciplina:</Text>
              <TextInput 
                style={styles.input}
                value={nome}
                onChangeText={setNome}
              />
            </View>

            {/* --- Botão Salvar --- */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                <Text style={styles.btnSalvarText}>Salvar</Text>
              </TouchableOpacity>
            </View>

            {/* --- Lista de Disciplinas Adicionadas (Cartão Inferior) --- */}
            <View style={styles.listCard}>
              <Text style={styles.listTitle}>Códigos e disciplinas adicionados</Text>
              <View style={styles.separator} />
              
              <View style={styles.listColumns}>
                {/* Coluna 1 (Itens 1 a 4) */}
                <View style={styles.column}>
                  {disciplinasExemplo.slice(0, 4).map((item) => (
                    <View key={item.id} style={styles.listItem}>
                      <Text style={styles.listItemText}>{item.texto}</Text>
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={14} color="#2B4C9B" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                
                {/* Coluna 2 (Itens 5 a 8) */}
                <View style={styles.column}>
                  {disciplinasExemplo.slice(4, 8).map((item) => (
                    <View key={item.id} style={styles.listItem}>
                      <Text style={styles.listItemText}>{item.texto}</Text>
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={14} color="#2B4C9B" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* --- Botão Excluir --- */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.btnExcluir} onPress={handleExcluir}>
                <Text style={styles.btnExcluirText}>Excluir</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  // Fundo principal agora é o gradiente em si
  container: { 
    flex: 1,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 35, 
    paddingBottom: 25, 
    // Header não tem fundo branco, acompanha o gradiente
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1C2E4A', // Azul bem escuro
    textAlign: 'center',
  },
  iconButton: { 
    padding: 5,
  },
  
  // Painel branco principal que sobe
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingHorizontal: 20,
    // Sombra para destacar o arredondamento em cima
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -3 },
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    alignItems: 'center', // Centraliza os elementos
  },

  // --- Toggle (Abas) ---
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 30,
    width: '90%',
    height: 50,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  toggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  toggleBtnActive: {
    backgroundColor: '#8BAEE0', // Azul claro/médio do botão ativo
  },
  toggleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },
  toggleTextActive: {
    color: '#1C2E4A',
  },

  // --- Formulário (Cartão Central) ---
  formCard: {
    backgroundColor: '#A5C0DF',
    width: '100%',
    borderRadius: 20,
    padding: 25,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 15,
    color: '#333',
    elevation: 2, // Leve sombra interna/externa na caixa de texto
  },

  // --- Botão Salvar ---
  actionRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  btnSalvar: {
    backgroundColor: '#1B3668',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  btnSalvarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- Cartão Inferior (Lista) ---
  listCard: {
    backgroundColor: '#B7CFF0',
    width: '100%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B4C9B',
    textAlign: 'center',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#2B4C9B',
    marginBottom: 15,
    opacity: 0.3,
  },
  listColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 11,
    color: '#1C2E4A',
    fontWeight: 'bold',
  },

  // --- Botão Excluir ---
  btnExcluir: {
    backgroundColor: '#5AD6B6', // Ciano/Verde Água
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  btnExcluirText: {
    color: '#1C2E4A',
    fontWeight: 'bold',
    fontSize: 16,
  }
});