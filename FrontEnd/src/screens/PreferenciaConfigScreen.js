import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { userApi, getApiErrorMessage } from '../services/api';

export default function PreferenciaConfigScreen({ navigation }) {
  const [avatar, setAvatar] = useState('robot');
  const [curso, setCurso] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [atividades, setAtividades] = useState({
    cronograma: false,
    atividades: true,
    notas: true,
    lembretes: false,
  });

  const toggleAtividade = (key) => {
    setAtividades({ ...atividades, [key]: !atividades[key] });
  };

  useEffect(() => {
    const carregar = async () => {
      try {
        const [prefs, user] = await Promise.all([
          userApi.preferences(),
          userApi.me(),
        ]);
        const dados = prefs?.dados || {};
        setAvatar(dados.avatar || user.avatar || 'robot');
        setCurso(user.curso || '');
        setDisciplina(dados.disciplina || '');
        if (dados.atividades) setAtividades(dados.atividades);
      } catch (error) {
        Alert.alert('Erro', getApiErrorMessage(error));
      }
    };
    carregar();
  }, []);

  const salvarPreferencias = async () => {
    try {
      const dados = { avatar, curso, disciplina, atividades };
      await Promise.all([
        userApi.update({ curso, avatar }),
        userApi.savePreferences({ dados }),
      ]);
      navigation.navigate('MainHome', { screen: 'HomeTab' });
    } catch (error) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
  };

  return (
    <LinearGradient colors={['#E0EAFC', '#3F5EFB']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerRow}>
            <Text style={styles.mainTitle}>Preferências</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="logout" size={28} color="#1a237e" />
            </TouchableOpacity>
          </View>

          {/* Fundo azulado unificado */}
          <View style={styles.blueCard}>
            <Text style={styles.label}>Escolha seu Avatar</Text>
            <View style={styles.avatarRow}>
              <TouchableOpacity style={[styles.avatarBox, avatar === 'robot' && styles.selectedAvatar]} onPress={() => setAvatar('robot')}>
                <MaterialCommunityIcons name="robot-confused-outline" size={50} color={avatar === 'robot' ? "#5D5FEF" : "#999"} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.avatarBox, avatar === 'book' && styles.selectedAvatar]} onPress={() => setAvatar('book')}>
                <MaterialCommunityIcons name="book-open-page-variant-outline" size={50} color={avatar === 'book' ? "#5D5FEF" : "#999"} />
              </TouchableOpacity>
              <View style={styles.avatarBox}><Ionicons name="add" size={30} color="#ccc" /></View>
            </View>

            <Text style={styles.label}>Suas Atividades</Text>
            {/* Checklist integrado sem fundo branco */}
            <View>
              <CheckItem label="Mostrar Cronograma" status={atividades.cronograma} onPress={() => toggleAtividade('cronograma')} />
              <CheckItem label="Adicionar Atividades" status={atividades.atividades} onPress={() => toggleAtividade('atividades')} />
              <CheckItem label="Adicionar Notas e Faltas" status={atividades.notas} onPress={() => toggleAtividade('notas')} />
              <CheckItem label="Lembretes" status={atividades.lembretes} onPress={() => toggleAtividade('lembretes')} />
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>Qual seu curso:</Text>
            <TextInput style={styles.input} value={curso} onChangeText={setCurso} placeholder="Digite o nome do curso" placeholderTextColor="#999" />

            <Text style={styles.label}>Cite uma disciplina:</Text>
            <TextInput style={styles.input} value={disciplina} onChangeText={setDisciplina} placeholder="Digite a disciplina" placeholderTextColor="#999" />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.footerBtn} onPress={salvarPreferencias}>
              <Text style={styles.footerBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const CheckItem = ({ label, status, onPress }) => (
  <TouchableOpacity style={styles.checkRow} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={status ? "checkmark-circle" : "ellipse-outline"} size={26} color={status ? "#7ED957" : "#fff"} />
    <Text style={styles.checkText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a237e' },
  blueCard: { backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 25, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#1a237e', marginTop: 10, marginBottom: 10 },
  avatarRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  avatarBox: { width: 85, height: 100, backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  selectedAvatar: { borderWidth: 3, borderColor: '#5D5FEF' },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  checkText: { marginLeft: 10, fontSize: 15, color: '#1a237e', fontWeight: 'bold' },
  input: { backgroundColor: '#fff', borderRadius: 15, padding: 15, elevation: 2, textAlign: 'center', color: '#1a237e', fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginBottom: 20 },
  footerBtn: { backgroundColor: '#fff', paddingVertical: 12, borderRadius: 15, elevation: 5, width: '60%', alignItems: 'center' },
  footerBtnText: { color: '#1a237e', fontWeight: 'bold', fontSize: 18 }
});
