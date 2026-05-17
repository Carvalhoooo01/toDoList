import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity, Modal, TextInput,LogBox, Pressable, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import { useState } from 'react';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import EmojiPicker from 'react-native-emoji-chooser';

LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
]);

const formatarDataPortugues = () => {
  const meses = [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',];
  const hoje = new Date();
  return `${hoje.getDate()} de ${meses[hoje.getMonth()]}, ${hoje.getFullYear()}`;
};

export default function App() {
  const [tarefas, setTarefas] = useState([
    { id: 1, text: 'Comprar BTC na baixa', categoria: '💰Financeiro', feita: false },
    { id: 2, text: 'Enviar cripto corretora chinesa', categoria: '💰Financeiro', feita: false },
    { id: 3, text: 'Levar a morena no cinema', categoria: '💞Relacionamento', feita: false },
    { id: 4, text: 'Assinar o contrato e enviar', categoria: '💻Freelance', feita: false },
    { id: 5, text: 'Comprar detergente YPE', categoria: '🛒Mercado', feita: false },
    { id: 6, text: 'Preparar aula de mobile', categoria: '📚Curso', feita: true },
    { id: 7, text: 'Criar Protótipo figma', categoria: '📽️Design', feita: true },
    { id: 8, text: 'Criar video no YT sobre redis', categoria: '📹Influencer', feita: true },
    { id: 9, text: 'remarcar café cliente - SV 48', categoria: '☕Java', feita: true },
  ]);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [categoriaTarefa, setCategoriaTarefa] = useState('');
  const [emojiSelecionado, setEmojiSelecionado] = useState('😀');
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false);

  const incompletas = tarefas.filter(t => t.feita === false);
  const realizadas = tarefas.filter(t => t.feita === true);

  const toggleTarefa = (id) => {
    setTarefas(tarefasAtuais =>
      tarefasAtuais.map(t => t.id === id ? { ...t, feita: !t.feita } : t)
    );
  };

  const adicionarTarefa = () => {
    setModalVisivel(false);
    if (nomeTarefa.trim() === '') return;

    const novaTarefa = {
      id: Date.now(),
      text: nomeTarefa,
      categoria: emojiSelecionado + categoriaTarefa,
      feita: false,
    };

    setTarefas(tarefasAtuais => [...tarefasAtuais, novaTarefa]);
    setNomeTarefa('');
    setCategoriaTarefa('');
    setEmojiSelecionado('😀');
    setMostrarEmojiPicker(false);
  };

  const aoSelecionarEmoji = (emoji) => {
    setEmojiSelecionado(emoji);
    setMostrarEmojiPicker(false);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setMostrarEmojiPicker(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light"/>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.tarefas}>
          <Text style={styles.sectiontittle}>{formatarDataPortugues()}</Text>

          <Text style={styles.contador}>
            {incompletas.length} incompletas, {realizadas.length} realizadas
          </Text>

          <View style={styles.divisor}></View>

          <View style={styles.itens}>
            <Text style={styles.tituloSecao}>Incompletas</Text>

            {incompletas.map(tarefa => (
              <View key={tarefa.id} style={styles.itemTarefa}>
                <Checkbox
                  value={tarefa.feita}
                  onValueChange={() => toggleTarefa(tarefa.id)}
                  style={styles.checkbox}/>
                <View style={styles.itemInfo}>
                  <Text style={styles.tarefaNome}>{tarefa.text}</Text>
                  <Text style={styles.tarefaCategoria}>{tarefa.categoria}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.itens}>
            <Text style={styles.tituloSecao}>Realizadas</Text>

            {realizadas.map(tarefa => (
              <View key={tarefa.id} style={styles.itemTarefa}>
                <Checkbox
                  value={tarefa.feita}
                  onValueChange={() => toggleTarefa(tarefa.id)}
                  style={styles.checkbox}/>
                <Text style={styles.tarefaFeita}>{tarefa.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisivel(true)}>
        <MaterialIcons name="add" size={50} color="#ffffff"/>
      </TouchableOpacity>

      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={fecharModal}>
      
        <Pressable style={styles.modalOverlay} onPress={fecharModal}>
          <Pressable onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalContent}>
           
              <Text style={styles.label}>Tarefa</Text>
              <TextInput
                style={styles.input}
                placeholder="Realizar treino em casa - Treino 3"
                placeholderTextColor="#888"
                value={nomeTarefa}
                onChangeText={setNomeTarefa}/>

              <View style={styles.linhaForm}>
                <View style={styles.colunaEmoji}>
                  <Text style={styles.label}>Emoji</Text>
                  <TouchableOpacity
                    style={styles.botaoEmoji}
                    onPress={() => setMostrarEmojiPicker(!mostrarEmojiPicker)}>
                    <Text style={{ fontSize: 28 }}>{emojiSelecionado}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.colunaCategoria}>
                  <Text style={styles.label}>Categoria</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Mercado"
                    placeholderTextColor="#888"
                    value={categoriaTarefa}
                    onChangeText={setCategoriaTarefa}/>
                </View>
              </View>

              {mostrarEmojiPicker && (
                <View style={styles.containerEmojiPicker}>
                  <EmojiPicker
                    onSelect={aoSelecionarEmoji}
                    mode="dark"
                    columnCount={8}/>
                </View>
              )}

              <TouchableOpacity style={styles.botaoCriar} onPress={adicionarTarefa}>
                <Text style={styles.textoBotaoCriar}>Criar</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 30,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  tarefas: { marginTop: 5 },
  sectiontittle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  contador: {
    fontSize: 16,
    color: '#888888',
    marginTop: 5,
  },
  divisor: {
    borderBottomColor: '#444444',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  itens: { marginTop: 5 },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffffff',
  },
  tarefaFeita: {
    fontSize: 20,
    color: '#666666',
    textDecorationLine: 'line-through',
    marginVertical: 4,
  },
  itemTarefa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: { marginRight: 12 },
  itemInfo: { flex: 1 },
  tarefaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  tarefaCategoria: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7B61FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  linhaForm: {
    flexDirection: 'row',
    gap: 12,
  },
  colunaEmoji: { width: 70 },
  colunaCategoria: { flex: 1 },
  botaoEmoji: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  botaoCriar: {
    backgroundColor: '#7B61FF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoCriar: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerEmojiPicker: {
    height: 250,        
    marginTop: 10,
    flexShrink: 1,      
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    overflow: 'hidden',
  },
});