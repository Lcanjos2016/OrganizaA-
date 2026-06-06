import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native'; // Atualizado para o padrão useFocusEffect
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { disciplineApi, getApiErrorMessage } from '../services/api';

export default function SituacaoNotasScreen({ navigation }) {
  
  // --- Estados Principais ---
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notas, setNotas] = useState([]);

  // --- Carregar dados automaticamente quando a tela ganha foco ---
  useFocusEffect(
    useCallback(() => {
      carregarDisciplinas();
    }, [disciplinaSelecionada?.id])
  );

  const carregarDisciplinas = async () => {
    try {
      const listaDisciplinas = await disciplineApi.list();
      setDisciplinas(listaDisciplinas);
      await AsyncStorage.setItem('@storage_disciplinas', JSON.stringify(listaDisciplinas));
        
        // Se já houver uma disciplina previamente selecionada, atualiza as notas dela
        if (disciplinaSelecionada) {
          const atualizada = listaDisciplinas.find(d => d.id === disciplinaSelecionada.id);
          if (atualizada) {
            setDisciplinaSelecionada(atualizada);
            setNotas(atualizada.listaNotas || []);
            return;
          }
        }
        setDisciplinaSelecionada(null);
        setNotas([]);
    } catch (error) {
      console.log("Erro ao carregar dados:", error);
    }
  };

  // --- Ações do Bloco de Notas por Disciplina ---
  const handleSelecionarDisciplina = (disciplina) => {
    setDisciplinaSelecionada(disciplina);
    setNotas(disciplina.listaNotas || [
      { id: '1', label: 'Nota1', valor: '' },
      { id: '2', label: 'Nota2', valor: '' }
    ]);
    setModalVisible(false);
  };

  const adicionarNota = () => {
    if (!disciplinaSelecionada) {
      Alert.alert("Aviso", "Selecione uma disciplina primeiro!");
      return;
    }
    const novaId = (notas.length + 1).toString();
    setNotas([...notas, { id: novaId, label: `Nota${novaId}`, valor: '' }]);
  };

  const removerNota = (id) => {
    const filtradas = notas.filter(n => n.id !== id)
      .map((n, index) => ({ ...n, id: (index + 1).toString(), label: `Nota${index + 1}` }));
    setNotas(filtradas);
  };

  const alterarValorNota = (id, texto) => {
    const valorLimpo = texto.replace(/[^0-9.]/g, '');
    const listaAtualizada = notas.map(n => n.id === id ? { ...n, valor: valorLimpo } : n);
    setNotas(listaAtualizada);
  };

  // --- Sincronizador Central para o Gráfico de Progresso ---
  const sincronizarComProgresso = async (listaDisciplinas) => {
    try {
      // Filtra apenas as disciplinas que já possuem notas calculadas
      const dadosProgresso = listaDisciplinas
        .filter(d => d.notaFinal && d.situacao)
        .map(d => ({
          id: d.id,
          disciplina: d.nome,
          media: parseFloat(d.notaFinal) || 0,
          situacao: d.situacao
        }));
      
      await AsyncStorage.setItem('@storage_notas_progresso', JSON.stringify(dadosProgresso));
    } catch (e) {
      console.log("Erro ao sincronizar dados de progresso:", e);
    }
  };

  // --- Função de Cálculo e Persistência ---
  const calcularESalvar = async () => {
    if (!disciplinaSelecionada) {
      Alert.alert("Aviso", "Por favor, selecione uma disciplina.");
      return;
    }

    const notasValidas = notas.map(n => parseFloat(n.valor) || 0);
    
    if (notasValidas.length === 0) {
      Alert.alert("Aviso", "Insira ao menos uma nota para calcular.");
      return;
    }

    const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
    const media = soma / notasValidas.length;
    const notaFinalFormatada = media.toFixed(2);

    // Critério de aprovação conforme a regra do seu layout (Média 8.0)
    const situacao = media >= 8.0 ? 'Aprovado' : 'Prova Final';

    const listaDisciplinasAtualizada = disciplinas.map(d => {
      if (d.id === disciplinaSelecionada.id) {
        return {
          ...d,
          listaNotas: notas,
          notaFinal: notaFinalFormatada,
          situacao: situacao
        };
      }
      return d;
    });

    try {
      const [nota1, nota2, nota3] = notasValidas;
      const retorno = await disciplineApi.saveGrades(disciplinaSelecionada.id, {
        nota1: nota1 || 0,
        nota2: nota2 || 0,
        nota3: nota3 || 0,
      });

      await AsyncStorage.setItem('@storage_disciplinas', JSON.stringify(listaDisciplinasAtualizada));
      
      // Sincroniza o snapshot plano de notas para o gráfico da tela de Progresso
      await sincronizarComProgresso(listaDisciplinasAtualizada);

      setDisciplinas(listaDisciplinasAtualizada);
      const selecionadaAtualizada = listaDisciplinasAtualizada.find(d => d.id === disciplinaSelecionada.id);
      setDisciplinaSelecionada(selecionadaAtualizada);
      Alert.alert("Sucesso", `Média calculada: ${retorno.nota_final || notaFinalFormatada} (${retorno.situacao || situacao})`);
    } catch (error) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
  };

  // --- LIMPAR LINHA ESPECÍFICA NA TABELA DE SITUAÇÃO ---
  const limparLinhaTabela = (idDisciplina, nomeDisciplina) => {
    Alert.alert(
      "Limpar Situação",
      `Deseja zerar a média e as notas salvos em: ${nomeDisciplina}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpar", 
          style: "destructive",
          onPress: async () => {
            const estruturaNotasPadrao = [
              { id: '1', label: 'Nota1', valor: '' },
              { id: '2', label: 'Nota2', valor: '' }
            ];

            const listaDisciplinasAtualizada = disciplinas.map(d => {
              if (d.id === idDisciplina) {
                return {
                  ...d,
                  listaNotas: estruturaNotasPadrao,
                  notaFinal: '',
                  situacao: ''
                };
              }
              return d;
            });

            try {
              await disciplineApi.saveGrades(idDisciplina, {
                nota1: 0,
                nota2: 0,
                nota3: 0,
              });
              await AsyncStorage.setItem('@storage_disciplinas', JSON.stringify(listaDisciplinasAtualizada));
              
              // Atualiza também o histórico do progresso removendo esta disciplina limpa
              await sincronizarComProgresso(listaDisciplinasAtualizada);

              setDisciplinas(listaDisciplinasAtualizada);
              
              if (disciplinaSelecionada && disciplinaSelecionada.id === idDisciplina) {
                setNotas(estruturaNotasPadrao);
                setDisciplinaSelecionada({
                  ...disciplinaSelecionada,
                  listaNotas: estruturaNotasPadrao,
                  notaFinal: '',
                  situacao: ''
                });
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível atualizar os dados.");
            }
          }
        }
      ]
    );
  };

  // --- Motor de Relatório PDF ---
  const gerarRelatorioPDF = async () => {
    if (disciplinas.length === 0) {
      Alert.alert("Aviso", "Não existem dados para gerar o relatório.");
      return;
    }

    const linhasTabela = disciplinas.map(d => `
      <tr>
        <td>${d.codigo || 'S/C'} - ${d.nome}</td>
        <td style="text-align: center;">${d.notaFinal || 'N/A'}</td>
        <td style="text-align: center; font-weight: bold; color: ${d.situacao === 'Aprovado' ? '#27AE60' : d.situacao ? '#F1C40F' : '#333'};">
          ${d.situacao || 'Pendente'}
        </td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #1C2E4A; }
            h1 { text-align: center; color: #1B3668; margin-bottom: 5px; }
            p.sub { text-align: center; font-size: 14px; color: #666; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #CBDFFF; padding: 12px; text-align: left; }
            th { background-color: #1C2E4A; color: white; font-size: 14px; }
            tr:nth-child(even) { background-color: #F4F8FF; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #EEE; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>OrganizaAE - Relatório de Desempenho</h1>
          <p class="sub">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
          <table>
            <thead>
              <tr>
                <th>Disciplina</th>
                <th style="width: 20%; text-align: center;">Nota Final</th>
                <th style="width: 25%; text-align: center;">Situação</th>
              </tr>
            </thead>
            <tbody>
              ${linhasTabela}
            </tbody>
          </table>
          <div class="footer">OrganizaAE - Sistema de Gestão Acadêmica Pessoal</div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao exportar o PDF.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back-circle-outline" size={32} color="#1C2E4A" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Situação de Notas</Text>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.iconButton}>
          <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
        </TouchableOpacity>
      </View>

      {/* --- Conteúdo Principal com Gradiente --- */}
      <LinearGradient colors={['#7895E8', '#A9C4F0', '#DCE8F5']} style={styles.mainGradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- Card de Entrada de Notas --- */}
          <View style={styles.inputCard}>
            <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
              <Text style={styles.dropdownText} numberOfLines={1}>
                {disciplinaSelecionada ? `${disciplinaSelecionada.codigo || 'S/C'} - ${disciplinaSelecionada.nome}` : 'Selecione uma Disciplina'}
              </Text>
              <Feather name="chevron-down" size={24} color="#1C2E4A" />
            </TouchableOpacity>

            {/* Lista de Notas Dinâmicas */}
            {disciplinaSelecionada ? (
              notas.map((item) => (
                <View key={item.id} style={styles.notaRow}>
                  <Text style={styles.notaLabel}>{item.label}</Text>
                  <View style={styles.notaInputContainer}>
                    <TextInput
                      style={styles.inputNotaReal}
                      value={item.valor}
                      onChangeText={(texto) => alterarValorNota(item.id, texto)}
                      placeholder="0.00"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  <TouchableOpacity style={styles.iconAction} onPress={() => removerNota(item.id)}>
                    <MaterialCommunityIcons name="minus-circle" size={22} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyStateText}>Escolha uma disciplina para gerenciar as notas.</Text>
            )}

            {disciplinaSelecionada && (
              <TouchableOpacity style={styles.btnAdicionar} onPress={adicionarNota}>
                <Text style={styles.btnAdicionarText}>Adicionar +</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Botão Calcular e Salvar */}
          <TouchableOpacity style={styles.btnCalcular} onPress={calcularESalvar}>
            <Text style={styles.btnCalcularText}>Calcular e Salvar</Text>
          </TouchableOpacity>

          {/* --- Tabela de Situação --- */}
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Disciplina</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Nota Final</Text>
              <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Situação</Text>
            </View>

            {disciplinas.length === 0 ? (
              <Text style={[styles.emptyStateText, { marginVertical: 15, color: '#333' }]}>Nenhuma disciplina cadastrada na outra tela.</Text>
            ) : (
              disciplinas.map((row) => (
                <View key={row.id} style={styles.tableRow}>
                  <Text style={[styles.cellText, { flex: 2, textTransform: 'capitalize' }]} numberOfLines={1}>
                    {row.nome}
                  </Text>
                  <Text style={[styles.cellText, { flex: 1 }]}>
                    {row.notaFinal || '--'}
                  </Text>
                  
                  {/* Container da Situação com Botão de Limpeza */}
                  <View style={[styles.cellSituacaoContainer, { flex: 1.5 }]}>
                    <View style={styles.wrapperBadge}>
                      {row.situacao ? (
                        <View style={[
                          styles.badge, 
                          row.situacao === 'Aprovado' ? styles.badgeAprovado : styles.badgeProvaFinal
                        ]}>
                          <Text style={styles.badgeText}>{row.situacao}</Text>
                        </View>
                      ) : (
                        <Text style={[styles.cellText, { opacity: 0.4, fontStyle: 'italic' }]}>Pendente</Text>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.btnDeleteRow} 
                      onPress={() => limparLinhaTabela(row.id, row.nome)}
                    >
                      <MaterialCommunityIcons name="trash-can-outline" size={18} color="#D9534F" />
                    </TouchableOpacity>
                  </View>

                </View>
              ))
            )}
          </View>

          {/* Botão Gerar Relatório PDF */}
          <TouchableOpacity style={styles.btnPdf} onPress={gerarRelatorioPDF}>
            <Text style={styles.btnPdfText}>Gerar Relatório PDF</Text>
          </TouchableOpacity>

        </ScrollView>
      </LinearGradient>

      {/* --- Modal Seletor de Disciplina --- */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha a Disciplina</Text>
            <FlatList
              data={disciplinas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleSelecionarDisciplina(item)}>
                  <Text style={styles.modalItemText}>{item.codigo || 'S/C'} - {item.nome}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.modalEmptyText}>Nenhuma disciplina encontrada. Crie-as na tela anterior.</Text>
              }
            />
            <TouchableOpacity style={styles.btnFecharModal} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnFecharModalText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: 35, paddingBottom: 15, backgroundColor: '#FFF' 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2B4C9B' },
  iconButton: { padding: 5 },
  mainGradient: { 
    flex: 1, borderTopLeftRadius: 35, borderTopRightRadius: 35, 
    paddingTop: 20, paddingHorizontal: 20 
  },
  scrollContent: { flexGrow: 1, paddingBottom: 30, alignItems: 'center' },
  inputCard: {
    backgroundColor: '#A5C0DF', width: '100%', borderRadius: 20, padding: 20, marginBottom: 20,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
  },
  dropdown: {
    backgroundColor: '#EBF3FA', borderRadius: 25, height: 45, flexDirection: 'row', 
    justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, 
    marginBottom: 20, borderWidth: 1, borderColor: '#8DA4C4'
  },
  dropdownText: { fontSize: 15, fontWeight: 'bold', color: '#1C2E4A', flex: 1 },
  notaRow: { 
    flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' 
  },
  notaLabel: { fontSize: 14, fontWeight: 'bold', color: '#1C2E4A', width: 50 },
  notaInputContainer: {
    backgroundColor: '#FFF', borderRadius: 15, height: 35, flex: 1, marginHorizontal: 10,
    elevation: 2, borderWidth: 1, borderColor: '#8DA4C4'
  },
  inputNotaReal: { flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#1C2E4A', fontSize: 14, padding: 0 },
  iconAction: { paddingHorizontal: 5 },
  btnAdicionar: {
    backgroundColor: '#1B3668', borderRadius: 15, paddingVertical: 6, paddingHorizontal: 20,
    alignSelf: 'center', marginTop: 10
  },
  btnAdicionarText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  btnCalcular: {
    backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20,
    marginBottom: 25, elevation: 4, shadowColor: '#000', shadowOpacity: 0.15
  },
  btnCalcularText: { color: '#1B3668', fontWeight: 'bold', fontSize: 14 },
  btnPdf: {
    backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20,
    marginTop: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.15
  },
  btnPdfText: { color: '#1B3668', fontWeight: 'bold', fontSize: 14 },
  tableCard: {
    backgroundColor: '#FFF', width: '100%', borderRadius: 15, overflow: 'hidden', marginBottom: 10,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
  },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1C2E4A', paddingVertical: 10 },
  tableHeaderText: { color: '#FFF', fontWeight: 'bold', fontSize: 11, textAlign: 'center' },
  tableRow: { 
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EBF3FA', height: 45, alignItems: 'center' 
  },
  cellText: { fontSize: 11, color: '#333', textAlign: 'center', fontWeight: 'bold', paddingHorizontal: 4 },
  cellSituacaoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingRight: 10 
  },
  wrapperBadge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnDeleteRow: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge: { paddingVertical: 3, paddingHorizontal: 6, borderRadius: 10, minWidth: 68, alignItems: 'center' },
  badgeAprovado: { backgroundColor: '#BDECB6' }, 
  badgeProvaFinal: { backgroundColor: '#F9E79F' },
  badgeText: { fontSize: 9, fontWeight: 'bold', color: '#1C2E4A' },
  emptyStateText: { textAlign: 'center', color: '#1C2E4A', opacity: 0.6, fontSize: 13, marginVertical: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', width: '85%', borderRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C2E4A', marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalItemText: { fontSize: 15, color: '#333', fontWeight: '500' },
  modalEmptyText: { textAlign: 'center', color: '#999', marginVertical: 20, paddingHorizontal: 10 },
  btnFecharModal: { backgroundColor: '#1B3668', marginTop: 15, padding: 12, borderRadius: 15, alignItems: 'center' },
  btnFecharModalText: { color: '#FFF', fontWeight: 'bold' }
});
