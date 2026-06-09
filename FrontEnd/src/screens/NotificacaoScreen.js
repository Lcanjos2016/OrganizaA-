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

import {
  MaterialCommunityIcons,
  Feather
} from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';

import { navigateGlobal } from '../navigation/NavigationService';
import { activityApi, disciplineApi, notificationApi } from '../services/api';

export default function NotificacaoScreen() {

  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {

      const carregarNotificacoes = async () => {

        try {

          setLoading(true);

          // =========================
          // STORAGE
          // =========================

          const [
            listaAtividades,
            disciplinas,
            notificacoesRemovidas,
          ] = await Promise.all([
            activityApi.list(),
            disciplineApi.list(),
            notificationApi.dismissed(),
          ]);

          // =========================
          // CONVERSÃO
          // =========================

          const listaFaltas =
            disciplinas.map(item => ({
              id: item.id,
              disciplina: item.nome,
              quantidade: item.faltas || 0,
            }));

          const listaNotas =
            disciplinas
              .filter(item => item.notaFinal !== '')
              .map(item => ({
                id: item.id,
                disciplina: item.nome,
                media: item.notaFinal,
              }));

          const notificacoesGeradas = [];

          console.log(
            'ATIVIDADES:',
            listaAtividades
          );

          console.log(
            'NOTAS:',
            listaNotas
          );

          console.log(
            'FALTAS:',
            listaFaltas
          );

          // =========================
          // DATA
          // =========================

          const hoje = new Date();

          hoje.setHours(0, 0, 0, 0);

          // =========================
          // ATIVIDADES
          // =========================

          if (
            Array.isArray(listaAtividades)
          ) {

            listaAtividades.forEach(
              (ativ, index) => {

                const concluida =
                  ativ.feita === true ||
                  ativ.status ===
                    'concluida' ||
                  ativ.concluida ===
                    true;

                const ehProva =
                  ativ.tipo
                    ?.toLowerCase()
                    ?.includes(
                      'prova'
                    ) ||
                  ativ.nome
                    ?.toLowerCase()
                    ?.includes(
                      'prova'
                    ) ||
                  ativ.titulo
                    ?.toLowerCase()
                    ?.includes(
                      'prova'
                    );

                const tituloAtividade =
                  ativ.nome ||
                  ativ.titulo ||
                  'Sem título';

                const campoData =
                  ativ.dataEntrega ||
                  ativ.data ||
                  ativ.prazo;

                let diferencaDias =
                  null;

                if (campoData) {

                  let dataLimite;

                  if (
                    typeof campoData ===
                    'string'
                  ) {

                    if (
                      campoData.includes(
                        '/'
                      )
                    ) {

                      const partes =
                        campoData.split(
                          '/'
                        );

                      dataLimite =
                        new Date(
                          Number(
                            partes[2]
                          ),
                          Number(
                            partes[1]
                          ) - 1,
                          Number(
                            partes[0]
                          )
                        );

                    } else {

                      dataLimite =
                        new Date(
                          campoData
                        );

                    }

                  } else {

                    dataLimite =
                      new Date(
                        campoData
                      );

                  }

                  if (
                    !isNaN(
                      dataLimite.getTime()
                    )
                  ) {

                    dataLimite.setHours(
                      0,
                      0,
                      0,
                      0
                    );

                    const diferencaTempo =
                      dataLimite.getTime() -
                      hoje.getTime();

                    diferencaDias =
                      Math.ceil(
                        diferencaTempo /
                          (
                            1000 *
                            60 *
                            60 *
                            24
                          )
                      );

                  }

                }

                let texto = '';
                let tempo =
                  'Atualizado';

                if (concluida) {

                  texto =
                    `A atividade "${tituloAtividade}" foi concluída.`;

                  tempo =
                    'Concluído';

                } else {

                  if (
                    diferencaDias !==
                    null
                  ) {

                    if (
                      diferencaDias < 0
                    ) {

                      tempo =
                        'Atrasado';

                    } else if (
                      diferencaDias <=
                      3
                    ) {

                      tempo =
                        'Urgente';

                    } else {

                      tempo =
                        'Próximo';

                    }

                    texto = ehProva
                      ? `A prova de ${
                          ativ.disciplina ||
                          'sua matéria'
                        } acontece em ${
                          diferencaDias ===
                          0
                            ? 'HOJE'
                            : `${diferencaDias} dia(s)`
                        }.`
                      : `A atividade "${tituloAtividade}" vence em ${
                          diferencaDias ===
                          0
                            ? 'HOJE'
                            : `${diferencaDias} dia(s)`
                        }.`;

                  } else {

                    texto =
                      `A atividade "${tituloAtividade}" está pendente.`;

                  }

                }

                notificacoesGeradas.push(
                  {

                    id:
                      'ativ_' +
                      (
                        ativ.id ||
                        index
                      ),

                    tipo:
                      ehProva
                        ? 'prova'
                        : concluida
                          ? 'atividade_concluida'
                          : 'lembrete',

                    titulo:
                      ehProva
                        ? '⚠️ Prova Próxima!'
                        : concluida
                          ? '✅ Atividade Concluída'
                          : '⏰ Atividade Pendente',

                    texto,

                    tempo

                  }
                );

              }
            );

          }

          // =========================
          // NOTAS
          // =========================

          if (
            Array.isArray(listaNotas)
          ) {

            listaNotas.forEach(
              (nota, index) => {

                const disciplina =
                  nota.disciplina ||
                  nota.nome ||
                  nota.materia ||
                  'Disciplina';

                const media =
                  Number(
                    nota.media ??
                    nota.nota ??
                    nota.valor ??
                    0
                  );

                let situacao = '';

                if (media >= 7) {

                  situacao =
                    'Aprovado';

                } else if (
                  media >= 5
                ) {

                  situacao =
                    'Recuperação';

                } else {

                  situacao =
                    'Reprovado';

                }

                notificacoesGeradas.push(
                  {

                    id:
                      'nota_' +
                      (
                        nota.id ||
                        index
                      ),

                    tipo: 'nota',

                    titulo:
                      '📘 Situação de Nota',

                    texto:
                      `${disciplina.toUpperCase()} está com média ${media} (${situacao}).`,

                    tempo:
                      'Atualizado'

                  }
                );

              }
            );

          }

          // =========================
          // FALTAS
          // =========================

          if (
            Array.isArray(listaFaltas)
          ) {

            listaFaltas.forEach(
              (falta, index) => {

                const qtd =
                  parseInt(
                    falta.quantidade ??
                    falta.faltas ??
                    falta.total ??
                    0
                  );

                const nomeMateria =
                  falta.disciplina ||
                  falta.nome ||
                  falta.materia ||
                  'Disciplina';

                if (qtd >= 16) {

                  notificacoesGeradas.push(
                    {

                      id:
                        'falta_critica_' +
                        index,

                      tipo:
                        'falta_critica',

                      titulo:
                        '❌ Reprovado por Faltas',

                      texto:
                        `Você atingiu ${qtd} faltas em ${nomeMateria}.`,

                      tempo:
                        'Crítico'

                    }
                  );

                } else if (
                  qtd >= 12
                ) {

                  notificacoesGeradas.push(
                    {

                      id:
                        'falta_alerta_' +
                        index,

                      tipo:
                        'falta_alerta',

                      titulo:
                        '⚠️ Risco de Reprovação',

                      texto:
                        `Você possui ${qtd} faltas em ${nomeMateria}.`,

                      tempo:
                        'Atenção'

                    }
                  );

                } else {

                  notificacoesGeradas.push(
                    {

                      id:
                        'falta_' +
                        index,

                      tipo:
                        'falta',

                      titulo:
                        '🚨 Falta Registrada',

                      texto:
                        `Você possui ${qtd} falta(s) em ${nomeMateria}.`,

                      tempo:
                        'Atualizado'

                    }
                  );

                }

              }
            );

          }

          // =========================
          // REMOVE APAGADAS
          // =========================

          const listaFinal =
            notificacoesGeradas.filter(
              notif =>
                !notificacoesRemovidas.includes(
                  notif.id
                )
            );

          setNotificacoes(
            listaFinal
          );

        } catch (error) {

          console.log(
            'ERRO:',
            error
          );

        } finally {

          setLoading(false);

        }

      };

      carregarNotificacoes();

    }, [])
  );

  // =========================
  // NAVEGAÇÃO
  // =========================

  const lidarComNavegacao =
    notificacao => {

      switch (
        notificacao.tipo
      ) {

        case 'lembrete':
        case 'prova':
        case 'atividade_concluida':

          navigateGlobal(
            'DisciplinaAtividade'
          );

          break;

        case 'falta':
        case 'falta_alerta':
        case 'falta_critica':

          navigateGlobal(
            'Faltas'
          );

          break;

        case 'nota':

          navigateGlobal(
            'Notas'
          );

          break;

        default:

          navigateGlobal(
            'MainHome'
          );

          break;

      }

    };

  // =========================
  // REMOVER
  // =========================

  const removerNotificacao =
    async id => {

      try {

        await notificationApi.dismiss(
          String(id)
        );

        setNotificacoes(
          prev =>
            prev.filter(
              item =>
                item.id !== id
            )
        );

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // ÍCONES
  // =========================

  const renderIcone =
    tipo => {

      switch (tipo) {

        case 'lembrete':

          return (
            <Feather
              name="clock"
              size={20}
              color="#1C2E4A"
            />
          );

        case 'atividade_concluida':

          return (
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={22}
              color="#4CAF50"
            />
          );

        case 'prova':

          return (
            <MaterialCommunityIcons
              name="alert-octagon-outline"
              size={22}
              color="#D35400"
            />
          );

        case 'nota':

          return (
            <MaterialCommunityIcons
              name="book-open-outline"
              size={22}
              color="#4CAF50"
            />
          );

        case 'falta_critica':

          return (
            <MaterialCommunityIcons
              name="close-octagon"
              size={22}
              color="#C0392B"
            />
          );

        case 'falta_alerta':

          return (
            <MaterialCommunityIcons
              name="alert"
              size={22}
              color="#D35400"
            />
          );

        default:

          return (
            <MaterialCommunityIcons
              name="school-outline"
              size={22}
              color="#1C2E4A"
            />
          );

      }

    };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <View style={styles.header}>

        <View
          style={
            styles.headerTitleContainer
          }
        >

          <Feather
            name="bell"
            size={28}
            color="#1C2E4A"
          />

          <Text
            style={
              styles.headerTitle
            }
          >
            Notificações
          </Text>

        </View>

      </View>

      <LinearGradient
        colors={[
          '#7895E8',
          '#A9C4F0',
          '#DCE8F5'
        ]}
        style={
          styles.mainGradient
        }
      >

        {loading ? (

          <View
            style={
              styles.loaderContainer
            }
          >

            <ActivityIndicator
              size="large"
              color="#1C2E4A"
            />

          </View>

        ) : (

          <ScrollView
            contentContainerStyle={
              styles.scrollContent
            }
          >

            {notificacoes.length ===
            0 ? (

              <View
                style={
                  styles.emptyContainer
                }
              >

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Nenhuma notificação encontrada.
                </Text>

              </View>

            ) : (

              notificacoes.map(
                item => (

                  <View
                    key={item.id}
                    style={
                      styles.card
                    }
                  >

                    <View
                      style={
                        styles.cardHeader
                      }
                    >

                      <View
                        style={
                          styles.cardIconWrapper
                        }
                      >
                        {renderIcone(
                          item.tipo
                        )}
                      </View>

                      <Text
                        style={
                          styles.cardTitle
                        }
                      >
                        {item.titulo}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          removerNotificacao(
                            item.id
                          )
                        }
                      >

                        <MaterialCommunityIcons
                          name="close-circle-outline"
                          size={22}
                          color="#94A3B8"
                        />

                      </TouchableOpacity>

                    </View>

                    <Text
                      style={
                        styles.cardBodyText
                      }
                    >
                      {item.texto}
                    </Text>

                    <View
                      style={
                        styles.cardFooter
                      }
                    >

                      <Text
                        style={
                          styles.cardTime
                        }
                      >
                        {item.tempo}
                      </Text>

                      <TouchableOpacity
                        style={
                          styles.btnVerMais
                        }
                        onPress={() =>
                          lidarComNavegacao(
                            item
                          )
                        }
                      >

                        <Text
                          style={
                            styles.btnVerMaisText
                          }
                        >
                          Ver no App
                        </Text>

                      </TouchableOpacity>

                    </View>

                  </View>

                )
              )

            )}

          </ScrollView>

        )}

      </LinearGradient>

    </SafeAreaView>

  );

}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#FFF'
    },

    header: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 20,
      backgroundColor:
        '#FFF'
    },

    headerTitleContainer: {
      flexDirection: 'row',
      alignItems:
        'center'
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#1C2E4A',
      marginLeft: 10
    },

    mainGradient: {
      flex: 1,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingTop: 25,
      paddingHorizontal: 16
    },

    scrollContent: {
      paddingBottom: 30
    },

    loaderContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center'
    },

    emptyContainer: {
      marginTop: 100,
      alignItems:
        'center'
    },

    emptyText: {
      color: '#1C2E4A',
      fontSize: 16,
      fontWeight: '600'
    },

    card: {
      backgroundColor:
        '#FFF',
      borderRadius: 18,
      padding: 16,
      marginBottom: 14,
      elevation: 2
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems:
        'center',
      marginBottom: 10
    },

    cardIconWrapper: {
      width: 30
    },

    cardTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: 'bold',
      color: '#1C2E4A'
    },

    cardBodyText: {
      fontSize: 13,
      color: '#334155',
      marginBottom: 14
    },

    cardFooter: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems:
        'center'
    },

    cardTime: {
      fontSize: 12,
      color: '#64748B'
    },

    btnVerMais: {
      backgroundColor:
        '#DCE8F5',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 12
    },

    btnVerMaisText: {
      color: '#1C2E4A',
      fontWeight: 'bold',
      fontSize: 11
    }

  });
