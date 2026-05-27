import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importações de todas as suas telas
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
import ConfiguracaoScreen from '../screens/ConfiguracaoScreen';
import EditarPerfilScreen from '../screens/EditarPerfilScreen';
import ReceberScreen from '../screens/ReceberScreen';
import IAScreen from '../screens/IAScreen';
import PreferenciaConfig from '../screens/PreferenciaConfigScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * 1. NAVEGADOR DE ABAS (BARRA DE NAVEGAÇÃO INFERIOR)
 * Agrupa as 5 telas principais solicitadas.
 */
function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab" // Garante que abre direto na Home
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a237e',
        tabBarInactiveTintColor: '#333',
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: 25, // Afasta a barra de navegação do sistema do celular
          height: 75,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
      }}
    >
      <Tab.Screen 
        name="ConfiguracaoTab" 
        component={ConfiguracaoScreen} 
        options={{
          tabBarLabel: 'Config',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="AreaEstudoTab" 
        component={AreaEstudoScreen} 
        options={{
          tabBarLabel: 'Estudos',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size + 4} color={color} />
        }}
      />
      <Tab.Screen 
        name="ProgressoTab" 
        component={ProgressoScreen} 
        options={{
          tabBarLabel: 'Progresso',
          tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="NotificacaoTab" 
        component={NotificacaoScreen} 
        options={{
          tabBarLabel: 'Avisos',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * 2. NAVEGADOR PRINCIPAL (STACK)
 * Gerencia o fluxo global e telas secundárias que abrem por cima das abas.
 */
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Fluxo Inicial de Autenticação e Preferências */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Preferencias" component={PreferenciaScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PreferenciaConfig" component={PreferenciaConfig} options={{ headerShown: false }} />
      
      {/* O container das Abas Principais (Substitui a rota "Home" direta) */}
      <Stack.Screen name="MainHome" component={HomeTabs} options={{ headerShown: false }} />
      
      {/* Telas Internas e Utilitários (Abrem sem a barra de abas embaixo) */}
      <Stack.Screen name="ChatBot" component={ChatBotScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} options={{ headerShown: false }} /> 
      <Stack.Screen name="Receber" component={ReceberScreen} options={{ headerShown: false }} />
      <Stack.Screen name="IA" component={IAScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cronograma" component={MontarCronogramaScreen} options={{ headerShown: false }} /> 
      <Stack.Screen name="DisciplinaAtividade" component={DisciplinaAtividadeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Faltas" component={FaltasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notas" component={NotasScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}