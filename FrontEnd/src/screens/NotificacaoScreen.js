import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export default function NotificacoesScreen({ navigation }) {
  
  // Estado com a lista de notificações
  const [notificacoes, setNotificacoes] = useState([
    { 
      id: '1', 
      tipo: 'lembrete', 
      titulo: 'Lembrete de Atividade', 
      texto: 'Entregar atividade x às 23:59', 
      tempo: 'Há 5 minutos' 
    },
    { 
      id: '2', 
      tipo: 'nota', 
      titulo: 'Nota Lançada', 
      texto: 'Sua nota de xxxxxxxxxxxxx foi postada.', 
      tempo: 'Há 1 hora' 
    },
    { 
      id: '3', 
      tipo: 'falta', 
      titulo: 'Falta registrada', 
      texto: 'Você teve 1 falta registrada em xxxxxxxxxx.', 
      tempo: 'Há 3 hora' 
    },
  ]);

  // Função para remover uma notificação quando clica no botão vermelho
  const removerNotificacao = (id) => {
    setNotificacoes(notificacoes.filter(notificacao => notificacao.id !== id));
  };

  // Função para renderizar o ícone correto dependendo do tipo da notificação
  const renderIcone = (tipo) => {
    if (tipo === 'lembrete') {
      return <Feather name="clock" size={20} color="#1C2E4A" />;
    }
    return <MaterialCommunityIcons name="school-outline" size={24} color="#1C2E4A" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- Cabeçalho --- */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Feather name="bell" size={28} color="#1C2E4A" />
          <Text style={styles.headerTitle}>Notificações</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.iconButton}>
          <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
        </TouchableOpacity>
      </View>

      {/* --- Conteúdo Principal com Gradiente --- */}
      <LinearGradient 
        colors={['#4A69BD', '#9DBCE0', '#EBF3FA']} 
        style={styles.mainGradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {notificacoes.length === 0 ? (
            <Text style={styles.emptyText}>Você não tem novas notificações.</Text>
          ) : (
            notificacoes.map((item) => (
              <View key={item.id} style={styles.card}>
                
                {/* Linha Superior: Ícone, Título e Botão Excluir */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconWrapper}>
                    {renderIcone(item.tipo)}
                  </View>
                  <Text style={styles.cardTitle}>{item.titulo}</Text>
                  <TouchableOpacity onPress={() => removerNotificacao(item.id)}>
                    <MaterialCommunityIcons name="minus-circle" size={24} color="#D35400" />
                  </TouchableOpacity>
                </View>

                {/* Texto Principal da Notificação */}
                <Text style={styles.cardBodyText}>{item.texto}</Text>

                {/* Linha Inferior: Tempo e Botão 'Ver mais' */}
                <View style={styles.cardFooter}>
                  <Text style={styles.cardTime}>{item.tempo}</Text>
                  <TouchableOpacity style={styles.btnVerMais}>
                    <Text style={styles.btnVerMaisText}>Ver mais</Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            ))
          )}

        </ScrollView>
      </LinearGradient>

      {/* --- Menu de Navegação Inferior --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Feather name="settings" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        
        <TouchableOpacity>
          <MaterialCommunityIcons name="devices" size={26} color="#6A7A8C" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('AreaEstudo')}>
          <Feather name="home" size={28} color="#6A7A8C" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Progresso')}>
          <MaterialCommunityIcons name="school-outline" size={30} color="#6A7A8C" />
        </TouchableOpacity>
        
        {/* Sino de Notificações (Ativo: Azul Escuro) */}
        <TouchableOpacity onPress={() => navigation.navigate('Notificacoes')}>
          <Feather name="bell" size={26} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, backgroundColor: '#FFF' 
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 10 },
  iconButton: { padding: 5 },

  mainGradient: { 
    flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, 
    paddingTop: 30, paddingHorizontal: 20 
  },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },

  emptyText: { textAlign: 'center', color: '#FFF', fontSize: 16, marginTop: 40, fontWeight: 'bold' },

  // --- Cartões de Notificação ---
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#A5C0DF',
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardIconWrapper: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B4C9B',
  },
  cardBodyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
  },
  cardTime: {
    fontSize: 12,
    color: '#8CA1B9',
    fontWeight: '600',
  },
  btnVerMais: {
    backgroundColor: '#A5C0DF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  btnVerMaisText: {
    color: '#1C2E4A',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // --- Menu Inferior ---
  bottomNav: { 
    position: 'absolute', bottom: 0, width: '100%',
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    paddingTop: 15, paddingBottom: 35, backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: '#EEE',
    elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: -3 }
  }
});