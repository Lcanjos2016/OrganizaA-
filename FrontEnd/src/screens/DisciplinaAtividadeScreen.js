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
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

export default function DisciplinaAtividadeScreen({ navigation }) {
  // --- Estado para alternar entre as abas ---
  const [abaAtiva, setAbaAtiva] = useState('Disciplinas');
  
  // --- Estados do Formulário de Disciplinas ---
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');

  // --- Estados do Formulário de Atividades ---
  const [nomeAtividade, setNomeAtividade] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [disciplinaVinculada, setDisciplinaVinculada] = useState('');

  // --- Funções dos botões ---
  const handleSalvar = () => {
    if (abaAtiva === 'Disciplinas') {
      Alert.alert("Sucesso", "Disciplina adicionada com sucesso!");
      setCodigo('');
      setNome('');
    } else {
      Alert.alert("Sucesso", "Atividade adicionada com sucesso!");
      setNomeAtividade('');
      setDataEntrega('');
      setDisciplinaVinculada('');
    }
  };

  const handleExcluir = () => {
    Alert.alert("Atenção", `Os itens selecionados de ${abaAtiva} foram excluídos.`);
  };

  // --- Listas de Exemplo (Apenas Visual) ---
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

  const atividadesExemplo = [
    { id: '1', texto: 'Atividade xxxxxxx . Entregar xx/xx/xxxx - Disciplina xxxxxxx' },
    { id: '2', texto: 'Atividade xxxxxxx . Entregar xx/xx/xxxx - Disciplina xxxxxxx' },
  ];

  return (
    <LinearGradient colors={['#3A5CA8', '#9DBCE0', '#EBF3FA']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* --- Cabeçalho --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="arrow-back-circle-outline" size={32} color="#1C2E4A" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Adicionar Disciplinas e Atividades</Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.iconButton}>
            <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
          </TouchableOpacity>
        </View>

        {/* --- Área Branca Arredondada --- */}
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

            {/* ============================================================== */}
            {/* CONDIÇÃO: SE A ABA FOR 'DISCIPLINAS', MOSTRA ESSE FORMULÁRIO */}
            {/* ============================================================== */}
            {abaAtiva === 'Disciplinas' ? (
              <>
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

                {/* Botão Salvar */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                    <Text style={styles.btnSalvarText}>Salvar</Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de Disciplinas */}
                <View style={styles.listCardDisciplinas}>
                  <Text style={styles.listTitle}>Códigos e disciplinas adicionados</Text>
                  <View style={styles.separator} />
                  
                  <View style={styles.listColumns}>
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
              </>
            ) : (
            /* ============================================================== */
            /* CONDIÇÃO: SE A ABA FOR 'ATIVIDADES', MOSTRA ESSE FORMULÁRIO    */
            /* ============================================================== */
              <>
                <View style={styles.formCard}>
                  <Text style={styles.label}>Atividade:</Text>
                  <TextInput 
                    style={styles.input}
                    value={nomeAtividade}
                    onChangeText={setNomeAtividade}
                  />
                  
                  <Text style={styles.label}>Data de entrega:</Text>
                  <TextInput 
                    style={styles.input}
                    value={dataEntrega}
                    onChangeText={setDataEntrega}
                  />

                  <Text style={styles.label}>Vinculado a disciplina:</Text>
                  <TouchableOpacity style={styles.dropdownInput}>
                    <Text style={{ color: disciplinaVinculada ? '#333' : '#A0A0A0' }}>
                      {disciplinaVinculada || ''}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#1C2E4A" />
                  </TouchableOpacity>
                </View>

                {/* Botão Salvar */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                    <Text style={styles.btnSalvarText}>Salvar</Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de Atividades */}
                <View style={styles.listCardAtividades}>
                  {atividadesExemplo.map((item) => (
                    <View key={item.id} style={styles.listItemAtividade}>
                      <Text style={styles.listItemTextAtividade}>{item.texto}</Text>
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={16} color="#2B4C9B" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* --- Botão Excluir (Aparece para ambas as abas) --- */}
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
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 35, paddingBottom: 25 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C2E4A', textAlign: 'center' },
  iconButton: { padding: 5 },
  
  whiteContainer: {
    flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40,
    paddingTop: 30, paddingHorizontal: 20, elevation: 8, shadowColor: '#000',
    shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: -3 },
  },
  scrollContent: { flexGrow: 1, paddingBottom: 40, alignItems: 'center' },

  // --- Toggle (Abas) ---
  toggleContainer: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 30, borderWidth: 1, borderColor: '#A5C0DF',
    width: '90%', height: 50, marginBottom: 30, elevation: 3, shadowColor: '#000',
    shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, overflow: 'hidden'
  },
  toggleBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 30 },
  toggleBtnActive: { backgroundColor: '#8BAEE0' },
  toggleText: { fontSize: 15, fontWeight: 'bold', color: '#1C2E4A' },
  toggleTextActive: { color: '#1C2E4A' },

  // --- Cartões de Formulário ---
  formCard: {
    backgroundColor: '#A5C0DF', width: '100%', borderRadius: 20, padding: 25, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 15, fontWeight: 'bold', color: '#1C2E4A', marginBottom: 8 },
  input: {
    backgroundColor: '#FFF', borderRadius: 15, height: 45, paddingHorizontal: 15, marginBottom: 20,
    fontSize: 15, color: '#333', elevation: 2,
  },
  dropdownInput: {
    backgroundColor: '#FFF', borderRadius: 15, height: 45, paddingHorizontal: 15, marginBottom: 5,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2,
  },

  // --- Botões Salvar e Excluir ---
  actionRow: { width: '100%', alignItems: 'center', marginBottom: 20 },
  btnSalvar: {
    backgroundColor: '#1B3668', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 20,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  btnSalvarText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  
  btnExcluir: {
    backgroundColor: '#5AD6B6', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 20,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  btnExcluirText: { color: '#1C2E4A', fontWeight: 'bold', fontSize: 14 },

  // --- Lista de Disciplinas ---
  listCardDisciplinas: {
    backgroundColor: '#B7CFF0', width: '100%', borderRadius: 15, padding: 20, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 },
  },
  listTitle: { fontSize: 14, fontWeight: 'bold', color: '#2B4C9B', textAlign: 'center', marginBottom: 8 },
  separator: { height: 1, backgroundColor: '#2B4C9B', marginBottom: 15, opacity: 0.3 },
  listColumns: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, paddingHorizontal: 5 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  listItemText: { fontSize: 11, color: '#1C2E4A', fontWeight: 'bold' },

  // --- Lista de Atividades ---
  listCardAtividades: {
    backgroundColor: '#B7CFF0', width: '100%', borderRadius: 15, paddingVertical: 15, paddingHorizontal: 15, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 },
  },
  listItemAtividade: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5
  },
  listItemTextAtividade: {
    fontSize: 11, color: '#1C2E4A', fontWeight: 'bold', flex: 1, paddingRight: 10
  }
});