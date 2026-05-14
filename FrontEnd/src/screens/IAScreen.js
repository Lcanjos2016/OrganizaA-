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
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function IAScreen({ navigation }) {
  
  
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleSalvar = () => {
    Alert.alert("Sucesso", "Configurações da Inteligência Artificial salvas!");
    navigation.goBack(); 
  };

  return (
    <LinearGradient 
      
      colors={['#4A69BD', '#EBF3FA', '#4A69BD']} 
      style={styles.mainGradient}
    >
      <SafeAreaView style={styles.container}>
        
        {/* --- Cabeçalho --- */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <MaterialCommunityIcons name="robot-outline" size={28} color="#1C2E4A" />
            <Text style={styles.headerTitle}>Ativar/Desativar IA</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
          </TouchableOpacity>
        </View>

        {/* --- Área do Switch --- */}
        <View style={styles.content}>
          <View style={styles.switchRow}>
            <View style={styles.labelContainer}>
              <MaterialCommunityIcons name="robot-outline" size={24} color="#1C2E4A" />
              <Text style={styles.switchLabel}>Suporte da IA para{'\n'}estudos</Text>
            </View>
            
            <Switch
              trackColor={{ false: "#767577", true: "#1C2E4A" }}
              thumbColor={isEnabled ? "#FFF" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          
          {/* Linha divisória fina */}
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
    fontSize: 18, 
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
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginLeft: 15,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#8DA4C4',
    marginTop: 5,
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