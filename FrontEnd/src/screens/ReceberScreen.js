import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Switch,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { userApi, getApiErrorMessage } from '../services/api';

export default function ReceberScreen({ navigation }) {
  
  
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleSalvar = async () => {
    try {
      await userApi.savePreferences({ notificacoesAtivas: isEnabled });
      Alert.alert("Sucesso", "Preferência de notificação salva!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", getApiErrorMessage(error));
    }
  };

  return (
    <LinearGradient 
      
      colors={['#2B4C9B', '#9DBCE0', '#EBF3FA', '#EBF3FA']} 
      style={styles.mainGradient}
    >
      <SafeAreaView style={styles.container}>
        
        {/* --- Cabeçalho --- */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Feather name="settings" size={28} color="#1C2E4A" />
            <Text style={styles.headerTitle}>Notificações</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
          </TouchableOpacity>
        </View>

        {/* --- Área do Switch --- */}
        <View style={styles.content}>
          <View style={styles.switchRow}>
            <View style={styles.labelContainer}>
              <Feather name="bell" size={22} color="#1C2E4A" />
              <Text style={styles.switchLabel}>Receber notificações</Text>
            </View>
            
            <Switch
              trackColor={{ false: "#767577", true: "#1C2E4A" }}
              thumbColor={isEnabled ? "#FFF" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          
          {/* Linha divisória azul conforme o print */}
          <View style={styles.divider} />
        </View>

        {/* --- Botão Salvar --- */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
            <Text style={styles.btnSalvarText}>Salvar</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  mainGradient: { 
    flex: 1 
  },
  container: { 
    flex: 1 
  },
  
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: 50, 
    paddingBottom: 40 
  },
  headerTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1C2E4A', 
    marginLeft: 10 
  },
  iconButton: { 
    padding: 5 
  },

  
  content: {
    flex: 1,
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C2E4A',
    marginLeft: 12,
  },
  divider: {
    height: 2,
    backgroundColor: '#2B4C9B',
    marginTop: 10,
    width: '100%',
  },

  
  footer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  btnSalvar: {
    backgroundColor: '#1B3668',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  btnSalvarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
