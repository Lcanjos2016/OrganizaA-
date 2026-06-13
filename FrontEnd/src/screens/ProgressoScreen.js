import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { disciplineApi, activityApi } from '../services/api';

export default function ProgressoScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [mediasPorDisciplina, setMediasPorDisciplina] = useState([]); 
  const [faltasPorDisciplina, setFaltasPorDisciplina] = useState([]);
  const [trabalhosPendentes, setTrabalhosPendentes] = useState(0);
  const [concluidasCount, setConcluidasCount] = useState(0);
  const [presencaData, setPresencaData] = useState({ data: [1.0] });

  useFocusEffect(
    useCallback(() => {
      const processarMetricas = async () => {
        try {
          setLoading(true);
          const [listaDisciplinas, listaAtividades] = await Promise.all([
            disciplineApi.list(),
            activityApi.list(),
          ]);
          const listaNotas = listaDisciplinas
            .filter(d => d.notaFinal && d.situacao)
            .map(d => ({
              id: d.id,
              disciplina: d.nome,
              media: parseFloat(d.notaFinal) || 0,
              situacao: d.situacao,
            }));

          setMediasPorDisciplina(listaNotas);

          const somaTotal = listaDisciplinas.reduce(
            (total, item) => total + Number(item.faltas || 0),
            0
          );
          setFaltasPorDisciplina(
            listaDisciplinas.map((item) => ({
              nome: item.nome,
              total: Number(item.faltas || 0),
            }))
          );

          const concluidas = listaAtividades.filter(a => a.feita === true || a.status === 'concluida').length;
          setTrabalhosPendentes(listaAtividades.length - concluidas);
          setConcluidasCount(concluidas);

          const aulasEstimadas = listaDisciplinas.length * 60 || 240;
          setPresencaData({ data: [Math.max(0, (aulasEstimadas - somaTotal) / aulasEstimadas)] });

        } finally { setLoading(false); }
      };
      processarMetricas();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="school-outline" size={32} color="#1C2E4A" />
          <Text style={styles.headerTitle}>Progresso</Text>
        </View>
      </View>

      {/* MODIFICADO: O gradiente agora começa com a cor branca (#FFF) para sumir com a faixa azul escuro de trás */}
      <LinearGradient colors={['#FFF', '#A9C4F0', '#A9C4F0']} style={styles.mainGradient}>
        <View style={styles.whitePanel}>
          {loading ? <ActivityIndicator size="large" color="#3A5CA8" /> : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              
              {/* Card de Médias Individuais */}
              <View style={styles.fullCard}>
                <Text style={styles.cardTitle}>MÉDIAS POR DISCIPLINA</Text>
                {mediasPorDisciplina.map((n, i) => (
                  <View key={i} style={styles.faltaItem}>
                    <Text style={styles.faltaNome}>{n.disciplina}</Text>
                    <Text style={[styles.faltaValor, { color: '#3A5CA8' }]}>{n.media}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.fullCard}>
                <Text style={styles.cardTitle}>FALTAS POR DISCIPLINA</Text>
                {faltasPorDisciplina.map((f, i) => (
                  <View key={i} style={styles.faltaItem}>
                    <Text style={styles.faltaNome}>{f.nome}</Text>
                    <Text style={styles.faltaValor}>{f.total} faltas</Text>
                  </View>
                ))}
              </View>

              <View style={styles.fullCard}>
                <Text style={styles.cardTitle}>FREQUÊNCIA GERAL</Text>
                <View style={styles.rowCenter}>
                  <ProgressChart
                    data={presencaData} width={150} height={120} strokeWidth={12} radius={40}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(28, 46, 74, ${opacity})`,
                      backgroundGradientFrom: "#FFF",
                      backgroundGradientTo: "#FFF",
                    }}
                    hideLegend={true}
                  />
                  <Text style={styles.progressCenterText}>{Math.round(presencaData.data[0] * 100)}%</Text>
                </View>
              </View>

              <View style={styles.resumoContainer}>
                <Text style={styles.resumoTitle}>Resumo de Atividades</Text>
                <View style={styles.row}>
                  <View style={styles.resumoCard}>
                    <Text style={[styles.resumoCardText, { color: '#3A5BC7' }]}>Pendentes</Text>
                    <Text style={[styles.resumoCardNumber, { color: '#3A5BC7' }]}>{trabalhosPendentes}</Text>
                  </View>
                  <View style={styles.resumoCard}>
                    <Text style={[styles.resumoCardText, { color: '#4CAF50' }]}>Concluídas</Text>
                    <Text style={[styles.resumoCardNumber, { color: '#4CAF50' }]}>{concluidasCount}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' }, 
  header: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 40, 
    paddingBottom: 15, 
    backgroundColor: '#FFF' 
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 10 },
  mainGradient: { flex: 1 },
  whitePanel: { 
    flex: 1, 
    backgroundColor: '#eef3fb', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    marginTop: 10, // MANTIDO: O espaço de 10px original foi preservado!
    paddingHorizontal: 15, 
    paddingTop: 22 
  },
  scrollContent: { paddingBottom: 30 },
  fullCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 11, fontWeight: 'bold', color: '#1C2E4A', marginBottom: 10, opacity: 0.6 },
  faltaItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderColor: '#EEE' },
  faltaNome: { fontSize: 14, color: '#333' },
  faltaValor: { fontSize: 14, fontWeight: 'bold', color: '#D85A8A' },
  rowCenter: { alignItems: 'center', justifyContent: 'center' },
  progressCenterText: { position: 'absolute', fontSize: 20, fontWeight: 'bold', color: '#1C2E4A' },
  resumoContainer: { backgroundColor: '#A9C4F0', borderRadius: 24, padding: 16 },
  resumoTitle: { fontSize: 15, fontWeight: 'bold', color: '#1C2E4A', marginBottom: 12, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  resumoCard: { backgroundColor: '#FFF', flex: 1, borderRadius: 16, padding: 15, alignItems: 'center', marginHorizontal: 5, elevation: 2 },
  resumoCardText: { fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
  resumoCardNumber: { fontSize: 24, fontWeight: 'bold', marginTop: 5 }
});