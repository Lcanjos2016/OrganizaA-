import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { userApi, activityApi, disciplineApi } from '../services/api';

<<<<<<< HEAD
export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [atividadesHoje, setAtividadesHoje] = useState([]);
  const [totalFaltas, setTotalFaltas] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const [prefs, user, atividades, disciplinas] = await Promise.all([
            userApi.preferences().catch(() => null),
            userApi.me().catch(() => null),
            activityApi.list().catch(() => []),
            disciplineApi.list().catch(() => []),
          ]);
          const dados = {
            ...(prefs?.dados || {}),
            curso: user?.curso || prefs?.dados?.curso || '',
            nome: user?.nome_usuario || 'estudante',
          };
          setUserData(dados);
          setAtividadesHoje(atividades.slice(0, 3));
          setTotalFaltas(disciplinas.reduce((soma, item) => soma + (item.faltas || 0), 0));
          await AsyncStorage.setItem('@user_prefs', JSON.stringify(dados));
        } catch (e) {
          console.log("Erro ao carregar dados:", e);
        }
      };
      loadData();
    }, [])
  );

  return (
    // O Gradiente agora cobre a tela inteira por trás de tudo
    <LinearGradient colors={['#E0EAFC', '#8ea9e1']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true} // Dá aquele efeito elástico nativo ao puxar nas bordas
        >
          {/* Cabeçalho de boas-vindas */}
          <View style={styles.headerContainer}>
            <Text style={styles.greeting}>Olá, {userData?.nome || 'estudante'}!</Text>
            {userData?.curso ? (
              <Text style={styles.courseSubtitle}>Curso: {userData.curso}</Text>
            ) : null}
          </View>
=======
export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState({});
  const [perfil, setPerfil] = useState({});
  const [disciplinas, setDisciplinas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [mediaGeral, setMediaGeral] = useState(0);
  const [presenca, setPresenca] = useState(100);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    try {
      const prefs = await AsyncStorage.getItem('@user_prefs');
      const perfilStorage = await AsyncStorage.getItem('@storage_user_data');
      const disciplinasStorage = await AsyncStorage.getItem('@storage_disciplinas');
      const atividadesStorage = await AsyncStorage.getItem('@storage_atividades');
      const faltasStorage = await AsyncStorage.getItem('@storage_faltas');
      const notasStorage = await AsyncStorage.getItem('@storage_notas_progresso');
>>>>>>> abdab57 (Front Finalizado)

      const dadosPerfil = perfilStorage ? JSON.parse(perfilStorage) : {};
      
      setUserData(prefs ? JSON.parse(prefs) : {});
      setPerfil(dadosPerfil);
      setDisciplinas(disciplinasStorage ? JSON.parse(disciplinasStorage) : []);
      setAtividades(atividadesStorage ? JSON.parse(atividadesStorage) : []);

      const listaNotas = notasStorage ? JSON.parse(notasStorage) : [];
      if (listaNotas.length > 0) {
        const soma = listaNotas.reduce((acc, item) => acc + Number(item.media || 0), 0);
        setMediaGeral((soma / listaNotas.length).toFixed(1));
      }

      const listaFaltas = faltasStorage ? JSON.parse(faltasStorage) : [];
      const totalFaltas = listaFaltas.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
      const aulasEstimadas = (disciplinasStorage ? JSON.parse(disciplinasStorage).length : 0) * 60 || 240;
      setPresenca(Math.max(0, ((aulasEstimadas - totalFaltas) / aulasEstimadas) * 100).toFixed(0));
    } catch (error) {
      console.error(error);
    }
  };

  const atividadesPendentes = atividades.filter(item => item.status !== 'concluida' && item.feita !== true);

  return (
    <View style={styles.container}>
      {/* HEADER COM DEGRADÊ */}
      <LinearGradient 
        colors={['#4A69BD', '#9DBCE0']} 
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            {/* Foto à esquerda */}
            <View style={styles.avatarContainer}>
              {perfil.foto ? (
                <Image source={{ uri: perfil.foto }} style={styles.avatarImage} />
              ) : (
                <MaterialCommunityIcons name="account" size={40} color="#FFF" />
              )}
            </View>
            
            {/* Nome e Curso à direita */}
            <View style={styles.infoContainer}>
              <Text style={styles.nome}>Olá, {perfil.nome || 'Sabrina'}</Text>
              <Text style={styles.curso}>{userData.curso || 'Curso não informado'}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* CARD PRINCIPAL */}
        <View style={styles.mainCard}>
          <Text style={styles.mainCardTitle}>Resumo Acadêmico</Text>
          <View style={styles.resumoRow}>
            <View style={styles.miniCard}>
              <Text style={styles.numero}>{mediaGeral}</Text>
              <Text style={styles.label}>Média_Notas</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.numero}>{presenca}%</Text>
              <Text style={styles.label}>Presença</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.numero}>{disciplinas.length}</Text>
              <Text style={styles.label}>Disciplinas</Text>
            </View>
          </View>
        </View>

        {/* ACESSO RÁPIDO */}
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('DisciplinaAtividade')}>
            <Feather name="book" size={28} color="#4A69BD" />
            <Text style={styles.gridText}>Disciplinas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('MainHome', { screen: 'ProgressoTab' })}>
            <Feather name="bar-chart-2" size={28} color="#4A69BD" />
            <Text style={styles.gridText}>Progresso</Text>
          </TouchableOpacity>
        </View>

        {/* PRÓXIMAS ATIVIDADES */}
        <Text style={styles.sectionTitle}>Próximas Atividades</Text>
        <View style={styles.listaCard}>
          {atividadesPendentes.length === 0 ? (
            <Text style={styles.vazio}>Nenhuma atividade pendente</Text>
          ) : (
            atividadesPendentes.slice(0, 5).map(item => (
              <View key={item.id} style={styles.atividade}>
                <View style={styles.bolinha} />
                <View>
                  <Text style={styles.atividadeNome}>{item.nome}</Text>
                  <Text style={styles.atividadeData}>{item.data}</Text>
                </View>
              </View>
<<<<<<< HEAD
              <Text style={styles.subText}>Você está com {totalFaltas} faltas.</Text>
            </View>
          )}

          {/* Card de Atividades */}
          <View style={styles.whiteCard}>
            <Text style={styles.cardTitleBlue}>Próximas atividades para hoje</Text>
            <View style={styles.activityList}>
              {atividadesHoje.length > 0 ? (
                atividadesHoje.map((atividade) => (
                  <Text key={atividade.id} style={styles.activityItem}>
                    {atividade.nome} - {atividade.disciplina || 'Sem disciplina'}
                  </Text>
                ))
              ) : (
                <Text style={styles.activityItem}>Nenhuma atividade cadastrada.</Text>
              )}
            </View>
          </View>

          {/* Caixa de Mensagem Motivacional do Assistente */}
          <View style={styles.msgBox}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons 
                name={userData?.avatar === 'book' ? "book-open-variant" : "robot"} 
                size={28} 
                color="#5D5FEF" 
              />
            </View>
            <Text style={styles.msgText}>Para de faltar cara e estude mais heim!!!</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
=======
            ))
          )}
        </View>
      </ScrollView>
    </View>
>>>>>>> abdab57 (Front Finalizado)
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ebeff1' },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#35559B',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  infoContainer: {
    marginLeft: 15,
    flex: 1,
  },
<<<<<<< HEAD
  progressText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subText: { marginTop: 15, fontSize: 14, color: '#666', fontWeight: '500' },
  cardTitleBlue: { color: '#3f5efb', fontWeight: 'bold', fontSize: 16, marginBottom: 15, textAlign: 'center' },
  activityList: { width: '100%', paddingHorizontal: 5 },
  activityItem: { fontSize: 14, fontWeight: '600', color: '#444', marginVertical: 6 },
  msgBox: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    padding: 12, 
    borderRadius: 25, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(93, 95, 239, 0.3)',
    elevation: 2,
    marginTop: 5
  },
  avatarCircle: { 
    backgroundColor: '#E0EAFC', 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#5D5FEF' 
  },
  msgText: { flex: 1, marginLeft: 12, fontWeight: 'bold', color: '#1a237e', fontSize: 13, lineHeight: 18 }
});
=======
  nome: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  curso: { color: '#E8EEF8', fontSize: 13, marginTop: 2 },
  scrollContent: { paddingBottom: 40 },
  mainCard: { backgroundColor: '#FFF', margin: 20, borderRadius: 25, padding: 20, elevation: 5 },
  mainCardTitle: { fontWeight: 'bold', color: '#1C2E4A', marginBottom: 15 },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  miniCard: { alignItems: 'center' },
  numero: { fontSize: 24, fontWeight: 'bold', color: '#4A69BD' },
  label: { color: '#666' },
  sectionTitle: { marginHorizontal: 20, marginBottom: 10, fontWeight: 'bold', fontSize: 18, color: '#1C2E4A' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 20, justifyContent: 'space-between' },
  gridCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 12 },
  gridText: { marginTop: 8, fontWeight: 'bold', color: '#1C2E4A' },
  listaCard: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20, padding: 15 },
  atividade: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bolinha: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4A69BD', marginRight: 12 },
  atividadeNome: { fontWeight: 'bold', color: '#1C2E4A' },
  atividadeData: { color: '#777', fontSize: 12 },
  vazio: { textAlign: 'center', color: '#777' }
});
>>>>>>> abdab57 (Front Finalizado)
