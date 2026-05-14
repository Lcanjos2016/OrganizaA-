import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export default function ProgressoScreen({ navigation }) {
  
  const materias = [
    { id: '1', nome: 'Programação', img: 'https://i.postimg.cc/q7SjD7K5/prog.png', progresso: 0, nota: '0.0' },
    { id: '2', nome: 'História antiga', img: 'https://i.postimg.cc/L5XqMh1m/hist.png', progresso: 0, nota: '0.0' },
    { id: '3', nome: 'Matemática', img: 'https://i.postimg.cc/mD8T1h4M/math.png', progresso: 0, nota: '0.0' },
    { id: '4', nome: 'Gramática', img: 'https://i.postimg.cc/vH4B6LwP/gram.png', progresso: 0, nota: '0.0' },
    { id: '5', nome: 'Ciências', img: 'https://i.postimg.cc/K8M0H0hK/sci.png', progresso: 0, nota: '0.0' },
  ];

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

      {/* --- Conteúdo Principal --- */}
      <LinearGradient colors={['#7895E8', '#A9C4F0', '#DCE8F5']} style={styles.mainGradient}>
        <View style={styles.whitePanel}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            
            <Text style={styles.sectionTitle}>Resumo do Semestre</Text>

            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { backgroundColor: '#EBF3FA' }]}>
                <MaterialCommunityIcons name="folder-outline" size={24} color="#3498DB" />
                <Text style={[styles.summaryLabel, { color: '#3498DB' }]}>Trabalhos{"\n"}pendentes</Text>
                <Text style={[styles.summaryNumber, { color: '#3498DB' }]}>0</Text>
              </View>

              <View style={[styles.summaryCard, { backgroundColor: '#FDEDEC' }]}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#E74C3C" />
                <Text style={[styles.summaryLabel, { color: '#E74C3C' }]}>Faltas</Text>
                <Text style={[styles.summaryNumber, { color: '#E74C3C' }]}>0</Text>
              </View>
            </View>

            {materias.map((item) => (
              <View key={item.id} style={styles.subjectCard}>
                <Image source={{ uri: item.img }} style={styles.subjectImage} />
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{item.nome}</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${item.progresso}%` }]} />
                    </View>
                    <Text style={styles.progressPercent}>{item.progresso}%</Text>
                  </View>
                </View>
                <Text style={styles.subjectGrade}>{item.nota}</Text>
              </View>
            ))}

          </ScrollView>
        </View>
      </LinearGradient>

      {/* --- Menu de Navegação Inferior CORRIGIDO --- */}
      <View style={styles.bottomNav}>
        
        {/* 1. Engrenagem (Configurações) */}
        <TouchableOpacity onPress={() => navigation.navigate('Configuracao')}>
          <Feather name="settings" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        
        {/* 2. Livros (Disciplinas/Materiais) */}
        <TouchableOpacity>
          <MaterialCommunityIcons name="book-multiple-outline" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        
        {/* 3. Casinha (Inativa: Cinza) -> Vai para Área de Estudos */}
        <TouchableOpacity onPress={() => navigation.navigate('AreaEstudo')}>
          <Feather name="home" size={28} color="#6A7A8C" />
        </TouchableOpacity>
        
        {/* 4. Chapéu de Formatura (Ativo: Azul Escuro) */}
        <TouchableOpacity onPress={() => navigation.navigate('Progresso')}>
          <MaterialCommunityIcons name="school-outline" size={30} color="#1E3A8A" />
        </TouchableOpacity>

        {/* 5. Sino de Notificações (Inativo: Cinza) -> Vai para Notificações */}
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
  whitePanel: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: 20, paddingHorizontal: 20, paddingTop: 30, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C2E4A', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  summaryCard: { width: '48%', borderRadius: 20, padding: 15, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  summaryLabel: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  summaryNumber: { fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  subjectCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 15, padding: 10, marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  subjectImage: { width: 45, height: 45, borderRadius: 10, resizeMode: 'cover' },
  subjectInfo: { flex: 1, marginLeft: 15 },
  subjectName: { fontSize: 14, fontWeight: 'bold', color: '#1C2E4A' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  progressBarBg: { flex: 1, height: 6, backgroundColor: '#E0E6ED', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#8BAEE0', borderRadius: 3 },
  progressPercent: { fontSize: 10, color: '#6A7A8C', marginLeft: 8 },
  subjectGrade: { fontSize: 16, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 10 },
  
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 15, paddingBottom: 35, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: -3 } }
});