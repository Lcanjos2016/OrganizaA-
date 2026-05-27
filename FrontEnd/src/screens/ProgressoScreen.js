import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get("window").width;
// Padding horizontal do whitePanel é 15 de cada lado (30 total) + 10 de espaço entre os cards = 40
const halfWidth = (screenWidth - 40) / 2;

export default function ProgressoScreen({ navigation }) {
 
  const [loading, setLoading] = useState(true);
  const [mediaGeral, setMediaGeral] = useState(0);
  const [totalFaltas, setTotalFaltas] = useState(0);
  const [trabalhosPendentes, setTrabalhosPendentes] = useState(0);
  const [totalTarefas, setTotalTarefas] = useState(0);
  const [concluidasCount, setConcluidasCount] = useState(0);

  const [notasData, setNotasData] = useState({
    labels: ["N/A"],
    datasets: [{ data: [0] }]
  });

  const [presencaData, setPresencaData] = useState({
    labels: ["Presença"],
    data: [1.0]
  });

  const [faltasMensaisData, setFaltasMensaisData] = useState({
    labels: ["Mar", "Abr", "Mai", "Jun"],
    datasets: [{ data: [0, 0, 0, 0] }]
  });

  useFocusEffect(
    useCallback(() => {
      const processarMetricasDashboard = async () => {
        try {
          setLoading(true);
          const resDisciplinas = await AsyncStorage.getItem('@storage_disciplinas');
          const resAtividades = await AsyncStorage.getItem('@storage_atividades');
          const resFaltas = await AsyncStorage.getItem('@storage_faltas');
          const resNotas = await AsyncStorage.getItem('@storage_notas_progresso');

          const listaDisciplinas = resDisciplinas ? JSON.parse(resDisciplinas) : [];
          const listaAtividades = resAtividades ? JSON.parse(resAtividades) : [];
          const listaFaltas = resFaltas ? JSON.parse(resFaltas) : [];
          const listaNotas = resNotas ? JSON.parse(resNotas) : [];

          // 1. Notas das Disciplinas
          if (listaNotas.length > 0) {
            const labels = listaNotas.map(n => n.disciplina ? n.disciplina.substring(0, 4).toUpperCase() : "DISC");
            const valores = listaNotas.map(n => parseFloat(n.media || 0));
            const soma = valores.reduce((acc, curr) => acc + curr, 0);
            
            setNotasData({ labels, datasets: [{ data: valores }] });
            setMediaGeral((soma / valores.length).toFixed(1));
          } else {
            setNotasData({ labels: ["N/A"], datasets: [{ data: [0] }] });
            setMediaGeral(0);
          }

          // 2. Métricas de Tarefas
          const totalAtiv = listaAtividades.length;
          const concluidas = listaAtividades.filter(a => a.feita === true || a.status === 'concluida').length;
          const pendentes = totalAtiv - concluidas;
         
          setTrabalhosPendentes(pendentes);
          setTotalTarefas(totalAtiv);
          setConcluidasCount(concluidas);

          // 3. Faltas Consolidadas por Mês
          let somaFaltasTotal = 0;
          const mesesMapeados = ["Mar", "Abr", "Mai", "Jun"];
          const contagemMeses = { "Mar": 0, "Abr": 0, "Mai": 0, "Jun": 0 };

          listaFaltas.forEach(f => {
            somaFaltasTotal += parseInt(f.quantidade || 0);
            if (contagemMeses[f.mes] !== undefined) {
              contagemMeses[f.mes] += parseInt(f.quantidade || 0);
            }
          });
          setTotalFaltas(somaFaltasTotal);

          setFaltasMensaisData({
            labels: mesesMapeados,
            datasets: [{ data: mesesMapeados.map(m => contagemMeses[m]) }]
          });

          // 4. Frequência
          const aulasEstimadas = listaDisciplinas.length * 60 || 240;
          const percentualPresenca = Math.max(0, (aulasEstimadas - somaFaltasTotal) / aulasEstimadas);
          setPresencaData({
            labels: ["Presença"],
            data: [parseFloat(percentualPresenca.toFixed(2))]
          });

        } catch (error) {
          console.error("Erro ao sincronizar métricas no Dashboard:", error);
        } finally {
          setLoading(false);
        }
      };

      processarMetricasDashboard();
    }, [])
  );

  const chartConfigBase = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(28, 46, 74, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    fillShadowGradientOpacity: 1,
  };

  return (
    <SafeAreaView style={styles.container}>
     
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="school-outline" size={32} color="#1C2E4A" />
          <Text style={styles.headerTitle}>Progresso</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.exitButton}>
          <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
        </TouchableOpacity>
      </View>

      {/* --- Fundo Gradiente --- */}
      <LinearGradient colors={['#7895E8', '#A9C4F0', '#A9C4F0']} style={styles.mainGradient}>
       
        {/* Painel Branco Flutuante */}
        <View style={styles.whitePanel}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#3A5CA8" />
              <Text style={styles.loaderText}>Sincronizando dados...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
             
              {/* --- LINHA SUPERIOR: NOTAS E TAREFAS/FALTAS LADO A LADO --- */}
              <View style={[styles.row, { marginBottom: 16 }]}>
               
                {/* Card de Notas */}
                <View style={[styles.chartCard, { width: halfWidth }]}>
                  <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="finance" size={13} color="#1C2E4A" />
                    <Text style={styles.cardTitle}>NOTAS</Text>
                  </View>
                  <BarChart
                    data={notasData}
                    width={halfWidth - 5}
                    height={110} // Aumentado ligeiramente para melhor visualização das barras
                    chartConfig={{
                      ...chartConfigBase,
                      color: () => '#4CAF50',
                      fillShadowGradient: '#4CAF50'
                    }}
                    withInnerLines={false}
                    showValuesOnTopOfBars={true}
                    style={styles.barChartStyle}
                  />
                  <View style={styles.badgeGreen}>
                    <Text style={styles.badgeText}>Média: {mediaGeral}</Text>
                  </View>
                </View>

                {/* Card de Faltas por Mês */}
                <View style={[styles.chartCard, { width: halfWidth }]}>
                  <View style={styles.cardHeader}>
                    <Feather name="trending-up" size={13} color="#1C2E4A" />
                    <Text style={styles.cardTitle}>FALTAS</Text>
                  </View>
                  <BarChart
                    data={faltasMensaisData}
                    width={halfWidth - 5}
                    height={110} // Aumentado ligeiramente
                    chartConfig={{
                      ...chartConfigBase,
                      color: () => '#D85A8A',
                      fillShadowGradient: '#D85A8A'
                    }}
                    withInnerLines={false}
                    showValuesOnTopOfBars={true}
                    style={styles.monthlyBarChartStyle}
                  />
                  <View style={[styles.badgeGreen, { backgroundColor: '#D85A8A' }]}>
                    <Text style={styles.badgeText}>Total: {totalFaltas}</Text>
                  </View>
                </View>

              </View>

              {/* --- CARD DO MEIO: FREQUÊNCIA --- */}
              <View style={styles.fullCard}>
                <View style={styles.fullCardHeader}>
                  <Feather name="calendar" size={14} color="#1C2E4A" />
                  <Text style={styles.fullCardTitle}>FREQUÊNCIA E FALTAS</Text>
                </View>
               
                <View style={styles.rowCenter}>
                  <View style={styles.innerPresenceContainer}>
                    <Text style={styles.innerTitle}>Presença Total</Text>
                    <View style={styles.progressWrapper}>
                      <ProgressChart
                        data={presencaData}
                        width={100} // Aumentado o gráfico de pizza
                        height={100}
                        strokeWidth={9}
                        radius={36}
                        chartConfig={{
                          ...chartConfigBase,
                          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`
                        }}
                        hideLegend={true}
                      />
                      <Text style={styles.progressCenterText}>
                        {Math.round(presencaData.data[0] * 100)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* --- ÁREA INFERIOR: RESUMO DO SEMESTRE --- */}
              <View style={styles.resumoContainer}>
                <Text style={styles.resumoTitle}>Resumo de Atividades</Text>
               
                <View style={styles.row}>
                  {/* Pendentes */}
                  <View style={styles.resumoCard}>
                    <View style={styles.resumoCardHeader}>
                      <MaterialCommunityIcons name="folder-outline" size={20} color="#3A5BC7" />
                      <Text style={[styles.resumoCardText,{ color: '#3A5BC7' }]}>Atividades a Fazer</Text>
                    </View>
                    <Text style={[styles.resumoCardNumber,{ color: '#3A5BC7' }]}>{trabalhosPendentes}</Text>
                  </View>

                  {/* Concluídas */}
                  <View style={styles.resumoCard}>
                    <View style={styles.resumoCardHeader}>
                      <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={20} color="#4CAF50" />
                      <Text style={[styles.resumoCardText, { color: '#4CAF50' }]}>Atividades Concluídas</Text>
                    </View>
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
  container: { flex: 1, backgroundColor: '#e9dcdc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 15, backgroundColor: '#FFF' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 10 },
  exitButton: { padding: 4 },
  mainGradient: { flex: 1 },
  whitePanel: { flex: 1, backgroundColor: '#eef3fb', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: 10, paddingHorizontal: 15, paddingTop: 22 },
  scrollContent: { paddingBottom: 30 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  loaderText: { marginTop: 10, color: '#1C2E4A', fontWeight: '500', fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
  
  // Cards de Gráficos Superiores (Aumentados na altura mínima de 180 para 205)
  chartCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, alignItems: 'center', minHeight: 205, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCE8F5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignSelf: 'stretch', justifyContent: 'center' },
  cardTitle: { fontSize: 10, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 5, letterSpacing: 0.5 },
  barChartStyle: { marginLeft: -22, marginTop: 6 },
  monthlyBarChartStyle: { marginLeft: -22, marginTop: 6 },
  badgeGreen: { backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, marginTop: 4 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  
  // Card de Frequência do Meio (Aumentado padding e espaçamento interno)
  fullCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, marginBottom: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 },
  fullCardHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCE8F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 14, justifyContent: 'center' },
  fullCardTitle: { fontSize: 11, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 6 },
  innerPresenceContainer: { alignItems: 'center', paddingVertical: 6 },
  innerTitle: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 10 },
  progressWrapper: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center' },
  progressCenterText: { position: 'absolute', fontSize: 17, fontWeight: 'bold', color: '#1C2E4A' },
  
  // Rodapé do painel inferior (Aumentado minHeight de 85 para 92)
  resumoContainer: { backgroundColor: '#A9C4F0', borderRadius: 24, padding: 16 },
  resumoTitle: { fontSize: 15, fontWeight: 'bold', color: '#1C2E4A', marginBottom: 12, textAlign: 'center' },
  resumoCard: { backgroundColor: '#FFF', flex: 1, borderRadius: 16, padding: 8, alignItems: 'center', marginHorizontal: 3, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, minHeight: 92, justifyContent: 'center' },
  resumoCardHeader: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', marginBottom: 4 },
  resumoCardText: { fontSize: 10, fontWeight: 'bold', marginLeft: 4, textAlign: 'center' },
  resumoCardNumber: { fontSize: 24, fontWeight: 'bold' }
});