import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { userApi, activityApi, disciplineApi } from '../services/api';

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

          {/* Card de Frequência */}
          {userData?.atividades?.notas !== false && (
            <View style={styles.whiteCard}>
              <Text style={styles.cardTitle}>Frequência</Text>
              <View style={styles.chartPlaceholder}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressText}>86%</Text>
                </View>
              </View>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 20,
    paddingBottom: 40 // Garante um respiro no final da tela para o último card não sumir atrás da TabBar
  },
  headerContainer: {
    marginBottom: 25,
    paddingHorizontal: 5
  },
  greeting: { fontSize: 26, fontWeight: 'bold', color: '#1a237e' },
  courseSubtitle: { fontSize: 15, color: '#1a237e', fontWeight: '600', marginTop: 4, opacity: 0.8 },
  whiteCard: { 
    backgroundColor: '#fff', 
    borderRadius: 22, 
    padding: 20, 
    alignItems: 'center', 
    elevation: 4, 
    shadowColor: '#000', // Sombra suave para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20 
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  chartPlaceholder: { marginVertical: 5 },
  progressCircle: { 
    width: 130, 
    height: 130, 
    borderRadius: 65, 
    borderWidth: 12, 
    borderColor: '#3F5EFB', 
    borderLeftColor: '#E0EAFC', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
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
