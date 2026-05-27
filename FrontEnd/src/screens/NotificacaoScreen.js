import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigateGlobal } from '../navigation/NavigationService';

export default function NotificacaoScreen() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const gerarNotificacoesDinamicas = async () => {
        try {
          setLoading(true);
          
          const resAtividades = await AsyncStorage.getItem('@storage_atividades');
          const resFaltas = await AsyncStorage.getItem('@storage_faltas');
          const resNotas = await AsyncStorage.getItem('@storage_notas_progresso');

          const listaAtividades = resAtividades ? JSON.parse(resAtividades) : [];
          const listaFaltas = resFaltas ? JSON.parse(resFaltas) : [];
          const listaNotas = resNotas ? JSON.parse(resNotas) : [];

          const notificacoesGeradas = [];
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          listaAtividades.forEach((ativ, index) => {
            const isConcluida = ativ.feita === true || ativ.status === 'concluida' || ativ.concluida === true;
            if (isConcluida) return;

            const campoData = ativ.dataEntrega || ativ.data || ativ.data_entrega || ativ.prazo;
            const ehProva = ativ.tipo?.toLowerCase() === 'prova' || ativ.titulo?.toLowerCase().includes('prova');
            
            let dataLimite = null;
            if (campoData && typeof campoData === 'string') {
              if (campoData.includes('/')) {
                const partes = campoData.split('/');
                dataLimite = new Date(partes[2], partes[1] - 1, partes[0]);
              } else if (campoData.includes('-')) {
                dataLimite = new Date(campoData);
              }
            } else if (campoData) {
              dataLimite = new Date(campoData);
            }

            if (dataLimite && !isNaN(dataLimite.getTime())) {
              dataLimite.setHours(0, 0, 0, 0);
              const diferencaTempo = dataLimite.getTime() - hoje.getTime();
              const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

              if (diferencaDias >= -1 && diferencaDias <= 10) {
                let tempoTexto = 'Urgente';
                if (diferencaDias < 0) tempoTexto = 'Atrasado';
                else if (diferencaDias > 3) tempoTexto = 'Próximo';

                notificacoesGeradas.push({
                  id: `ativ_${index}_${ativ.id || index}`,
                  idOrigem: ativ.id || null,
                  tipo: ehProva ? 'prova' : 'lembrete',
                  titulo: ehProva ? '⚠️ Prova Próxima!' : '⏰ Prazo de Atividade',
                  texto: ehProva 
                    ? `A prova de ${ativ.disciplina || 'sua matéria'} é em ${diferencaDias === 0 ? 'HOJE' : `${diferencaDias} dia(s)`}.`
                    : `A atividade "${ativ.titulo || 'Sem título'}" vence em ${diferencaDias === 0 ? 'HOJE' : `${diferencaDias} dia(s)`}.`,
                  tempo: tempoTexto
                });
                return;
              }
            }
          });

          listaNotas.forEach((nota, index) => {
            if (nota.media && parseFloat(nota.media) > 0) {
              notificacoesGeradas.push({
                id: `nota_${index}`,
                idOrigem: null,
                tipo: 'nota',
                titulo: '✅ Nota Lançada',
                texto: `A média final de ${nota.disciplina ? nota.disciplina.toUpperCase() : 'uma disciplina'} foi postada: Média ${nota.media}.`,
                tempo: 'Recente'
              });
            }
          });

          listaFaltas.forEach((falta, index) => {
            const qtd = parseInt(falta.quantidade || 0);
            const nomeMateria = falta.disciplina || 'uma disciplina';

            if (qtd >= 16) {
              notificacoesGeradas.push({
                id: `falta_reprovado_${index}`,
                idOrigem: null,
                tipo: 'falta_critica',
                titulo: '❌ Reprovado por Faltas',
                texto: `Atenção extrema! Você atingiu ${qtd} faltas em ${nomeMateria}.`,
                tempo: 'Crítico'
              });
            } else if (qtd >= 12) {
              notificacoesGeradas.push({
                id: `falta_alerta_${index}`,
                idOrigem: null,
                tipo: 'falta_alerta',
                titulo: '⚠️ Risco de Reprovação',
                texto: `Cuidado! Você já acumulou ${qtd} faltas em ${nomeMateria}.`,
                tempo: 'Atenção'
              });
            } else if (qtd > 0) {
              notificacoesGeradas.push({
                id: `falta_normal_${index}`,
                idOrigem: null,
                tipo: 'falta',
                titulo: '🚨 Falta Registrada',
                texto: `Você tem ${qtd} falta(s) salvas na matéria de ${nomeMateria}.`,
                tempo: 'Atualizado'
              });
            }
          });

          setNotificacoes(notificacoesGeradas);
        } catch (error) {
          console.error("Erro ao carregar notificações:", error);
        } finally {
          setLoading(false);
        }
      };

      gerarNotificacoesDinamicas();
    }, [])
  );

  // SISTEMA DE NAVEGAÇÃO CORRIGIDO USANDO NOMES DO AppNavigator
  const lidarComNavegacao = (notificacao) => {
    switch (notificacao.tipo) {
      case 'lembrete':
      case 'prova':
        navigateGlobal('DisciplinaAtividade', { 
          focarId: notificacao.idOrigem, 
          tipoItem: notificacao.tipo 
        });
        break;

      case 'falta':
      case 'falta_alerta':
      case 'falta_critica':
        navigateGlobal('Faltas', { abaInicial: 'Visualizar' });
        break;

      case 'nota':
        navigateGlobal('Notas');
        break;

      default:
        navigateGlobal('MainHome');
        break;
    }
  };

  const removerNotificacao = (id) => {
    setNotificacoes(notificacoes.filter(n => n.id !== id));
  };

  const renderIcone = (tipo) => {
    switch (tipo) {
      case 'lembrete': return <Feather name="clock" size={20} color="#1C2E4A" />;
      case 'prova': return <MaterialCommunityIcons name="alert-octagon-outline" size={22} color="#D35400" />;
      case 'falta_critica': return <MaterialCommunityIcons name="close-octagon" size={22} color="#C0392B" />;
      case 'falta_alerta': return <MaterialCommunityIcons name="alert" size={22} color="#D35400" />;
      case 'falta': return <MaterialCommunityIcons name="calendar-remove-outline" size={22} color="#D85A8A" />;
      case 'nota': return <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={22} color="#4CAF50" />;
      default: return <MaterialCommunityIcons name="school-outline" size={22} color="#1C2E4A" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Feather name="bell" size={28} color="#1C2E4A" />
          <Text style={styles.headerTitle}>Notificações</Text>
        </View>
        <TouchableOpacity onPress={() => navigateGlobal('Login')} style={styles.iconButton}>
          <MaterialCommunityIcons name="exit-to-app" size={28} color="#1C2E4A" />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['#7895E8', '#A9C4F0', '#DCE8F5']} style={styles.mainGradient}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1C2E4A" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {notificacoes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="bell-off-outline" size={60} color="#1C2E4A" />
                <Text style={styles.emptyText}>Nenhuma pendência ou falta nova registrada.</Text>
              </View>
            ) : (
              notificacoes.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardIconWrapper}>{renderIcone(item.tipo)}</View>
                    <Text style={[
                      styles.cardTitle,
                      item.tipo === 'falta_critica' && { color: '#C0392B' },
                      item.tipo === 'falta_alerta' && { color: '#D35400' }
                    ]}>
                      {item.titulo}
                    </Text>
                    <TouchableOpacity onPress={() => removerNotificacao(item.id)}>
                      <MaterialCommunityIcons name="close-circle-outline" size={22} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardBodyText}>{item.texto}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={[
                      styles.cardTime, 
                      (item.tempo === 'Urgente' || item.tempo === 'Atrasado' || item.tempo === 'Crítico') && { color: '#E74C3C', fontWeight: 'bold' },
                      item.tempo === 'Atenção' && { color: '#D35400', fontWeight: 'bold' }
                    ]}>
                      {item.tempo}
                    </Text>
                    <TouchableOpacity style={styles.btnVerMais} onPress={() => lidarComNavegacao(item)}>
                      <Text style={styles.btnVerMaisText}>Ver no App</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, backgroundColor: '#FFF' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1C2E4A', marginLeft: 10 },
  iconButton: { padding: 5 },
  mainGradient: { flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 25, paddingHorizontal: 16 },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, paddingHorizontal: 30 },
  emptyText: { textAlign: 'center', color: '#1C2E4A', fontSize: 15, fontWeight: '600', marginTop: 10 },
  card: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, marginBottom: 14, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 8, marginBottom: 10 },
  cardIconWrapper: { width: 28, justifyContent: 'center' },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: 'bold', color: '#1C2E4A' },
  cardBodyText: { fontSize: 13, color: '#334155', marginBottom: 14, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTime: { fontSize: 12, color: '#64748B' },
  btnVerMais: { backgroundColor: '#DCE8F5', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 12 },
  btnVerMaisText: { color: '#1C2E4A', fontWeight: 'bold', fontSize: 11 }
});