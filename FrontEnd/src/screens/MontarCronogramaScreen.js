import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function MontarCronogramaScreen({ navigation }) {
  
  
  const [tableRows, setTableRows] = useState([
    { time: '08h - 10h', seg: '', ter: '1', qua: '', qui: '1', sex: '' },
    { time: '', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '', seg: '', ter: '', qua: '', qui: '', sex: '' },
    { time: '', seg: '', ter: '', qua: '', qui: '', sex: '' },
  ]);

  
  const handleInputChange = (text, rowIndex, field) => {
    const updatedRows = [...tableRows];
    updatedRows[rowIndex][field] = text;
    setTableRows(updatedRows);
  };

  
  const handleSalvar = () => Alert.alert("Sucesso", "Seu cronograma foi salvo no teste!");
  const handleEsvaziar = () => {
    const linhasLimpas = tableRows.map(row => ({
      ...row, seg: '', ter: '', qua: '', qui: '', sex: ''
    }));
    setTableRows(linhasLimpas);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back-circle-outline" size={32} color="#2B4C9B" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Montar Cronograma</Text>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.iconButton}>
          <MaterialCommunityIcons name="exit-to-app" size={28} color="#2B4C9B" />
        </TouchableOpacity>
      </View>

      {/* --- Conteúdo Principal com Gradiente --- */}
      <LinearGradient colors={['#7895E8', '#A9C4F0', '#DCE8F5']} style={styles.mainGradient}>
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
                  <TextInput style={styles.cellInput} value={row.seg} onChangeText={(text) => handleInputChange(text, index, 'seg')} keyboardType="numeric" maxLength={2} />
                </View>
                <View style={styles.tableCell}>
                  <TextInput style={styles.cellInput} value={row.ter} onChangeText={(text) => handleInputChange(text, index, 'ter')} keyboardType="numeric" maxLength={2} />
                </View>
                <View style={styles.tableCell}>
                  <TextInput style={styles.cellInput} value={row.qua} onChangeText={(text) => handleInputChange(text, index, 'qua')} keyboardType="numeric" maxLength={2} />
                </View>
                <View style={styles.tableCell}>
                  <TextInput style={styles.cellInput} value={row.qui} onChangeText={(text) => handleInputChange(text, index, 'qui')} keyboardType="numeric" maxLength={2} />
                </View>
                <View style={[styles.tableCell, { borderRightWidth: 0 }]}>
                  <TextInput style={styles.cellInput} value={row.sex} onChangeText={(text) => handleInputChange(text, index, 'sex')} keyboardType="numeric" maxLength={2} />
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
            <TouchableOpacity style={[styles.actionBtn, styles.btnEditar]}>
              <Text style={[styles.actionBtnText, { color: '#1B3668' }]}>Editar</Text>
            </TouchableOpacity>
          </View>

          {/* --- Legenda / Códigos e Disciplinas --- */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Códigos e disciplinas</Text>
            <View style={styles.separator} />
            <View style={styles.legendColumns}>
              <View style={styles.column}>
                <Text style={styles.legendText}>1 - xxxxxxxxxxxxxxx</Text>
                <Text style={styles.legendText}>2 - xxxxxxxxxxxxxxx</Text>
                <Text style={styles.legendText}>3 - xxxxxxxxxxxxxxx</Text>
                <Text style={styles.legendText}>4 - xxxxxxxxxxxxxxx</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.legendText}>5 - xxxxxxxxxxxxxxx</Text>
                <Text style={styles.legendText}>6 - xxxxxxxxxxxxxxx</Text>
                <Text style={styles.legendText}>7 - xxxxxxxxxxxxxxx</Text>
                <Text style={styles.legendText}>8 - xxxxxxxxxxxxxxx</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.helperText}>Utilize os códigos para preencher o cronograma</Text>
          
          <View style={{ flex: 1, minHeight: 40 }} />
          
        </ScrollView>

        {/* --- Barra de Pesquisa / Dicas --- */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardWrapper}>
          <View style={styles.chatInputContainer}>
            <View style={styles.chatAvatar}>
              <MaterialCommunityIcons name="robot-outline" size={24} color="#2B4C9B" />
            </View>
            <TextInput style={styles.chatInputText} placeholder="Peça suas dicas aqui" placeholderTextColor="#798C9C" />
            <TouchableOpacity><Feather name="mic" size={22} color="#2B4C9B" /></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 35, paddingBottom: 10, backgroundColor: '#FFF' },
  
  iconButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2B4C9B' },
  
  mainGradient: { flex: 1, borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingTop: 15, paddingHorizontal: 20 },
  scrollContent: { flexGrow: 1, paddingBottom: 10 },
  
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
  btnEditar: { backgroundColor: '#FFFFFF' },
  actionBtnText: { fontWeight: 'bold', fontSize: 14 },
  
  legendContainer: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 10, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  legendTitle: { color: '#2B4C9B', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 5 },
  separator: { height: 1, backgroundColor: '#2B4C9B', marginBottom: 10, opacity: 0.5 },
  legendColumns: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1 },
  legendText: { fontSize: 11, color: '#333', fontWeight: '500', marginBottom: 4 },
  helperText: { textAlign: 'center', color: '#2B4C9B', fontSize: 12, fontWeight: '500', marginBottom: 10 },
  
  keyboardWrapper: { width: '100%', paddingBottom: 35 },
  chatInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#8DA4C4', borderRadius: 30, padding: 6, paddingRight: 15, backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  chatAvatar: { width: 44, height: 44, backgroundColor: '#A5C0DF', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  chatInputText: { flex: 1, paddingVertical: 10, color: '#2B4C9B', fontSize: 15, fontWeight: '500' }
});