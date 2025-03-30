import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Definindo o tipo para as opções de feedback
interface FeedbackOption {
  id: string;
  label: string;
}

const feedbackOptions: FeedbackOption[] = [
  { id: 'atendimento_otimo', label: 'Ótimo Atendimento' },
  { id: 'atendimento_ruim', label: 'Péssimo Atendimento' },
  { id: 'produtos_faltando', label: 'Falta de Produtos' },
  { id: 'produtos_qualidade', label: 'Produtos de Qualidade' },
  { id: 'preco_bom', label: 'Preços Acessíveis' },
  { id: 'preco_alto', label: 'Preços Altos' },
  { id: 'ambiente_limpo', label: 'Ambiente Limpo' },
  { id: 'ambiente_sujo', label: 'Ambiente Sujo' },
];

export default function App() {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleStarPress = (star: number): void => {
    setRating(star);
  };

  const handleOptionPress = (id: string): void => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== id));
    } else if (selectedOptions.length < 3) {
      setSelectedOptions([...selectedOptions, id]);
    } else {
      Alert.alert('Limite atingido', 'Você pode selecionar até 3 opções.');
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (rating === 0) {
      Alert.alert('Por favor, avalie o atendimento com pelo menos uma estrela.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://sua-api.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, selectedOptions, comment }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Avaliação enviada com sucesso!');
        setRating(0);
        setComment('');
        setSelectedOptions([]);
      } else {
        Alert.alert('Erro', 'Não foi possível enviar a avaliação.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um problema ao enviar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Como foi sua experiência?</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            accessibilityLabel={`Avaliar com ${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= rating ? '#FFD700' : '#666666'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subtitlePrimary}>Toque para avaliar</Text>
      <Text style={styles.subtitle}>Selecione os motivos da sua avaliação:
      </Text>
      <View style={styles.optionsContainer}>
        {feedbackOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedOptions.includes(option.id) && styles.optionButtonSelected,
            ]}
            onPress={() => handleOptionPress(option.id)}
            accessibilityLabel={option.label}
          >
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Deixe um comentário (opcional)"
        value={comment}
        onChangeText={setComment}
        multiline
        accessibilityLabel="Campo de comentário opcional"
      />

      <TouchableOpacity
        style={[styles.button, isSubmitting && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        accessibilityLabel={isSubmitting ? 'Enviando avaliação' : 'Enviar avaliação'}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 80, // Aumentado para 80 para dar mais espaço no topo e no fundo
    alignItems: 'center', // Centraliza horizontalmente
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
    marginBottom: 24, // Aumentado para 24 para dar mais espaço ao título
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 16, // Reduzido para 16 para equilibrar
    textAlign: 'center',
  },
  subtitlePrimary: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 16, // Reduzido para 16 para equilibrar
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24, // Mantido em 24 para dar espaço às opções
  },
  starButton: {
    marginHorizontal: 10, // Espaçamento entre estrelas
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Centraliza horizontalmente
    alignItems: 'center', // Centraliza verticalmente
    marginBottom: 20,
  },
  
  optionButton: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF0000',
    margin: 4,
  },
  optionButtonSelected: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
  },
  optionText: {
    color: '#FF0000',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  input: {
    height: 120,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16, // Reduzido para 16 para conectar com o botão
    backgroundColor: '#FFF9E6',
    fontFamily: 'Inter_400Regular',
    color: '#333333',
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40, // Aumentado para 40 para dar espaço no fundo
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});