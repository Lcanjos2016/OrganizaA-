import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import AreaEstudoScreen from '../screens/AreaEstudoScreen';
import MontarCronogramaScreen from '../screens/MontarCronogramaScreen';
import DisciplinaAtividadeScreen from '../screens/DisciplinaAtividadeScreen';
import FaltasScreen from '../screens/FaltasScreen';
import NotasScreen from '../screens/NotasScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="AreaEstudo"  component={AreaEstudoScreen} options={{ headerShown: false}} />
      <Stack.Screen name="Cronograma" component={MontarCronogramaScreen} options={{ headerShown: false }} /> 
      <Stack.Screen name="DisciplinaAtividade" component={DisciplinaAtividadeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Faltas" component={FaltasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notas" component={NotasScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}