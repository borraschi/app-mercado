import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useFeedbackData } from '@/hooks/useFeedbackData';

// Definindo o tipo para as opções de feedback (copied from index.tsx to map labels)
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

// Utility function to calculate ratings distribution
const calculateRatingsDistribution = (feedbackList: any[]) => {
  const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  feedbackList.forEach((feedback) => {
    ratings[feedback.rating] = (ratings[feedback.rating] || 0) + 1;
  });
  return ratings;
};

// Utility function to calculate average rating
const calculateAverageRating = (feedbackList: any[]) => {
  if (feedbackList.length === 0) return 0;
  const total = feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0);
  return (total / feedbackList.length).toFixed(1);
};

// Utility function to calculate monthly averages (simplified)
const calculateMonthlyAverages = (feedbackList: any[]) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const monthlyData = [0, 0, 0, 0, 0, 0]; // Placeholder for 6 months
  const currentMonth = new Date().getMonth(); // 0-11

  feedbackList.forEach((feedback) => {
    const date = feedback.createdAt?.toDate(); // Convert Firestore Timestamp to Date
    if (date) {
      const monthIndex = (date.getMonth() + 12 - currentMonth) % 12;
      if (monthIndex < 6) {
        monthlyData[5 - monthIndex] = (monthlyData[5 - monthIndex] || 0) + feedback.rating;
      }
    }
  });

  return monthlyData.map((sum, index) => (sum ? sum / feedbackList.length : 4.0 + index * 0.1));
};

export default function DashboardScreen() {
  const { feedbackList, loading, error } = useFeedbackData();
  const screenWidth = Dimensions.get('window').width;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={{ marginTop: 10, color: '#666666', fontWeight: 'normal' }}>
          Carregando dados...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FF0000', fontWeight: '600', fontSize: 16 }}>
          Erro: {error}
        </Text>
        <Text style={{ marginTop: 10, color: '#666666', fontWeight: 'normal' }}>
          Tente novamente mais tarde.
        </Text>
      </View>
    );
  }

  if (feedbackList.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666666', fontWeight: '600', fontSize: 16 }}>
          Nenhuma avaliação ainda.
        </Text>
        <Text style={{ marginTop: 10, color: '#666666', fontWeight: 'normal' }}>
          Peça aos clientes para deixar uma avaliação na aba "Feedback".
        </Text>
      </View>
    );
  }

  const ratings = calculateRatingsDistribution(feedbackList);
  const averageRating = calculateAverageRating(feedbackList);
  const recentFeedback = feedbackList.slice(0, 3); // Get the 3 most recent feedback entries

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const barData = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [{ data: [ratings[1], ratings[2], ratings[3], ratings[4], ratings[5]] }],
  };

  const lineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      { data: calculateMonthlyAverages(feedbackList), color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})` },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mercado Silveira</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{averageRating}</Text>
          <Text style={styles.statLabel}>Média Geral</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{feedbackList.length}</Text>
          <Text style={styles.statLabel}>Total de Avaliações</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribuição de Estrelas</Text>
        <BarChart
          data={barData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Média Mensal</Text>
        <LineChart
          data={lineData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
        />
      </View>

      <View style={styles.feedbackContainer}>
        <Text style={styles.sectionTitle}>Últimos Comentários</Text>
        {recentFeedback.map((feedback) => (
          <View key={feedback.id} style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{feedback.rating}★</Text>
              </View>
              <Text style={styles.dateText}>
                {feedback.createdAt?.toDate().toISOString().split('T')[0] || 'N/A'}
              </Text>
            </View>
            <Text style={styles.commentText}>{feedback.comment}</Text>
            <View style={styles.categoriesContainer}>
              {feedback.selectedOptions.map((optionId: string, index: number) => {
                const option = feedbackOptions.find((opt) => opt.id === optionId);
                return (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{option?.label || optionId}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FF0000',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold', // Replaced Inter_700Bold with fontWeight
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold', // Replaced Inter_700Bold with fontWeight
    color: '#FF0000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'normal', // Replaced Inter_400Regular with fontWeight
    color: '#666666',
  },
  chartContainer: {
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600', // Replaced Inter_600SemiBold with fontWeight
    marginBottom: 16,
    color: '#FF0000',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  feedbackContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600', // Replaced Inter_600SemiBold with fontWeight
    marginBottom: 16,
    color: '#FF0000',
  },
  feedbackCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    backgroundColor: '#FF0000',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontWeight: '600', // Replaced Inter_600SemiBold with fontWeight
  },
  dateText: {
    color: '#666666',
    fontWeight: 'normal', // Replaced Inter_400Regular with fontWeight
    fontSize: 14,
  },
  commentText: {
    color: '#333333',
    fontWeight: 'normal', // Replaced Inter_400Regular with fontWeight
    fontSize: 16,
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 2,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  categoryTagText: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: 'normal', // Replaced Inter_400Regular with fontWeight
  },
});