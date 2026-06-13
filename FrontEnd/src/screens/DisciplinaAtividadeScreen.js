import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, ScrollView, Alert, Modal, FlatList, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { activityApi, disciplineApi, getApiErrorMessage } from '../services/api';

export default function DisciplinaAtividadeScreen({ navigation }) {
  const [abaAtiva, setAbaAtiva] = useState('Disciplinas');
  
  // Estados
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [nomeAtividade, setNomeAtividade] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [disciplinaVinculada, setDisciplinaVinculada] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados do Calendário
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [disciplinas, setDisciplinas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState([]);
  const [atividadesSelecionadas, setAtividadesSelecionadas] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [disciplinasApi, atividadesApi] = await Promise.all([
          disciplineApi.list(),
          activityApi.list(),
        ]);
        setDisciplinas(disciplinasApi);
        setAtividades(atividadesApi);
      } catch (error) {
        Alert.alert('Erro', getApiErrorMessage(error));
      }
    };
    carregarDados();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const dia = String(selectedDate.getDate()).padStart(2, '0');
      const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const ano = selectedDate.getFullYear();
      setDataEntrega(`${dia}/${mes}/${ano}`);
    }
  };

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

  const toggleConcluirAtividade = async (id) => {
    try {
      const atual = atividades.find((item) => item.id === id);
      const atualizada = await activityApi.update(id, { concluida: !atual?.feita });
      setAtividades((lista) => lista.map((item) => item.id === id ? atualizada : item));
    } catch (error) {
      Alert.alert('Erro', getApiErrorMessage(error));
    }
  };

  const handleExcluir = async () => {
    try {
      if (abaAtiva === 'Disciplinas') {
        await Promise.all(disciplinasSelecionadas.map((id) => disciplineApi.remove(id)));
        setDisciplinas((lista) => lista.filter(item => !disciplinasSelecionadas.includes(item.id)));
        setDisciplinasSelecionadas([]);
      } else {
        await Promise.all(atividadesSelecionadas.map((id) => activityApi.remove(id)));
        setAtividades((lista) => lista.filter(item => !atividadesSelecionadas.includes(item.id)));
        setAtividadesSelecionadas([]);
      }
    } catch (error) {
      Alert.alert('Erro', getApiErrorMessage(error));
    }
  };

  const handleSalvar = async () => {
    if (abaAtiva === 'Disciplinas') {
      if (!codigo.trim() || !nome.trim()) return Alert.alert("Aviso", "Preencha os campos.");
      try {
        const nova = await disciplineApi.create({
          codigoDisciplina: codigo.trim().toUpperCase(),
          nomeDisciplina: nome.trim(),
        });
        setDisciplinas((lista) => [...lista, nova]);
        setCodigo('');
        setNome('');
      } catch (error) {
        return Alert.alert('Erro', getApiErrorMessage(error));
      }
    } else {
      if (!nomeAtividade.trim() || !dataEntrega.trim() || !disciplinaVinculada) return Alert.alert("Aviso", "Preencha todos os campos.");
      try {
        const disciplina = disciplinas.find((item) => item.nome === disciplinaVinculada);
        const [dia, mes, ano] = dataEntrega.split('/');
        const nova = await activityApi.create({
          idDisciplina: disciplina?.idDisciplina,
          dataAtividade: `${ano}-${mes}-${dia}`,
          topicoEstudo: nomeAtividade.trim(),
          tipoAtividade: 'Atividade',
          duracaoMinutos: 60,
        });
        setAtividades((lista) => [...lista, nova]);
        setNomeAtividade('');
        setDataEntrega('');
        setDisciplinaVinculada('');
      } catch (error) {
        return Alert.alert('Erro', getApiErrorMessage(error));
      }
    }
    Alert.alert("Sucesso", "Salvo com sucesso!");
  };

  return (
    <LinearGradient colors={['#B3C9EC', '#CBDFFF', '#EBF3FA']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="arrow-back-circle-outline" size={32} color="#1C2E4A" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Adicionar Disciplinas e Atividades</Text>
          
          {/* View vazia para manter o alinhamento centralizado do título */}
          <View style={styles.iconButton} />
        </View>

        <View style={styles.whiteContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleBtn, abaAtiva === 'Disciplinas' ? styles.toggleBtnActive : styles.toggleBtnInactive]}
                onPress={() => setAbaAtiva('Disciplinas')}
              >
                <Text style={[styles.toggleText, abaAtiva === 'Disciplinas' ? styles.toggleTextActive : styles.toggleTextInactive]}>Disciplinas</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, abaAtiva === 'Atividades' ? styles.toggleBtnActive : styles.toggleBtnInactive]}
                onPress={() => setAbaAtiva('Atividades')}
              >
                <Text style={[styles.toggleText, abaAtiva === 'Atividades' ? styles.toggleTextActive : styles.toggleTextInactive]}>Atividades</Text>
              </TouchableOpacity>
            </View>

            {abaAtiva === 'Disciplinas' ? (
              <>
                <View style={styles.formCard}>
                  <Text style={styles.label}>Código da disciplina:</Text>
                  <TextInput style={styles.input} value={codigo} onChangeText={setCodigo} placeholder="Ex: GCC123" placeholderTextColor="#A0A0A0" />
                  <Text style={styles.label}>Nome da disciplina:</Text>
                  <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Engenharia de Software" placeholderTextColor="#A0A0A0" />
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                    <Text style={styles.btnSalvarText}>Salvar</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.listCardDisciplinas}>
                  <Text style={styles.listTitle}>Codes e disciplinas adicionados</Text>
                  <View style={styles.separator} />
                  {disciplinas.length === 0 ? <Text style={styles.emptyText}>Nenhuma disciplina cadastrada.</Text> : (
                    <View style={styles.listGrid}>
                      {disciplinas.map((item) => (
                        <View key={item.id} style={styles.listItem}>
                          <Text style={styles.listItemText} numberOfLines={1}>{item.codigo} - {item.nome}</Text>
                          <TouchableOpacity onPress={() => toggleSelecioneDisciplina(item.id)}>
                            <MaterialCommunityIcons name={disciplinasSelecionadas.includes(item.id) ? "checkbox-marked" : "checkbox-blank-outline"} size={18} color="#2B4C9B" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </>
            ) : (
              <>
                <View style={styles.formCard}>
                  <Text style={styles.label}>Atividade:</Text>
                  <TextInput style={styles.input} value={nomeAtividade} onChangeText={setNomeAtividade} placeholder="Ex: Prova 1 ou Checklist" placeholderTextColor="#A0A0A0" />
                  
                  <Text style={styles.label}>Data de entrega:</Text>
                  
                  <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
                     <Text style={{ marginTop: 12, color: dataEntrega ? '#333' : '#A0A0A0' }}>{dataEntrega || 'Selecione a data'}</Text>
                  </TouchableOpacity>
                  {showPicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}

                  <Text style={styles.label}>Vinculado a disciplina:</Text>
                  <TouchableOpacity style={styles.dropdownInput} onPress={() => setModalVisible(true)}>
                    <Text style={{ color: disciplinaVinculada ? '#333' : '#A0A0A0' }}>{disciplinaVinculada || 'Selecione uma disciplina'}</Text>
                    <Feather name="chevron-down" size={20} color="#1C2E4A" />
                  </TouchableOpacity>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                    <Text style={styles.btnSalvarText}>Salvar</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.listCardAtividades}>
                  {atividades.map((item) => (
                    <View key={item.id} style={[styles.listItemAtividade, item.feita && { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                      <TouchableOpacity onPress={() => toggleConcluirAtividade(item.id)} style={styles.btnCheckboxConcluir}>
                        <MaterialCommunityIcons name={item.feita ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} size={24} color={item.feita ? "#4CAF50" : "#2B4C9B"} />
                        <Text style={[styles.statusBadgeText, { color: item.feita ? "#4CAF50" : "#2B4C9B" }]}>{item.feita ? "Concluído" : "Marcar como feito"}</Text>
                      </TouchableOpacity>
                      <Text style={[styles.listItemTextAtividade, item.feita && { textDecorationLine: 'line-through', color: '#777' }]}>
                        {item.nome} . Entregar {item.data} - {item.disciplina}
                      </Text>
                      <TouchableOpacity onPress={() => toggleSelecioneAtividade(item.id)}>
                        <MaterialCommunityIcons name={atividadesSelecionadas.includes(item.id) ? "radiobox-marked" : "radiobox-blank"} size={20} color="#1C2E4A" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.btnExcluir} onPress={handleExcluir}>
                <Text style={styles.btnExcluirText}>Excluir Selecionados</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>

        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Vincular Disciplina</Text>
              <FlatList
                data={disciplinas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => { setDisciplinaVinculada(item.nome); setModalVisible(false); }}>
                    <Text style={styles.modalItemText}>{item.codigo} - {item.nome}</Text>
                  </TouchableOpacity>
                )}
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
  iconButton: { padding: 5, width: 42, height: 42, justifyContent: 'center', alignItems: 'center' }, // Adicionado tamanho fixo para simetria ideal
  whiteContainer: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 30, paddingHorizontal: 20, elevation: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: -3 } },
  scrollContent: { flexGrow: 1, paddingBottom: 40, alignItems: 'center' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 30, padding: 4, width: '90%', height: 54, marginBottom: 30, alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
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
  btnFecharModal: { backgroundColor: '#1B3668', marginTop: 15, padding: 12, borderRadius: 15, alignItems: 'center' },
  btnFecharModalText: { color: '#FFF', fontWeight: 'bold' }
});