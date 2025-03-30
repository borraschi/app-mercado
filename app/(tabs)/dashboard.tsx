import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

// Mock data
const mockData = {
  ratings: { 5: 45, 4: 30, 3: 15, 2: 7, 1: 3 },
  recentFeedback: [
    { id: 1, rating: 5, comment: 'Excelente atendimento!', date: '2024-01-20', categories: ['Ótimo Atendimento', 'Produtos de Qualidade'] },
    { id: 2, rating: 4, comment: 'Muito bom, mas pode melhorar', date: '2024-01-19', categories: ['Ambiente Limpo'] },
    { id: 3, rating: 5, comment: 'Adorei!', date: '2024-01-18', categories: ['Preços Acessíveis', 'Ótimo Atendimento'] },
  ],
};

export default function DashboardScreen() {
  const screenWidth = Dimensions.get('window').width;

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
    datasets: [{ data: [3, 7, 15, 30, 45] }],
  };

  const lineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{ data: [4.2, 4.4, 4.3, 4.5, 4.6, 4.7], color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})` }],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mercado Silveira</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4.7</Text>
          <Text style={styles.statLabel}>Média Geral</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>152</Text>
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
          yAxisSuffix="" // Adicionada para corrigir o erro
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
        {mockData.recentFeedback.map((feedback) => (
          <View key={feedback.id} style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{feedback.rating}★</Text>
              </View>
              <Text style={styles.dateText}>{feedback.date}</Text>
            </View>
            <Text style={styles.commentText}>{feedback.comment}</Text>
            <View style={styles.categoriesContainer}>
              {feedback.categories.map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{category}</Text>
                </View>
              ))}
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
    fontFamily: 'Inter_700Bold',
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
    fontFamily: 'Inter_700Bold',
    color: '#FF0000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  chartContainer: {
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
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
    fontFamily: 'Inter_600SemiBold',
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
    fontFamily: 'Inter_600SemiBold',
  },
  dateText: {
    color: '#666666',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  commentText: {
    color: '#333333',
    fontFamily: 'Inter_400Regular',
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
    fontFamily: 'Inter_400Regular',
  },
});