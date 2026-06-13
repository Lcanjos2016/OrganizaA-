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
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { disciplineApi, scheduleApi, getApiErrorMessage } from '../services/api';

export default function MontarCronogramaScreen({ navigation }) {
  
  const initialRows = [
     { time: '08h - 10h', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '10h - 12h', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '14h - 16h', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '16h - 18h', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '18h - 20h', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '20h - 22h', seg: '', ter: '', qua: '', qui: '', sex: '' },
  ];

  const [tableRows, setTableRows] = useState(initialRows);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carrega e sincroniza os dados do servidor ao focar na tela
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const carregarDados = async () => {
        setLoading(true);
        try {
          // 1. Busca lista de disciplinas cadastradas
          const listaDisciplinas = await disciplineApi.list();
          if (isMounted) setDisciplinas(listaDisciplinas);

          // 2. Busca último cronograma salvo
          const listaCronogramas = await scheduleApi.list(); 
          
          if (listaCronogramas && listaCronogramas.length > 0) {
            const ultimoCronograma = listaCronogramas[listaCronogramas.length - 1];
            
            if (ultimoCronograma.dicasDoMentor) {
              const dadosSalvos = JSON.parse(ultimoCronograma.dicasDoMentor);
              if (Array.isArray(dadosSalvos) && dadosSalvos.length > 0) {
                if (isMounted) setTableRows(dadosSalvos);
                return;
              }
            }
          }
          if (isMounted) setTableRows(initialRows);
        } catch (error) {
          console.log("Erro ao buscar dados remotos:", error);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      carregarDados();

      return () => {
        isMounted = false;
      };
    }, [])
  );
  
  // Atualiza o estado em tempo real enquanto digita os códigos das disciplinas
  const handleInputChange = (text, rowIndex, field) => {
    const updatedRows = tableRows.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [field]: text };
      }
      return row;
    });
    setTableRows(updatedRows);
  };
  
  // Envia a requisição de persistência para a API
  const salvarNoBanco = async (dados) => {
    try {
      setLoading(true);
      const hoje = new Date();
      const dataInicio = hoje.toISOString().slice(0, 10);
      const fim = new Date(hoje);
      fim.setMonth(fim.getMonth() + 6);

      await scheduleApi.create({
        titulo: 'Cronograma de aulas',
        dataInicio,
        dataFim: fim.toISOString().slice(0, 10),
        dicasDoMentor: JSON.stringify(dados),
      });

      // Notificação nativa informando o sucesso
      Alert.alert("Sucesso 🎉", "Seu cronograma de aulas foi salvo com sucesso e mantido!");
    } catch (error) {
      Alert.alert("Erro ao salvar", getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Caixa de confirmação para salvar
  const handleSalvar = () => {
    Alert.alert(
      "Confirmar",
      "Deseja salvar as alterações e códigos digitados na tabela?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, Salvar", onPress: () => salvarNoBanco(tableRows) }
      ]
    );
  };

  // Caixa de confirmação para esvaziar/limpar
  const handleEsvaziar = () => {
    Alert.alert(
      "Limpar Tudo",
      "Tem certeza que deseja apagar os códigos dos dias da semana?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, Limpar", 
          onPress: () => {
            const linhasLimpas = tableRows.map(row => ({
              ...row, seg: '', ter: '', qua: '', qui: '', sex: ''
            }));
            setTableRows(linhasLimpas);
            salvarNoBanco(linhasLimpas);
          } 
        }
      ]
    );
  };

  const metade = Math.ceil(disciplinas.length / 2);
  const colunaEsquerda = disciplinas.slice(0, metade);
  const colunaDireita = disciplinas.slice(metade);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back-circle-outline" size={32} color="#2B4C9B" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Montar Cronograma</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* --- Conteúdo Principal com Gradiente --- */}
      <LinearGradient colors={['#7895E8', '#A9C4F0', '#DCE8F5']} style={styles.mainGradient}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2B4C9B" />
            <Text style={styles.loadingText}>Atualizando dados...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* --- Tabela do Cronograma --- */}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Horário</Text>
                <Text style={styles.tableHeaderText}>Seg.</Text>
                <Text style={styles.tableHeaderText}>Ter.</Text>
                <Text style={styles.tableHeaderText}>Quar.</Text>
                <Text style={styles.tableHeaderText}>Quin.</Text>
                <Text style={styles.tableHeaderText}>Sex.</Text>
              </View>

              {tableRows.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={[styles.tableCell, { flex: 1.5 }]}>
                    <TextInput 
                      style={styles.cellInput} 
                      value={row.time}
                      onChangeText={(text) => handleInputChange(text, index, 'time')}
                      placeholder="---"
                      placeholderTextColor="#A5C0DF"
                    />
                  </View>
                  <View style={styles.tableCell}>
                    <TextInput style={styles.cellInput} value={row.seg} onChangeText={(text) => handleInputChange(text, index, 'seg')} maxLength={6} placeholder="Cód" placeholderTextColor="#C0D3EB" />
                  </View>
                  <View style={styles.tableCell}>
                    <TextInput style={styles.cellInput} value={row.ter} onChangeText={(text) => handleInputChange(text, index, 'ter')} maxLength={6} placeholder="Cód" placeholderTextColor="#C0D3EB" />
                  </View>
                  <View style={styles.tableCell}>
                    <TextInput style={styles.cellInput} value={row.qua} onChangeText={(text) => handleInputChange(text, index, 'qua')} maxLength={6} placeholder="Cód" placeholderTextColor="#C0D3EB" />
                  </View>
                  <View style={styles.tableCell}>
                    <TextInput style={styles.cellInput} value={row.qui} onChangeText={(text) => handleInputChange(text, index, 'qui')} maxLength={6} placeholder="Cód" placeholderTextColor="#C0D3EB" />
                  </View>
                  <View style={[styles.tableCell, { borderRightWidth: 0 }]}>
                    <TextInput style={styles.cellInput} value={row.sex} onChangeText={(text) => handleInputChange(text, index, 'sex')} maxLength={6} placeholder="Cód" placeholderTextColor="#C0D3EB" />
                  </View>
                </View>
              ))}
            </View>

            {/* --- Botões de Ação --- */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnSalvar]} onPress={handleSalvar}>
                <Text style={[styles.actionBtnText, { color: '#FFF' }]}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnEsvaziar]} onPress={handleEsvaziar}>
                <Text style={[styles.actionBtnText, { color: '#1B3668' }]}>Esvaziar</Text>
              </TouchableOpacity>
            </View>

            {/* --- Legenda Dinâmica / Códigos e Disciplinas --- */}
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Códigos e disciplinas</Text>
              <View style={styles.separator} />
              
              {disciplinas.length === 0 ? (
                <Text style={styles.emptyLegendText}>Nenhuma disciplina cadastrada na outra tela.</Text>
              ) : (
                <View style={styles.legendColumns}>
                  <View style={styles.column}>
                    {colunaEsquerda.map((item) => (
                      <Text key={item.id} style={styles.legendText} numberOfLines={1}>
                        {item.codigo} - {item.nome}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.column}>
                    {colunaDireita.map((item) => (
                      <Text key={item.id} style={styles.legendText} numberOfLines={1}>
                        {item.codigo} - {item.nome}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
            
            <Text style={styles.helperText}>Utilize os códigos para preencher o cronograma</Text>
            
          </ScrollView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 35, paddingBottom: 10, backgroundColor: '#FFF' },
  iconButton: { padding: 5, width: 42, alignItems: 'flex-start' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2B4C9B', textAlign: 'center', flex: 1 },
  headerSpacer: { width: 42 }, 
  mainGradient: { flex: 1, borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingTop: 15, paddingHorizontal: 20 },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#2B4C9B', fontWeight: '500' },
  tableContainer: { backgroundColor: '#FFF', borderRadius: 15, overflow: 'hidden', marginBottom: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1C2E4A', paddingVertical: 12 },
  tableHeaderText: { flex: 1, color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#A5C0DF' },
  tableCell: { flex: 1, borderRightWidth: 1, borderRightColor: '#A5C0DF', justifyContent: 'center', alignItems: 'center' },
  cellInput: { fontWeight: 'bold', fontSize: 11, color: '#1C2E4A', textAlign: 'center', width: '100%', paddingVertical: 12 },
  actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center', marginHorizontal: 5, elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } },
  btnSalvar: { backgroundColor: '#1B3668' },
  btnEsvaziar: { backgroundColor: '#5AD6B6' },
  actionBtnText: { fontWeight: 'bold', fontSize: 14 },
  legendContainer: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 10, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  legendTitle: { color: '#2B4C9B', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 5 },
  separator: { height: 1, backgroundColor: '#2B4C9B', marginBottom: 10, opacity: 0.5 },
  legendColumns: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, paddingHorizontal: 5 },
  legendText: { fontSize: 11, color: '#333', fontWeight: '500', marginBottom: 4 },
  emptyLegendText: { fontSize: 12, color: '#999', textAlign: 'center', marginVertical: 10, fontStyle: 'italic' },
  helperText: { textAlign: 'center', color: '#2B4C9B', fontSize: 12, fontWeight: '500', marginBottom: 10 }
});