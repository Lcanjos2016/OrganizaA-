import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { disciplineApi, activityApi, getApiErrorMessage } from '../services/api';

const normalizarData = (texto) => {
  const valor = texto.trim();
  const partes = valor.split('/');
  if (partes.length === 3) {
    const [dia, mes, ano] = partes;
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }
  return valor;
};

export default function DisciplinaAtividadeScreen({ navigation }) {
  
  const [abaAtiva, setAbaAtiva] = useState('Disciplinas');
  
  // --- Estados dos Formulários ---
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');

  const [nomeAtividade, setNomeAtividade] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [disciplinaVinculada, setDisciplinaVinculada] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // --- Estados das Listas Dinâmicas ---
  const [disciplinas, setDisciplinas] = useState([]);
  const [atividades, setAtividades] = useState([]);

  // --- Estados de Seleção para Exclusão ---
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState([]);
  const [atividadesSelecionadas, setAtividadesSelecionadas] = useState([]);

  // Carregar dados salvos ao iniciar a tela
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [disciplinasApi, atividadesApi] = await Promise.all([
          disciplineApi.list(),
          activityApi.list(),
        ]);
        setDisciplinas(disciplinasApi);
        setAtividades(atividadesApi);
        await AsyncStorage.setItem('@storage_disciplinas', JSON.stringify(disciplinasApi));
        await AsyncStorage.setItem('@storage_atividades', JSON.stringify(atividadesApi));
      } catch (error) {
        console.log("Erro ao carregar dados iniciais:", error);
      }
    };
    carregarDadosIniciais();
  }, []);

  // --- Funções de Persistência ---
  const salvarDisciplinasNoStorage = async (novaLista) => {
    try {
      await AsyncStorage.setItem('@storage_disciplinas', JSON.stringify(novaLista));
    } catch (error) {
      console.log("Erro ao salvar disciplinas:", error);
    }
  };

  const salvarAtividadesNoStorage = async (novaLista) => {
    try {
      await AsyncStorage.setItem('@storage_atividades', JSON.stringify(novaLista));
    } catch (error) {
      console.log("Erro ao salvar atividades:", error);
    }
  };

  // --- Ações de Salvar ---
  const handleSalvar = async () => {
    if (abaAtiva === 'Disciplinas') {
      if (!codigo.trim() || !nome.trim()) {
        Alert.alert("Aviso", "Por favor, preencha o código e o nome da disciplina.");
        return;
      }

      try {
        const novaDisciplina = await disciplineApi.create({
          codigoDisciplina: codigo.trim().toUpperCase(),
          nomeDisciplina: nome.trim(),
        });
        const listaAtualizada = [...disciplinas, novaDisciplina];
        setDisciplinas(listaAtualizada);
        salvarDisciplinasNoStorage(listaAtualizada);

        Alert.alert("Sucesso", "Disciplina adicionada com sucesso!");
        setCodigo('');
        setNome('');
      } catch (error) {
        Alert.alert("Erro", getApiErrorMessage(error));
      }
    } else {
      if (!nomeAtividade.trim() || !dataEntrega.trim() || !disciplinaVinculada) {
        Alert.alert("Aviso", "Por favor, preencha todos os campos da atividade.");
        return;
      }

      try {
        const disciplina = disciplinas.find((item) => item.nome === disciplinaVinculada);
        const novaAtividade = await activityApi.create({
          topicoEstudo: nomeAtividade.trim(),
          dataAtividade: normalizarData(dataEntrega),
          idDisciplina: disciplina?.idDisciplina,
          tipoAtividade: 'Entrega',
          duracaoMinutos: 60,
        });
        const listaAtualizada = [...atividades, novaAtividade];
        setAtividades(listaAtualizada);
        salvarAtividadesNoStorage(listaAtualizada);

        Alert.alert("Sucesso", "Atividade adicionada com sucesso!");
        setNomeAtividade('');
        setDataEntrega('');
        setDisciplinaVinculada('');
      } catch (error) {
        Alert.alert("Erro", getApiErrorMessage(error));
      }
    }
  };

  // --- Alternar Status de Concluído da Atividade ---
  const toggleConcluirAtividade = async (id) => {
    const atividadeAtual = atividades.find((atividade) => atividade.id === id);
    if (!atividadeAtual) return;

    try {
      const atualizada = await activityApi.update(id, { concluida: !atividadeAtual.feita });
      const listaAtualizada = atividades.map(atividade => {
      if (atividade.id === id) {
        return atualizada;
      }
      return atividade;
    });

      setAtividades(listaAtualizada);
      salvarAtividadesNoStorage(listaAtualizada);
    } catch (error) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
  };

  // --- Gerenciamento de Seleção (Checkbox para Exclusão) ---
  const toggleSelecioneDisciplina = (id) => {
    if (disciplinasSelecionadas.includes(id)) {
      setDisciplinasSelecionadas(disciplinasSelecionadas.filter(item => item !== id));
    } else {
      setDisciplinasSelecionadas([...disciplinasSelecionadas, id]);
    }
  };

  const toggleSelecioneAtividade = (id) => {
    if (atividadesSelecionadas.includes(id)) {
      setAtividadesSelecionadas(atividadesSelecionadas.filter(item => item !== id));
    } else {
      setAtividadesSelecionadas([...atividadesSelecionadas, id]);
    }
  };

  // --- Ação de Excluir ---
  const handleExcluir = () => {
    if (abaAtiva === 'Disciplinas') {
      if (disciplinasSelecionadas.length === 0) {
        Alert.alert("Aviso", "Nenhuma disciplina selecionada para excluir.");
        return;
      }

      Alert.alert(
        "Confirmar Exclusão",
        "Deseja mesmo excluir as disciplinas selecionadas?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            style: "destructive",
            onPress: async () => {
              try {
                await Promise.all(disciplinasSelecionadas.map((id) => disciplineApi.remove(id)));
                const listaFiltrada = disciplinas.filter(item => !disciplinasSelecionadas.includes(item.id));
                setDisciplinas(listaFiltrada);
                salvarDisciplinasNoStorage(listaFiltrada);
                setDisciplinasSelecionadas([]); 
                Alert.alert("Sucesso", "Disciplinas excluídas.");
              } catch (error) {
                Alert.alert("Erro", getApiErrorMessage(error));
              }
            }
          }
        ]
      );
    } else {
      if (atividadesSelecionadas.length === 0) {
        Alert.alert("Aviso", "Nenhuma atividade selecionada para excluir.");
        return;
      }

      Alert.alert(
        "Confirmar Exclusão",
        "Deseja mesmo excluir as atividades selecionadas?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            style: "destructive",
            onPress: async () => {
              try {
                await Promise.all(atividadesSelecionadas.map((id) => activityApi.remove(id)));
                const listaFiltrada = atividades.filter(item => !atividadesSelecionadas.includes(item.id));
                setAtividades(listaFiltrada);
                salvarAtividadesNoStorage(listaFiltrada);
                setAtividadesSelecionadas([]); 
                Alert.alert("Sucesso", "Atividades excluídas.");
              } catch (error) {
                Alert.alert("Erro", getApiErrorMessage(error));
              }
            }
          }
        ]
      );
    }
  };

  return (
    <LinearGradient colors={['#B3C9EC', '#CBDFFF', '#EBF3FA']} style={styles.container}>
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
            
            {/* --- Toggle Estilo Pílula --- */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[
                  styles.toggleBtn, 
                  abaAtiva === 'Disciplinas' ? styles.toggleBtnActive : styles.toggleBtnInactive
                ]}
                onPress={() => setAbaAtiva('Disciplinas')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.toggleText,
                  abaAtiva === 'Disciplinas' ? styles.toggleTextActive : styles.toggleTextInactive
                ]}>
                  Disciplinas
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.toggleBtn, 
                  abaAtiva === 'Atividades' ? styles.toggleBtnActive : styles.toggleBtnInactive
                ]}
                onPress={() => setAbaAtiva('Atividades')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.toggleText,
                  abaAtiva === 'Atividades' ? styles.toggleTextActive : styles.toggleTextInactive
                ]}>
                  Atividades
                </Text>
              </TouchableOpacity>
            </View>

            {/* --- CONTEÚDO DINÂMICO DA ABA DISCIPLINAS --- */}
            {abaAtiva === 'Disciplinas' ? (
              <>
                <View style={styles.formCard}>
                  <Text style={styles.label}>Código da disciplina:</Text>
                  <TextInput 
                    style={styles.input}
                    value={codigo}
                    onChangeText={setCodigo}
                    placeholder="Ex: GCC123"
                    placeholderTextColor="#A0A0A0"
                  />
                  
                  <Text style={styles.label}>Nome da disciplina:</Text>
                  <TextInput 
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Ex: Engenharia de Software"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                    <Text style={styles.btnSalvarText}>Salvar</Text>
                  </TouchableOpacity>
                </View>

                {/* Lista Dinâmica de Disciplinas */}
                <View style={styles.listCardDisciplinas}>
                  <Text style={styles.listTitle}>Codes e disciplinas adicionados</Text>
                  <View style={styles.separator} />
                  
                  {disciplinas.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma disciplina cadastrada.</Text>
                  ) : (
                    <View style={styles.listGrid}>
                      {disciplinas.map((item) => {
                        const isSelecionado = disciplinasSelecionadas.includes(item.id);
                        return (
                          <View key={item.id} style={styles.listItem}>
                            <Text style={styles.listItemText} numberOfLines={1}>
                              {item.codigo} - {item.nome}
                            </Text>
                            <TouchableOpacity onPress={() => toggleSelecioneDisciplina(item.id)}>
                              <MaterialCommunityIcons 
                                name={isSelecionado ? "checkbox-marked" : "checkbox-blank-outline"} 
                                size={18} 
                                color="#2B4C9B" 
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </>
            ) : (
              <>
                {/* --- CONTEÚDO DINÂMICO DA ABA ATIVIDADES --- */}
                <View style={styles.formCard}>
                  <Text style={styles.label}>Atividade:</Text>
                  <TextInput 
                    style={styles.input}
                    value={nomeAtividade}
                    onChangeText={setNomeAtividade}
                    placeholder="Ex: Prova 1 ou Checklist"
                    placeholderTextColor="#A0A0A0"
                  />
                  
                  <Text style={styles.label}>Data de entrega:</Text>
                  <TextInput 
                    style={styles.input}
                    value={dataEntrega}
                    onChangeText={setDataEntrega}
                    placeholder="Ex: DD/MM/AAAA"
                    placeholderTextColor="#A0A0A0"
                  />

                  <Text style={styles.label}>Vinculado a disciplina:</Text>
                  <TouchableOpacity style={styles.dropdownInput} onPress={() => setModalVisible(true)}>
                    <Text style={{ color: disciplinaVinculada ? '#333' : '#A0A0A0' }}>
                      {disciplinaVinculada || 'Selecione uma disciplina'}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#1C2E4A" />
                  </TouchableOpacity>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                    <Text style={styles.btnSalvarText}>Salvar</Text>
                  </TouchableOpacity>
                </View>

                {/* Lista Dinâmica de Atividades com Feedback Explicito de Status */}
                <View style={styles.listCardAtividades}>
                  {atividades.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma atividade cadastrada.</Text>
                  ) : (
                    atividades.map((item) => {
                      const isSelecionadoExcluir = atividadesSelecionadas.includes(item.id);
                      return (
                        <View 
                          key={item.id} 
                          style={[
                            styles.listItemAtividade, 
                            item.feita && { backgroundColor: 'rgba(76, 175, 80, 0.15)' } // Fundo levemente verde se concluído
                          ]}
                        >
                          {/* Botão Concluir com Feedback de Toque */}
                          <TouchableOpacity 
                            onPress={() => toggleConcluirAtividade(item.id)}
                            style={styles.btnCheckboxConcluir}
                            activeOpacity={0.7}
                          >
                            <MaterialCommunityIcons 
                              name={item.feita ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                              size={24} 
                              color={item.feita ? "#4CAF50" : "#2B4C9B"} 
                            />
                            <Text style={[
                              styles.statusBadgeText, 
                              { color: item.feita ? "#4CAF50" : "#2B4C9B" }
                            ]}>
                              {item.feita ? "Concluído" : "Marcar como feito"}
                            </Text>
                          </TouchableOpacity>

                          {/* Texto da Atividade */}
                          <Text style={[
                            styles.listItemTextAtividade,
                            item.feita && { textDecorationLine: 'line-through', color: '#777', opacity: 0.7 }
                          ]}>
                            {item.nome} . Entregar {item.data} - {item.disciplina}
                          </Text>
                          
                          {/* Checkbox de Seleção para Deleção Direita */}
                          <TouchableOpacity onPress={() => toggleSelecioneAtividade(item.id)} style={{ paddingLeft: 5 }}>
                            <MaterialCommunityIcons 
                              name={isSelecionadoExcluir ? "radiobox-marked" : "radiobox-blank"} 
                              size={20} 
                              color="#1C2E4A" 
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  )}
                </View>
              </>
            )}

            {/* --- Botão Excluir Permanente --- */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.btnExcluir} onPress={handleExcluir}>
                <Text style={styles.btnExcluirText}>Excluir Selecionados</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>

        {/* --- Modal Seletor de Disciplinas Cadastradas --- */}
        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Vincular Disciplina</Text>
              <FlatList
                data={disciplinas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.modalItem} 
                    onPress={() => {
                      setDisciplinaVinculada(item.nome);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.codigo} - {item.nome}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.modalEmptyText}>Cadastre disciplinas primeiro!</Text>
                }
              />
              <TouchableOpacity style={styles.btnFecharModal} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnFecharModalText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 35, paddingBottom: 25 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C2E4A', textAlign: 'center', flex: 1, paddingHorizontal: 10 },
  iconButton: { padding: 5 },
  whiteContainer: {
    flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40,
    paddingTop: 30, paddingHorizontal: 20, elevation: 8, shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: -3 },
  },
  scrollContent: { flexGrow: 1, paddingBottom: 40, alignItems: 'center' },
  toggleContainer: {
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 30, 
    padding: 4, 
    width: '90%', 
    height: 54, 
    marginBottom: 30, 
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3, 
  },
  toggleBtn: { flex: 1, height: '100%', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#8BAEE0' },
  toggleBtnInactive: { backgroundColor: 'transparent' },
  toggleText: { fontSize: 15, fontWeight: 'bold' },
  toggleTextActive: { color: '#000000' },
  toggleTextInactive: { color: '#000000', opacity: 0.7 },
  formCard: { backgroundColor: '#A5C0DF', width: '100%', borderRadius: 20, padding: 25, marginBottom: 15, elevation: 3 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#1C2E4A', marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderRadius: 15, height: 45, paddingHorizontal: 15, marginBottom: 20, fontSize: 15, color: '#333', elevation: 2 },
  dropdownInput: { backgroundColor: '#FFF', borderRadius: 15, height: 45, paddingHorizontal: 15, marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  actionRow: { width: '100%', alignItems: 'center', marginBottom: 20 },
  btnSalvar: { backgroundColor: '#1B3668', paddingVertical: 12, paddingHorizontal: 50, borderRadius: 20, elevation: 4 },
  btnSalvarText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  btnExcluir: { backgroundColor: '#5AD6B6', paddingVertical: 12, paddingHorizontal: 50, borderRadius: 20, elevation: 4 },
  btnExcluirText: { color: '#1C2E4A', fontWeight: 'bold', fontSize: 14 },
  listCardDisciplinas: { backgroundColor: '#B7CFF0', width: '100%', borderRadius: 15, padding: 20, marginBottom: 15, elevation: 3 },
  listTitle: { fontSize: 14, fontWeight: 'bold', color: '#2B4C9B', textAlign: 'center', marginBottom: 8 },
  separator: { height: 1, backgroundColor: '#2B4C9B', marginBottom: 15, opacity: 0.3 },
  listGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '48%', marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.4)', padding: 8, borderRadius: 10 },
  listItemText: { fontSize: 11, color: '#1C2E4A', fontWeight: 'bold', flex: 1, marginRight: 4 },
  listCardAtividades: { backgroundColor: '#B7CFF0', width: '100%', borderRadius: 15, padding: 12, marginBottom: 15, elevation: 3 },
  listItemAtividade: { flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.5)', padding: 12, borderRadius: 15, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#2B4C9B' },
  btnCheckboxConcluir: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold', marginLeft: 6, textTransform: 'uppercase' },
  listItemTextAtividade: { fontSize: 13, color: '#1C2E4A', fontWeight: 'bold', width: '100%', marginVertical: 4 },
  emptyText: { color: '#1C2E4A', opacity: 0.6, fontSize: 13, textAlign: 'center', padding: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', width: '85%', borderRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C2E4A', marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalItemText: { fontSize: 15, color: '#333' },
  modalEmptyText: { textAlign: 'center', color: '#999', marginVertical: 20 },
  btnFecharModal: { backgroundColor: '#1B3668', marginTop: 15, padding: 12, borderRadius: 15, alignItems: 'center' },
  btnFecharModalText: { color: '#FFF', fontWeight: 'bold' }
});
