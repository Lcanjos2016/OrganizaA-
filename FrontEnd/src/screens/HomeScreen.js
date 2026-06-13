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

import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { userApi, activityApi, disciplineApi } from '../services/api';

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
      const [prefs, usuario, listaDisciplinas, listaAtividades] = await Promise.all([
        userApi.preferences(),
        userApi.me(),
        disciplineApi.list(),
        activityApi.list(),
      ]);
      setUserData({ ...(prefs?.dados || {}), curso: usuario.curso || '' });
      setPerfil({
        nome: usuario.nome_usuario,
        email: usuario.email,
        foto: prefs?.dados?.foto || null,
      });
      setDisciplinas(listaDisciplinas);
      setAtividades(listaAtividades);

      const listaNotas = listaDisciplinas.filter((item) => item.notaFinal);
      if (listaNotas.length > 0) {
        const soma = listaNotas.reduce((acc, item) => acc + Number(item.notaFinal || 0), 0);
        setMediaGeral((soma / listaNotas.length).toFixed(1));
      } else {
        setMediaGeral(0);
      }

      const totalFaltas = listaDisciplinas.reduce((acc, item) => acc + Number(item.faltas || 0), 0);
      const aulasEstimadas = listaDisciplinas.length * 60 || 240;
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
              <Text style={styles.label}>Média Geral</Text>
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
            ))
          )}
        </View>
      </ScrollView>
    </View>
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
