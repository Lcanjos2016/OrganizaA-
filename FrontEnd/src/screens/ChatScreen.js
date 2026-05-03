import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function ChatScreen() {
  const [mensagem, setMensagem] = useState('');
  
  // Exemplo de lista para as mensagens (QA: teste com dados mockados antes da API)
  const [conversa, setConversa] = useState([
    { id: '1', texto: 'Olá! Como posso ajudar na sua pesquisa hoje?', remetente: 'ia' },
  ]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assistente IA</Text>
      </View>

      {/* Área de Mensagens */}
      <FlatList
        data={conversa}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.balao, item.remetente === 'ia' ? styles.iaBalao : styles.userBalao]}>
            <Text style={item.remetente === 'ia' ? styles.iaTexto : styles.userTexto}>
              {item.texto}
            </Text>
          </View>
        )}
        style={styles.lista}
      />

      {/* Input de Mensagem */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua dúvida..."
          value={mensagem}
          onChangeText={setMensagem}
        />
        <TouchableOpacity style={styles.botaoEnviar}>
          <Text style={styles.textoBotao}>></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { padding: 20, backgroundColor: '#007AFF', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  lista: { flex: 1, padding: 15 },
  balao: { padding: 12, borderRadius: 15, marginBottom: 10, maxWidth: '80%' },
  iaBalao: { alignSelf: 'flex-start', backgroundColor: '#FFF' },
  userBalao: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  iaTexto: { color: '#333' },
  userTexto: { color: '#FFF' },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF' },
  input: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 20, paddingHorizontal: 15, height: 40 },
  botaoEnviar: { marginLeft: 10, backgroundColor: '#007AFF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  textoBotao: { color: '#FFF', fontWeight: 'bold' }
});