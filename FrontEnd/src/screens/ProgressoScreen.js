import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';

// Pegar a largura da tela para os gráficos se adaptarem
const screenWidth = Dimensions.get("window").width;
const halfWidth = (screenWidth / 2) - 30; // Metade da tela menos as margens

export default function ProgressoScreen({ navigation }) {
  
  // --- Dados dos Gráficos ---
  const notasData = {
    labels: ["Port", "Mat", "Cien", "Hist", "Geo"],
    datasets: [{ data: [8, 7, 9, 8, 7] }]
  };

  const tarefasData = [
    { name: "Feitas", population: 75, color: "#4CAF50", legendFontColor: "#333", legendFontSize: 11 },
    { name: "Não Feitas", population: 25, color: "#8BAEE0", legendFontColor: "#333", legendFontSize: 11 }
  ];

  const presencaData = {
    labels: ["Presença"],
    data: [0.88] // 88%
  };

  const faltasData = {
    labels: ["Mar", "Abr", "Mai", "Jun"],
    datasets: [{ data: [2.5, 1.5, 0.5, 1] }]
  };


  const chartConfig = {
    backgroundGradientFrom: "#FFF",
    backgroundGradientTo: "#FFF",
    color: (opacity = 1) => `rgba(58, 91, 199, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    decimalPlaces: 0,
    fillShadowGradientOpacity: 1,
  };

  const greenChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, 
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="school-outline" size={32} color="#1C2E4A" />
          <Text style={styles.headerTitle}>Progresso</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
        </TouchableOpacity>
      </View>

      {/* --- Conteúdo Principal com Gradiente --- */}
      <LinearGradient colors={['#7895E8', '#A9C4F0', '#DCE8F5']} style={styles.mainGradient}>
        <View style={styles.whitePanel}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* --- ÁREA DE DASHBOARD (Gráficos Reais) --- */}
            <View style={styles.dashboardContainer}>
              
              {/* Linha Superior (Notas e Tarefas) */}
              <View style={styles.row}>
                {/* Gráfico 1: Notas */}
                <View style={[styles.chartCard, { width: halfWidth }]}>
                  <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="finance" size={16} color="#1C2E4A" />
                    <Text style={styles.cardTitle}>NOTAS</Text>
                  </View>
                  <BarChart
                    data={notasData}
                    width={halfWidth - 10}
                    height={120}
                    chartConfig={greenChartConfig}
                    withInnerLines={false}
                    showValuesOnTopOfBars={true}
                    style={{ marginLeft: -15 }}
                  />
                  <View style={styles.badgeGreen}>
                    <Text style={styles.badgeText}>Média: 8.2</Text>
                  </View>
                </View>

                {/* Gráfico 2: Tarefas (Pizza) */}
                <View style={[styles.chartCard, { width: halfWidth }]}>
                  <View style={styles.cardHeader}>
                    <Feather name="list" size={16} color="#1C2E4A" />
                    <Text style={styles.cardTitle}>TAREFAS</Text>
                  </View>
                  <PieChart
                    data={tarefasData}
                    width={halfWidth}
                    height={100}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"-10"}
                    absolute
                  />
                </View>
              </View>

              {/* Linha Inferior (Frequência e Faltas) */}
              <View style={styles.fullCard}>
                <View style={styles.cardHeader}>
                  <Feather name="calendar" size={16} color="#1C2E4A" />
                  <Text style={styles.cardTitle}>FREQUÊNCIA E FALTAS</Text>
                </View>
                
                <View style={styles.row}>
                  {/* Gráfico 3: Frequência */}
                  <View style={styles.halfInnerCard}>
                    <Text style={styles.innerTitle}>Presença</Text>
                    <ProgressChart
                      data={presencaData}
                      width={100}
                      height={100}
                      strokeWidth={12}
                      radius={35}
                      chartConfig={greenChartConfig}
                      hideLegend={true}
                    />
                    <Text style={styles.progressCenterText}>88%</Text>
                  </View>

                  {/* Gráfico 4: Faltas */}
                  <View style={styles.halfInnerCard}>
                    <Text style={styles.innerTitle}>Faltas/Mês</Text>
                    <BarChart
                      data={faltasData}
                      width={halfWidth - 20}
                      height={100}
                      chartConfig={{...chartConfig, color: () => '#8BAEE0'}}
                      withInnerLines={false}
                      showValuesOnTopOfBars={true}
                      style={{ marginLeft: -25 }}
                    />
                  </View>
                </View>
              </View>

            </View>

            {/* --- ÁREA: RESUMO DO SEMESTRE --- */}
            <View style={styles.resumoContainer}>
              <Text style={styles.resumoTitle}>Resumo do Semestre</Text>
              
              <View style={styles.row}>
                <View style={styles.resumoCard}>
                  <View style={styles.resumoCardHeader}>
                    <MaterialCommunityIcons name="folder-outline" size={24} color="#3A5BC7" />
                    <Text style={[styles.resumoCardText, { color: '#3A5BC7' }]}>Trabalhos{'\n'}pendentes</Text>
                  </View>
                  <Text style={[styles.resumoCardNumber, { color: '#3A5BC7' }]}>0</Text>
                </View>

                <View style={styles.resumoCard}>
                  <View style={styles.resumoCardHeader}>
                    <MaterialCommunityIcons name="clock-outline" size={24} color="#D85A8A" />
                    <Text style={[styles.resumoCardText, { color: '#D85A8A', marginTop: 8 }]}>Faltas</Text>
                  </View>
                  <Text style={[styles.resumoCardNumber, { color: '#D85A8A' }]}>2</Text>
                </View>
              </View>
            </View>

          </ScrollView>
        </View>
      </LinearGradient>

      {/* --- Menu de Navegação Inferior --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Configuracao')}>
          <Feather name="settings" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="book-multiple-outline" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AreaEstudo')}>
          <Feather name="home" size={28} color="#6A7A8C" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Progresso')}>
          <MaterialCommunityIcons name="school-outline" size={30} color="#1E3A8A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notificacoes')}>
          <Feather name="bell" size={26} color="#6A7A8C" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 15, backgroundColor: '#FFF' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 10 },
  mainGradient: { flex: 1 },
  whitePanel: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: 10, paddingHorizontal: 15, paddingTop: 20, elevation: 10 },
  scrollContent: { paddingBottom: 100 },

  
  dashboardContainer: {
    backgroundColor: '#FAFCFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#DCE8F5',
    padding: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 10,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    overflow: 'hidden'
  },
  fullCard: {
    backgroundColor: '#EBF3FA',
    borderRadius: 15,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A9C4F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginLeft: 5,
  },
  halfInnerCard: {
    backgroundColor: '#FFF',
    width: '48%',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    position: 'relative'
  },
  innerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 5,
  },
  progressCenterText: {
    position: 'absolute',
    top: '55%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C2E4A'
  },
  badgeGreen: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 5,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  
  resumoContainer: { backgroundColor: '#A9C4F0', borderRadius: 20, padding: 15, marginBottom: 20 },
  resumoTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C2E4A', marginBottom: 15, marginLeft: 5 },
  resumoCard: { backgroundColor: '#FFF', width: '48%', borderRadius: 15, padding: 15, alignItems: 'center', elevation: 3 },
  resumoCardHeader: { flexDirection: 'row', alignItems: 'flex-start', width: '100%', justifyContent: 'center' },
  resumoCardText: { fontSize: 13, fontWeight: 'bold', marginLeft: 5, textAlign: 'center' },
  resumoCardNumber: { fontSize: 28, fontWeight: 'bold', marginTop: 10 },
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 15, paddingBottom: 35, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', elevation: 20 }
});