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
import ConfiguracaoScreen from '../screens/ConfiguracaoScreen';
import EditarPerfilScreen from '../screens/EditarPerfilScreen';
import ReceberScreen from '../screens/ReceberScreen';
import IAScreen from'../screens/IAScreen';
import PreferenciaConfig from '../screens/PreferenciaConfigScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Preferencias" component={PreferenciaScreen} options={{ headerShown: false}} />
      <Stack.Screen name="PreferenciaConfig" component={PreferenciaConfig} options={{ headerShown : false}} />
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown : false}} />
      <Stack.Screen name="Progresso" component ={ProgressoScreen} options={{ headerShown : false}} />
      <Stack.Screen name="Notificacoes" component ={NotificacaoScreen} options={{ headerShown : false}} />
      <Stack.Screen name="ChatBot" component ={ChatBotScreen} options={{ headerShown : false}} />
      <Stack.Screen name="Configuracao" component ={ConfiguracaoScreen} options={{ headerShown : false}} />
      <Stack.Screen name="EditarPerfil" component ={EditarPerfilScreen} options={{ headerShown : false}} /> 
      <Stack.Screen name="Receber" component ={ReceberScreen} options={{ headerShown : false}} />
      <Stack.Screen name="IA" component ={IAScreen}  />
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="AreaEstudo"  component={AreaEstudoScreen} options={{ headerShown: false}} />
      <Stack.Screen name="Cronograma" component={MontarCronogramaScreen} options={{ headerShown: false }} /> 
      <Stack.Screen name="DisciplinaAtividade" component={DisciplinaAtividadeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Faltas" component={FaltasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notas" component={NotasScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}