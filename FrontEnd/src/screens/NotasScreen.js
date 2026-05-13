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

export default function SituacaoNotasScreen({ navigation }) {
  
  
  const [notas, setNotas] = useState([
    { id: '1', label: 'Nota1', valor: '00.00' },
    { id: '2', label: 'Nota2', valor: '00.00' },
    { id: '3', label: 'Nota3', valor: '00.00' },
  ]);

  
  const adicionarNota = () => {
    const novaId = (notas.length + 1).toString();
    setNotas([...notas, { id: novaId, label: `Nota${novaId}`, valor: '00.00' }]);
  };

  
  const historicoNotas = [
    { id: '1', disciplina: 'xxxxxxxxxxxxxxx', final: 'xx.xx', situacao: 'Aprovado' },
    { id: '2', disciplina: 'xxxxxxxxxxxxxxx', final: 'xx.xx', situacao: 'Prova Final' },
    { id: '3', disciplina: '', final: '', situacao: '' },
    { id: '4', disciplina: '', final: '', situacao: '' },
  ];

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
      <LinearGradient 
        colors={['#7895E8', '#A9C4F0', '#DCE8F5']} 
        style={styles.mainGradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- Card de Entrada de Notas --- */}
          <View style={styles.inputCard}>
            {/* Seletor de Disciplina */}
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>Disciplina</Text>
              <Feather name="chevron-down" size={24} color="#1C2E4A" />
            </TouchableOpacity>

            {/* Lista de Notas */}
            {notas.map((item) => (
              <View key={item.id} style={styles.notaRow}>
                <Text style={styles.notaLabel}>{item.label}</Text>
                <View style={styles.notaInputContainer}>
                  <Text style={styles.notaValue}>{item.valor}</Text>
                </View>
                <TouchableOpacity style={styles.iconAction}>
                  <Feather name="edit-3" size={18} color="#1C2E4A" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconAction}>
                  <MaterialCommunityIcons name="minus-circle" size={22} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Botão Adicionar + */}
            <TouchableOpacity style={styles.btnAdicionar} onPress={adicionarNota}>
              <Text style={styles.btnAdicionarText}>Adicionar +</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Calcular e Salvar */}
          <TouchableOpacity 
            style={styles.btnCalcular} 
            onPress={() => Alert.alert("Cálculo", "Média calculada e salva!")}
          >
            <Text style={styles.btnCalcularText}>Calcular e Salvar</Text>
          </TouchableOpacity>

          {/* --- Tabela de Situação --- */}
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Disciplina</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Nota Final</Text>
              <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Situação</Text>
            </View>

            {historicoNotas.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cellText, { flex: 2 }]}>{row.disciplina}</Text>
                <Text style={[styles.cellText, { flex: 1 }]}>{row.final}</Text>
                <View style={[styles.cellSituacao, { flex: 1.2 }]}>
                  {row.situacao !== '' && (
                    <View style={[
                      styles.badge, 
                      row.situacao === 'Aprovado' ? styles.badgeAprovado : styles.badgeProvaFinal
                    ]}>
                      <Text style={styles.badgeText}>{row.situacao}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Botão Gerar Relatório PDF */}
          <TouchableOpacity style={styles.btnPdf}>
            <Text style={styles.btnPdfText}>Gerar Relatório PDF</Text>
          </TouchableOpacity>

        </ScrollView>
      </LinearGradient>
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
  dropdownText: { fontSize: 16, fontWeight: 'bold', color: '#1C2E4A' },
  notaRow: { 
    flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' 
  },
  notaLabel: { fontSize: 14, fontWeight: 'bold', color: '#1C2E4A', width: 50 },
  notaInputContainer: {
    backgroundColor: '#FFF', borderRadius: 15, height: 35, flex: 1, marginHorizontal: 10,
    justifyContent: 'center', alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: '#8DA4C4'
  },
  notaValue: { color: '#1C2E4A', fontWeight: 'bold' },
  iconAction: { paddingHorizontal: 5 },
  btnAdicionar: {
    backgroundColor: '#1B3668', borderRadius: 15, paddingVertical: 6, paddingHorizontal: 20,
    alignSelf: 'center', marginTop: 5
  },
  btnAdicionarText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  
  btnCalcular: {
    backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20,
    marginBottom: 25, elevation: 4, shadowColor: '#000', shadowOpacity: 0.2
  },
  btnCalcularText: { color: '#1B3668', fontWeight: 'bold', fontSize: 14 },
  
  btnPdf: {
    backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20,
    marginTop: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.2
  },
  btnPdfText: { color: '#1B3668', fontWeight: 'bold', fontSize: 14 },

  
  tableCard: {
    backgroundColor: '#FFF', width: '100%', borderRadius: 15, overflow: 'hidden', marginBottom: 10,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
  },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1C2E4A', paddingVertical: 10 },
  tableHeaderText: { color: '#FFF', fontWeight: 'bold', fontSize: 11, textAlign: 'center' },
  tableRow: { 
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EBF3FA', height: 40, alignItems: 'center' 
  },
  cellText: { fontSize: 10, color: '#333', textAlign: 'center', fontWeight: 'bold' },
  cellSituacao: { alignItems: 'center', justifyContent: 'center' },
  
  
  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10, minWidth: 70, alignItems: 'center' },
  badgeAprovado: { backgroundColor: '#BDECB6' }, 
  badgeProvaFinal: { backgroundColor: '#F9E79F' },
  badgeText: { fontSize: 9, fontWeight: 'bold', color: '#1C2E4A' }
});