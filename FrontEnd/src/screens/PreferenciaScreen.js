import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PreferenciaScreen({ navigation }) {
  const [avatar, setAvatar] = useState('robot');
  const [curso, setCurso] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [atividades, setAtividades] = useState({
    cronograma: false,
    atividades: true,
    notas: true,
    lembretes: false,
  });

  useEffect(() => {
    const carregarPreferenciasAtuais = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user_prefs');
        if (jsonValue != null) {
          const dados = JSON.parse(jsonValue);
          setAvatar(dados.avatar || 'robot');
          setCurso(dados.curso || '');
          setDisciplina(dados.disciplina || '');
          if (dados.atividades) setAtividades(dados.atividades);
        }
      } catch (error) {
        console.log("Erro ao carregar preferências antigas:", error);
      }
    };
    carregarPreferenciasAtuais();
  }, []);

  const toggleAtividade = (key) => {
    setAtividades({ ...atividades, [key]: !atividades[key] });
  };

  const salvarPreferencias = async () => {
    try {
      const dados = { avatar, curso, disciplina, atividades };
      await AsyncStorage.setItem('@user_prefs', JSON.stringify(dados));
      
      console.log('Dados salvos com sucesso:', dados);
      navigation.navigate('MainHome', { screen: 'HomeTab' });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar suas preferências.");
    }
  };

  return (
    <LinearGradient colors={['#E0EAFC', '#3F5EFB']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* KeyboardAvoidingView envolve o conteúdo para ajustar o layout dinamicamente */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled" // Permite clicar nos botões mesmo com o teclado aberto
          >
            
            <View style={styles.headerRow}>
              <Text style={styles.mainTitle}>Preferências</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="logout" size={28} color="#1a237e" />
              </TouchableOpacity>
            </View>

            <View style={styles.blueCard}>
              <Text style={styles.label}>Escolha seu Avatar</Text>
              <View style={styles.avatarRow}>
                <TouchableOpacity 
                  style={[styles.avatarBox, avatar === 'robot' && styles.selectedAvatar]} 
                  onPress={() => setAvatar('robot')}
                >
                  <MaterialCommunityIcons 
                    name="robot-confused-outline" 
                    size={50} 
                    color={avatar === 'robot' ? "#5D5FEF" : "#999"} 
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.avatarBox, avatar === 'book' && styles.selectedAvatar]} 
                  onPress={() => setAvatar('book')}
                >
                  <MaterialCommunityIcons 
                    name="book-open-page-variant-outline" 
                    size={50} 
                    color={avatar === 'book' ? "#5D5FEF" : "#999"} 
                  />
                </TouchableOpacity>

                <View style={styles.avatarBox}>
                   <Ionicons name="add" size={30} color="#ccc" />
                </View>
              </View>

              <Text style={styles.label}>Suas Atividades</Text>
              <View style={styles.checklistCard}>
                <CheckItem label="Mostrar Cronograma" status={atividades.cronograma} onPress={() => toggleAtividade('cronograma')} />
                <CheckItem label="Adicionar Atividades" status={atividades.atividades} onPress={() => toggleAtividade('atividades')} />
                <CheckItem label="Adicionar Notas e Faltas" status={atividades.notas} onPress={() => toggleAtividade('notas')} />
                <CheckItem label="Lembretes" status={atividades.lembretes} onPress={() => toggleAtividade('lembretes')} />
              </View>

              <Text style={[styles.label, { marginTop: 40 }]}>Qual seu curso:</Text>
              <TextInput 
                style={styles.input} 
                value={curso} 
                onChangeText={setCurso} 
                placeholder="Digite o nome do curso aqui"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Cite uma disciplina do curso:</Text>
              <TextInput 
                style={styles.input} 
                value={disciplina} 
                onChangeText={setDisciplina} 
                placeholder="Digite o nome da disciplina aqui"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.footerBtn} onPress={salvarPreferencias}>
                <Text style={styles.footerBtnText}>Salvar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.navigate('MainHome', { screen: 'HomeTab' })}>
                <Text style={styles.footerBtnText}>Pular</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const CheckItem = ({ label, status, onPress }) => (
  <TouchableOpacity style={styles.checkRow} onPress={onPress} activeOpacity={0.7}>
    <Ionicons 
      name={status ? "checkmark-circle" : "ellipse-outline"} 
      size={26} 
      color={status ? "#7ED957" : "#ccc"} 
    />
    <Text style={styles.checkText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 }, // Adicionado um fôlego extra no final da rolagem
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a237e' },
  blueCard: { backgroundColor: 'rgba(179, 201, 236, 0.8)', borderRadius: 25, padding: 20, elevation: 8 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 15, marginBottom: 10, textAlign: 'center' },
  avatarRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  avatarBox: { width: 85, height: 100, backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  selectedAvatar: { borderWidth: 3, borderColor: '#5D5FEF' },
  checklistCard: { backgroundColor: '#fff', borderRadius: 20, padding: 15, elevation: 3 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  checkText: { marginLeft: 10, fontSize: 15, color: '#333', fontWeight: '500' },
  input: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginTop: 5, marginBottom: 10, elevation: 2, textAlign: 'center', color: '#1a237e', fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 20 },
  footerBtn: { backgroundColor: '#fff', paddingVertical: 12, borderRadius: 15, elevation: 5, width: '45%', alignItems: 'center' },
  footerBtnText: { color: '#1a237e', fontWeight: 'bold', fontSize: 18 }
});