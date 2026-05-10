import React, { useState } from 'react';
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
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function FaltasScreen({ navigation }) {
  // Estado para alternar entre as abas 'Adicionar' e 'Visualizar'
  const [abaAtiva, setAbaAtiva] = useState('Adicionar');

  // --- DADOS DA ABA: ADICIONAR ---
  const [disciplinas, setDisciplinas] = useState([
    { id: '1', nome: 'xxxxxxxxxxxxxxx', faltas: 0 },
    { id: '2', nome: 'xxxxxxxxxxxxxxx', faltas: 0 },
    { id: '3', nome: 'xxxxxxxxxxxxxxx', faltas: 0 },
  ]);

  const alterarFaltas = (id, valor) => {
    setDisciplinas(disciplinasAtuais => 
      disciplinasAtuais.map(disciplina => {
        if (disciplina.id === id) {
          const novasFaltas = disciplina.faltas + valor;
          return { ...disciplina, faltas: novasFaltas >= 0 ? novasFaltas : 0 };
        }
        return disciplina;
      })
    );
  };

  const handleSalvar = () => {
    Alert.alert("Sucesso", "Faltas salvas com sucesso!");
  };

  // --- DADOS DA ABA: VISUALIZAR ---
  // Linhas da tabela de visualização
  const tableRows = [
    { id: '1', codigo: '1', disciplina: 'xxxxxxxxxxxxxxxxxxx', faltas: '0/n' },
    { id: '2', codigo: '', disciplina: '', faltas: '' },
    { id: '3', codigo: '', disciplina: '', faltas: '' },
    { id: '4', codigo: '', disciplina: '', faltas: '' },
    { id: '5', codigo: '', disciplina: '', faltas: '' },
    { id: '6', codigo: '', disciplina: '', faltas: '' },
    { id: '7', codigo: '', disciplina: '', faltas: '' },
  ];

  // Legenda de códigos (igual à tela de disciplinas)
  const codigosExemplo = [
    { id: '1', texto: '1 - xxxxxxxxxxxxxxx' },
    { id: '2', texto: '2 - xxxxxxxxxxxxxxx' },
    { id: '3', texto: '3 - xxxxxxxxxxxxxxx' },
    { id: '4', texto: '4 - xxxxxxxxxxxxxxx' },
    { id: '5', texto: '5 - xxxxxxxxxxxxxxx' },
    { id: '6', texto: '6 - xxxxxxxxxxxxxxx' },
    { id: '7', texto: '7 - xxxxxxxxxxxxxxx' },
    { id: '8', texto: '8 - xxxxxxxxxxxxxxx' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho (O título muda dinamicamente) --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back-circle-outline" size={32} color="#1C2E4A" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {abaAtiva === 'Adicionar' ? 'Adicionar Faltas' : 'Visualizar Faltas'}
        </Text>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.iconButton}>
          <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
        </TouchableOpacity>
      </View>

      {/* --- Corpo Principal (O gradiente muda dependendo da aba) --- */}
      <LinearGradient 
        colors={abaAtiva === 'Adicionar' ? ['#8BAEE0', '#FFFFFF', '#B7CFF0'] : ['#3A5CA8', '#9DBCE0', '#EBF3FA']} 
        style={styles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- Toggle (Abas: Adicionar / Visualizar) --- */}
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

          {/* ============================================================== */}
          {/* ABA: ADICIONAR FALTAS                                          */}
          {/* ============================================================== */}
          {abaAtiva === 'Adicionar' ? (
            <>
              {/* Lista de Disciplinas com Contadores */}
              <View style={styles.listContainer}>
                {disciplinas.map((item) => (
                  <View key={item.id} style={styles.row}>
                    <Text style={styles.subjectText}>{item.nome}</Text>
                    
                    <View style={styles.counterContainer}>
                      <TouchableOpacity style={styles.counterBtn} onPress={() => alterarFaltas(item.id, 1)}>
                        <Text style={styles.counterSymbol}>+</Text>
                      </TouchableOpacity>
                      
                      <View style={styles.counterValueBox}>
                        <Text style={styles.counterValue}>{item.faltas}</Text>
                      </View>
                      
                      <TouchableOpacity style={styles.counterBtn} onPress={() => alterarFaltas(item.id, -1)}>
                        <Text style={styles.counterSymbol}>-</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                <Text style={styles.btnSalvarText}>Salvar</Text>
              </TouchableOpacity>
            </>
          ) : (
          /* ============================================================== */
          /* ABA: VISUALIZAR FALTAS                                         */
          /* ============================================================== */
            <>
              {/* --- Tabela --- */}
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Código</Text>
                  <Text style={[styles.tableHeaderText, { flex: 2 }]}>Disciplina</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1 }]}>N.º de Faltas</Text>
                </View>

                {tableRows.map((row, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 0.5 }]}>
                      <Text style={styles.cellText}>{row.codigo}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 2 }]}>
                      <Text style={styles.cellText}>{row.disciplina}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 1, borderRightWidth: 0 }]}>
                      <Text style={styles.cellText}>{row.faltas}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* --- Cartão Inferior (Códigos e Disciplinas) --- */}
              <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Códigos e disciplinas</Text>
                <View style={styles.separator} />
                
                <View style={styles.legendColumns}>
                  <View style={styles.column}>
                    {codigosExemplo.slice(0, 4).map((item) => (
                      <Text key={item.id} style={styles.legendText}>{item.texto}</Text>
                    ))}
                  </View>
                  <View style={styles.column}>
                    {codigosExemplo.slice(4, 8).map((item) => (
                      <Text key={item.id} style={styles.legendText}>{item.texto}</Text>
                    ))}
                  </View>
                </View>
              </View>
            </>
          )}

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 35, 
    paddingBottom: 25,
    backgroundColor: '#FFF'
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1C2E4A', 
    textAlign: 'center',
  },
  iconButton: { padding: 5 },

  gradientContainer: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -3 },
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },

  // --- Toggle (Abas) ---
  toggleContainer: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 30, borderWidth: 1, borderColor: '#A5C0DF',
    width: '90%', height: 50, marginBottom: 40, elevation: 5, shadowColor: '#000',
    shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, overflow: 'hidden'
  },
  toggleBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 30 },
  toggleBtnActive: { backgroundColor: '#8BAEE0' },
  toggleText: { fontSize: 15, fontWeight: 'bold', color: '#1C2E4A' },
  toggleTextActive: { color: '#1C2E4A' },

  // ==========================================
  // ESTILOS DA ABA: ADICIONAR
  // ==========================================
  listContainer: { width: '100%', paddingHorizontal: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1.5, borderBottomColor: '#2B4C9B', marginBottom: 10 },
  subjectText: { fontSize: 14, fontWeight: 'bold', color: '#1C2E4A', flex: 1 },
  
  counterContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EBF3FA', borderRadius: 20, paddingHorizontal: 5, paddingVertical: 4, borderWidth: 1, borderColor: '#A5C0DF', elevation: 2 },
  counterBtn: { paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' },
  counterSymbol: { fontSize: 16, fontWeight: 'bold', color: '#1C2E4A' },
  counterValueBox: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 2, borderRadius: 10, borderWidth: 0.5, borderColor: '#A5C0DF' },
  counterValue: { fontSize: 14, fontWeight: 'bold', color: '#1C2E4A' },
  
  btnSalvar: { backgroundColor: '#1B3668', paddingVertical: 12, paddingHorizontal: 50, borderRadius: 15, marginTop: 60, elevation: 5 },
  btnSalvarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  // ==========================================
  // ESTILOS DA ABA: VISUALIZAR
  // ==========================================
  tableContainer: {
    backgroundColor: '#FFF', width: '100%', borderRadius: 15, overflow: 'hidden', marginBottom: 25,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
  },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1C2E4A', paddingVertical: 12 },
  tableHeaderText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#A5C0DF' },
  tableCell: { borderRightWidth: 1, borderRightColor: '#A5C0DF', justifyContent: 'center', alignItems: 'center', paddingVertical: 12 },
  cellText: { fontWeight: 'bold', fontSize: 11, color: '#1C2E4A', textAlign: 'center' },

  legendContainer: {
    backgroundColor: '#FFF', width: '100%', borderRadius: 15, padding: 15, marginBottom: 10,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
  },
  legendTitle: { color: '#2B4C9B', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 5 },
  separator: { height: 1, backgroundColor: '#2B4C9B', marginBottom: 10, opacity: 0.5 },
  legendColumns: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, paddingHorizontal: 5 },
  legendText: { fontSize: 11, color: '#333', fontWeight: '500', marginBottom: 4 }
});