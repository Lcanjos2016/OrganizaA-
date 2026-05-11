import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const jsonValue = await AsyncStorage.getItem('@user_prefs');
        if (jsonValue != null) setUserData(JSON.parse(jsonValue));
      };
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Superior */}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient 
          colors={['#b3c9ec', '#8ea9e1']} 
          style={styles.mainCard}
        >
          <Text style={styles.greeting}>Olá, Sabrina!</Text>

          {/* Card de Frequência */}
          <View style={styles.whiteCard}>
            <Text style={styles.cardTitle}>Frequência</Text>
            <View style={styles.chartPlaceholder}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>86%</Text>
              </View>
            </View>
            <Text style={styles.subText}>Você está com x faltas.</Text>
          </View>

          {/* Card de Atividades */}
          <View style={styles.activityCard}>
            <Text style={styles.cardTitleBlue}>Próximas atividades para hoje</Text>
            <View style={styles.activityList}>
              <Text style={styles.activityItem}>10:00 - Aula {userData?.disciplina || 'xxxxxxxx'}</Text>
              <Text style={styles.activityItem}>14:00 - Aula xxxxxxxx</Text>
              <Text style={styles.activityItem}>16:00 - Aula xxxxxxxx</Text>
            </View>
          </View>

          {/* Caixa de Mensagem Motivacional (Estilo Pílula) */}
          <View style={styles.msgBox}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons 
                name={userData?.avatar === 'book' ? "book-open-variant" : "robot"} 
                size={30} 
                color="#5D5FEF" 
              />
            </View>
            <Text style={styles.msgText}>Para de faltar cara e estude mais heim!!!</Text>
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Barra de Navegação Inferior (Visual) */}
      <View style={styles.bottomNav}>
        <Ionicons name="settings-outline" size={24} color="#333" />
        <Ionicons name="book-outline" size={24} color="#333" />
        <Ionicons name="home" size={28} color="#1a237e" />
        <Ionicons name="school-outline" size={24} color="#333" />
        <Ionicons name="notifications-outline" size={24} color="#333" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a237e' },
  scrollContent: { paddingBottom: 20 },
  mainCard: {
    margin: 15,
    borderRadius: 30,
    padding: 20,
    minHeight: 500,
  },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#1a237e', marginBottom: 20 },
  whiteCard: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    alignItems: 'center', 
    elevation: 4,
    marginBottom: 20 
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  chartPlaceholder: { marginVertical: 10 },
  progressCircle: { 
    width: 130, 
    height: 130, 
    borderRadius: 65, 
    borderWidth: 12, 
    borderColor: '#6b3fa0', // Cor roxa da imagem
    borderLeftColor: '#ddd', // Para simular o gráfico de pizza
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  progressText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subText: { marginTop: 15, fontSize: 14, color: '#333', fontWeight: '500' },
  activityCard: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    elevation: 4,
    marginBottom: 20 
  },
  cardTitleBlue: { color: '#3f5efb', fontWeight: 'bold', fontSize: 16, marginBottom: 15, textAlign: 'center' },
  activityList: { alignItems: 'flex-start', paddingLeft: 10 },
  activityItem: { fontSize: 14, fontWeight: 'bold', color: '#000', marginVertical: 3 },
  msgBox: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.4)', 
    padding: 10, 
    borderRadius: 50, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#1a237e' 
  },
  avatarCircle: { 
    backgroundColor: '#b3c9ec', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5D5FEF'
  },
  msgText: { flex: 1, marginLeft: 10, fontWeight: 'bold', color: '#1a237e', fontSize: 13 },
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderTopWidth: 1, 
    borderTopColor: '#eee' 
  }
});