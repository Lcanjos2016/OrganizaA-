import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { disciplineApi, getApiErrorMessage } from '../services/api';

export default function FaltasScreen({ navigation, route }) {
  const [abaAtiva, setAbaAtiva] = useState('Adicionar');
  const [disciplinas, setDisciplinas] = useState([]);

  // Se vier um parâmetro pedindo para abrir em uma aba específica
  useFocusEffect(
    useCallback(() => {
      if (route.params?.abaInicial) {
        setAbaAtiva(route.params.abaInicial);
        navigation.setParams({ abaInicial: undefined });
      }
    }, [route.params])
  );

  useFocusEffect(
    useCallback(() => {
      const carregarDisciplinasParaFaltas = async () => {
        try {
          const lista = await disciplineApi.list();
          setDisciplinas(lista);
        } catch (error) {
          console.log("Erro ao carregar disciplinas na tela de faltas:", error);
        }
      };
      carregarDisciplinasParaFaltas();
    }, [])
  );

  const alterarFaltas = (id, valor) => {
    setDisciplinas(disciplinasAtuais => 
      disciplinasAtuais.map(disciplina => {
        if (disciplina.id === id) {
          const novasFaltas = (disciplina.faltas || 0) + valor;
          const totalFaltas = novasFaltas >= 0 ? novasFaltas : 0;

          if (valor > 0) {
            if (totalFaltas === 16) {
              Alert.alert(
                " REPROVADO", 
                `Você atingiu ${totalFaltas} faltas em ${disciplina.nome} e foi reprovado por infrequência!`
              );
            } else if (totalFaltas >= 12 && totalFaltas < 16) {
              Alert.alert(
                " ATENÇÃO", 
                `Você está com ${totalFaltas} faltas em ${disciplina.nome}. O limite máximo é 15. Se chegar a 16, você será reprovado!`
              );
            }
          }

          return { ...disciplina, faltas: totalFaltas };
        }
        return disciplina;
      })
    );
  };

  const handleSalvar = async () => {
    try {
      await Promise.all(
        disciplinas.map((disciplina) =>
          disciplineApi.saveAbsences(disciplina.id, {
            numeroFaltas: disciplina.faltas || 0,
          })
        )
      );
      
      Alert.alert("Sucesso", "Faltas salvas e sincronizadas com o Progresso!");
    } catch (error) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
  };

  const metade = Math.ceil(disciplinas.length / 2);
  const colunaEsquerda = disciplinas.slice(0, metade);
  const colunaDireita = disciplinas.slice(metade);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back-circle-outline" size={32} color="#1C2E4A" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {abaAtiva === 'Adicionar' ? 'Adicionar Faltas' : 'Visualizar Faltas'}
        </Text>
        
        {/* Espaçador lateral para manter o título centralizado perfeitamente */}
        <View style={styles.headerSpacer} />
      </View>

      <LinearGradient 
        colors={abaAtiva === 'Adicionar' ? ['#8BAEE0', '#FFFFFF', '#B7CFF0'] : ['#3A5CA8', '#9DBCE0', '#EBF3FA']} 
        style={styles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleBtn, abaAtiva === 'Adicionar' && styles.toggleBtnActive]}
              onPress={() => setAbaAtiva('Adicionar')}
            >
              <Text style={[styles.toggleText, abaAtiva === 'Adicionar' && styles.toggleTextActive]}>
                Adicionar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleBtn, abaAtiva === 'Visualizar' && styles.toggleBtnActive]}
              onPress={() => setAbaAtiva('Visualizar')}
            >
              <Text style={[styles.toggleText, abaAtiva === 'Visualizar' && styles.toggleTextActive]}>
                Visualizar
              </Text>
            </TouchableOpacity>
          </View>

          {abaAtiva === 'Adicionar' ? (
            <>
              <View style={styles.listContainer}>
                {disciplinas.length === 0 ? (
                  <Text style={styles.emptyText}>Nenhuma disciplina encontrada.</Text>
                ) : (
                  disciplinas.map((item) => {
                    const qtdFaltas = item.faltas || 0;
                    return (
                      <View key={item.id} style={styles.row}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.subjectText}>{item.nome}</Text>
                          {qtdFaltas >= 16 ? (
                            <Text style={styles.statusReprovado}>Status: Reprovado</Text>
                          ) : qtdFaltas >= 12 ? (
                            <Text style={styles.statusAlerta}>Risco de Reprovação</Text>
                          ) : null}
                        </View>
                        
                        {/* Contador com os botões invertidos: [-] Valor [+] */}
                        <View style={styles.counterContainer}>
                          <TouchableOpacity style={styles.counterBtn} onPress={() => alterarFaltas(item.id, -1)}>
                            <Text style={styles.counterSymbol}>-</Text>
                          </TouchableOpacity>
                          
                          <View style={styles.counterValueBox}>
                            <Text style={styles.counterValue}>{qtdFaltas}</Text>
                          </View>
                          
                          <TouchableOpacity style={styles.counterBtn} onPress={() => alterarFaltas(item.id, 1)}>
                            <Text style={styles.counterSymbol}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>

              {disciplinas.length > 0 && (
                <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                  <Text style={styles.btnSalvarText}>Salvar</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { flex: 0.6 }]}>Código</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1.8 }]}>Disciplina</Text>
                  <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Faltas</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1 }]}>Situação</Text>
                </View>

                {disciplinas.length === 0 ? (
                  <Text style={[styles.emptyText, { marginVertical: 20 }]}>Nenhum registro para exibir.</Text>
                ) : (
                  disciplinas.map((row) => {
                    const totalFaltas = row.faltas || 0;
                    let situacaoTexto = "Regular";
                    let corSituacao = "#4CAF50";

                    if (totalFaltas >= 16) {
                      situacaoTexto = "Reprovado";
                      corSituacao = "#D32F2F";
                    } else if (totalFaltas >= 12) {
                      situacaoTexto = "Alerta";
                      corSituacao = "#F57C00";
                    }

                    return (
                      <View key={row.id} style={styles.tableRow}>
                        <View style={[styles.tableCell, { flex: 0.6 }]}>
                          <Text style={styles.cellText}>{row.codigo || '-'}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 1.8 }]}>
                          <Text style={styles.cellText}>{row.nome}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 0.8 }]}>
                          <Text style={styles.cellText}>{totalFaltas}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 1, borderRightWidth: 0 }]}>
                          <Text style={[styles.cellText, { color: corSituacao, fontWeight: 'bold' }]}>
                            {situacaoTexto}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>

              {disciplinas.length > 0 && (
                <View style={styles.legendContainer}>
                  <Text style={styles.legendTitle}>Códigos e disciplinas</Text>
                  <View style={styles.separator} />
                  <View style={styles.legendColumns}>
                    <View style={styles.column}>
                      {colunaEsquerda.map((item, index) => (
                        <Text key={item.id} style={styles.legendText}>
                          {index + 1} - {item.nome}
                        </Text>
                      ))}
                    </View>
                    <View style={styles.column}>
                      {colunaDireita.map((item, index) => (
                        <Text key={item.id} style={styles.legendText}>
                          {colunaEsquerda.length + index + 1} - {item.nome}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </>
          )}

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 35, paddingBottom: 25, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C2E4A', textAlign: 'center', flex: 1 },
  iconButton: { padding: 5, width: 42, alignItems: 'flex-start' },
  headerSpacer: { width: 42 },
  gradientContainer: { flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 30, paddingHorizontal: 20, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: -3 } },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingBottom: 40 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 30, borderWidth: 1, borderColor: '#A5C0DF', width: '90%', height: 50, marginBottom: 40, elevation: 5, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, overflow: 'hidden' },
  toggleBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 30 },
  toggleBtnActive: { backgroundColor: '#8BAEE0' },
  toggleText: { fontSize: 15, fontWeight: 'bold', color: '#1C2E4A' },
  toggleTextActive: { color: '#1C2E4A' },
  listContainer: { width: '100%', paddingHorizontal: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1.5, borderBottomColor: '#2B4C9B', marginBottom: 10 },
  subjectText: { fontSize: 14, fontWeight: 'bold', color: '#1C2E4A' },
  statusAlerta: { fontSize: 11, color: '#D35400', fontWeight: 'bold', marginTop: 2 },
  statusReprovado: { fontSize: 11, color: '#C0392B', fontWeight: 'bold', marginTop: 2 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EBF3FA', borderRadius: 20, paddingHorizontal: 5, paddingVertical: 4, borderWidth: 1, borderColor: '#A5C0DF', elevation: 2 },
  counterBtn: { paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' },
  counterSymbol: { fontSize: 16, fontWeight: 'bold', color: '#1C2E4A' },
  counterValueBox: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 2, borderRadius: 10, borderWidth: 0.5, borderColor: '#A5C0DF' },
  counterValue: { fontSize: 14, fontWeight: 'bold', color: '#1C2E4A' },
  btnSalvar: { backgroundColor: '#1B3668', paddingVertical: 12, paddingHorizontal: 50, borderRadius: 15, marginTop: 60, elevation: 5 },
  btnSalvarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  tableContainer: { backgroundColor: '#FFF', width: '100%', borderRadius: 15, overflow: 'hidden', marginBottom: 25, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1C2E4A', paddingVertical: 12 },
  tableHeaderText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#A5C0DF' },
  tableCell: { borderRightWidth: 1, borderRightColor: '#A5C0DF', justifyContent: 'center', alignItems: 'center', paddingVertical: 12 },
  cellText: { fontWeight: 'bold', fontSize: 11, color: '#1C2E4A', textAlign: 'center' },
  legendContainer: { backgroundColor: '#FFF', width: '100%', borderRadius: 15, padding: 15, marginBottom: 10, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  legendTitle: { color: '#2B4C9B', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 5 },
  separator: { height: 1, backgroundColor: '#2B4C9B', marginBottom: 10, opacity: 0.5 },
  legendColumns: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, paddingHorizontal: 5 },
  legendText: { fontSize: 11, color: '#333', fontWeight: '500', marginBottom: 4 },
  emptyText: { color: '#1C2E4A', opacity: 0.6, fontSize: 14, textAlign: 'center', width: '100%', marginTop: 20 }
});