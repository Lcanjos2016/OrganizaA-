import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import PreferenciaScreen from '../screens/PreferenciaScreen';
import HomeScreen from '../screens/HomeScreen';
import CadastroScreen from '../screens/CadastroScreen';
import AreaEstudoScreen from '../screens/AreaEstudoScreen';
import MontarCronogramaScreen from '../screens/MontarCronogramaScreen';
import DisciplinaAtividadeScreen from '../screens/DisciplinaAtividadeScreen';
import FaltasScreen from '../screens/FaltasScreen';
import NotasScreen from '../screens/NotasScreen';
import ProgressoScreen from '../screens/ProgressoScreen';
import NotificacaoScreen from '../screens/NotificacaoScreen';
import ChatBotScreen from '../screens/ChatBotScreen';
import SituacaoNotasScreen from '../screens/NotasScreen';
import ConfiguracaoScreen from '../screens/ConfiguraçãoScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Preferencias" component={PreferenciaScreen}  />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Progresso" component ={ProgressoScreen} />
      <Stack.Screen name="Notificacoes" component ={NotificacaoScreen} />
      <Stack.Screen name="ChatBot" component ={ChatBotScreen} />
      <Stack.Screen name="Configuracao" component ={ConfiguracaoScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="AreaEstudo"  component={AreaEstudoScreen} options={{ headerShown: false}} />
      <Stack.Screen name="Cronograma" component={MontarCronogramaScreen} options={{ headerShown: false }} /> 
      <Stack.Screen name="DisciplinaAtividade" component={DisciplinaAtividadeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Faltas" component={FaltasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notas" component={NotasScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}