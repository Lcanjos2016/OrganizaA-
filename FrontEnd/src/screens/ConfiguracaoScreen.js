import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, userApi } from '../services/api';

export default function ConfiguracoesScreen({ navigation }) {
  const [userData, setUserData] = useState({ nome: 'Usuário', email: 'seuemail@exemplo.com' });

  // Carrega os dados sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        try {
          const user = await userApi.me();
          if (user) {
            const dados = {
              nome: user.nome_usuario,
              email: user.email,
              instituicao: user.instituicao || 'UFAM',
            };
            setUserData(dados);
            await AsyncStorage.setItem('@storage_user_data', JSON.stringify(dados));
          }
        } catch (e) {
          console.error("Erro ao carregar dados do usuário", e);
        }
      };
      carregarDados();
    }, [])
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={['#4A69BD', '#9DBCE0', '#EBF3FA', '#FFFFFF']} 
        style={styles.mainGradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Feather name="settings" size={28} color="#1C2E4A" />
              <Text style={styles.headerTitle}>Configurações</Text>
            </View>
            <TouchableOpacity onPress={async () => { await authApi.logout(); navigation.navigate('Login'); }} style={styles.iconButton}>
              <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={35} color="#6A7A8C" />
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData.nome}</Text>
                <Text style={styles.profileEmail}>{userData.email}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.btnEditar} 
                onPress={() => navigation.navigate('EditarPerfil')}
              >
                <Text style={styles.btnEditarText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ... restante do seu código (Cartão de Instituição e Lista) permanece igual ... */}
          <View style={styles.card}>
            <View style={styles.instRow}>
              <MaterialCommunityIcons name="school-outline" size={26} color="#1C2E4A" />
              <Text style={styles.instText}>Instituição</Text>
              <TouchableOpacity style={styles.dropdownBtn}>
                <Text style={styles.dropdownText}>{userData.instituicao || 'UFAM'}</Text>
                <Feather name="chevron-down" size={18} color="#1C2E4A" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.listCard}>
            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Receber')}>
              <View style={styles.listItemLeft}>
                <MaterialCommunityIcons name="bell-cog-outline" size={24} color="#1C2E4A" />
                <Text style={styles.listItemText}>Notificações</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#1C2E4A" />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('PreferenciaConfig')}>
              <View style={styles.listItemLeft}>
                <Feather name="sliders" size={22} color="#1C2E4A" />
                <Text style={styles.listItemText}>Preferências</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#1C2E4A" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('IA')}>
              <View style={styles.listItemLeft}>
                <MaterialCommunityIcons name="robot-outline" size={24} color="#1C2E4A" />
                <Text style={styles.listItemText}>Ativar/Desativar IA</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#1C2E4A" />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // MANTIVE O SEU ESTILO ORIGINAL INTACTO
  container: { flex: 1, backgroundColor: '#FFF' },
  mainGradient: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 50, paddingBottom: 25 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 10 },
  iconButton: { padding: 5 },
  card: { backgroundColor: 'rgba(165, 192, 223, 0.6)', marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatarContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#BDC3C7', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1C2E4A' },
  profileEmail: { fontSize: 12, color: '#4A5B6D', marginTop: 2 },
  btnEditar: { backgroundColor: '#FFF', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15, elevation: 3 },
  btnEditarText: { color: '#1C2E4A', fontWeight: 'bold', fontSize: 13 },
  instRow: { flexDirection: 'row', alignItems: 'center' },
  instText: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 15 },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8BAEE0', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15 },
  dropdownText: { fontSize: 14, fontWeight: 'bold', color: '#1C2E4A', marginRight: 5 },
  listCard: { backgroundColor: 'rgba(165, 192, 223, 0.6)', marginHorizontal: 20, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 30, elevation: 2 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  listItemLeft: { flexDirection: 'row', alignItems: 'center' },
  listItemText: { fontSize: 16, fontWeight: 'bold', color: '#4A5B6D', marginLeft: 15 },
  divider: { height: 1, backgroundColor: '#8DA4C4', opacity: 0.5 }
});
