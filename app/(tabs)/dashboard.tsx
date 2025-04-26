import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useFeedbackData } from '@/hooks/useFeedbackData';

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

// Utility function to calculate ratings distribution
const calculateRatingsDistribution = (feedbackList: any[]) => {
  const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  feedbackList.forEach((feedback) => {
    ratings[feedback.rating] = (ratings[feedback.rating] || 0) + 1;
  });

  const total = feedbackList.length;
  const colors = ['#FF9999', '#FFBB99', '#FFCC99', '#FFDD99', '#FFEE99']; // Vermelho claro a amarelo
  return Object.keys(ratings).map((star, index) => ({
    name: `${star}★`,
    value: ratings[star],
    percentage: total > 0 ? ((ratings[star] / total) * 100).toFixed(1) : 0,
    color: colors[index],
    starValue: parseInt(star)
  }));
};

// Utility function to calculate average rating
const calculateAverageRating = (feedbackList: any[]) => {
  if (feedbackList.length === 0) return 0;
  const total = feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0);
  return (total / feedbackList.length).toFixed(1);
};

// Utility function to calculate monthly averages - modificada para 12 meses
const calculateMonthlyAverages = (feedbackList: any[]) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthlyData = Array(12).fill(0);
  const monthlyCount = Array(12).fill(0);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  feedbackList.forEach((feedback) => {
    const date = feedback.createdAt?.toDate();
    if (date) {
      const feedbackMonth = date.getMonth();
      const feedbackYear = date.getFullYear();
      
      // Verificar se o feedback é do ano atual
      if (feedbackYear === currentYear) {
        monthlyData[feedbackMonth] += feedback.rating;
        monthlyCount[feedbackMonth] += 1;
      }
    }
  });

  return months.map((month, index) => ({
    month,
    value: monthlyCount[index] > 0 ? Number((monthlyData[index] / monthlyCount[index]).toFixed(1)) : 0
  }));
};

export default function DashboardScreen() {
  const { feedbackList, loading, error } = useFeedbackData();
  const screenWidth = Dimensions.get('window').width;
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  // Estados para paginação e filtro
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const itemsPerPage = 10;

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

  if (!feedbackList || feedbackList.length === 0) {
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

  const averageRating = calculateAverageRating(feedbackList);
  const monthlyResults = calculateMonthlyAverages(feedbackList);
  const pieData = calculateRatingsDistribution(feedbackList).filter((item) => item.value > 0);

  // Filtragem de feedbacks baseada na classificação de estrelas selecionada
  const filteredFeedbacks = selectedRating 
    ? feedbackList.filter(feedback => feedback.rating === selectedRating)
    : feedbackList;

  // Cálculo para paginação
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredFeedbacks.length);
  const currentFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const lineData = {
    labels: months,
    datasets: [
      {
        data: monthlyResults.map(item => item.value || 0),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      },
    ],
  };

  // Função para lidar com a mudança de página
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Função para lidar com a seleção de classificação por estrela
  const handleRatingFilter = (rating: number) => {
    setSelectedRating(selectedRating === rating ? null : rating);
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
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
        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={240}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="0"
          center={[0, -10]}
          absolute
          hasLegend={false}
          style={styles.chart}
        />
        <View style={styles.percentageLegendContainer}>
          {pieData.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.legendItem,
                selectedRating === item.starValue ? styles.selectedLegendItem : {}
              ]}
              onPress={() => handleRatingFilter(item.starValue)}
            >
              <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.name}: {item.percentage}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedRating && (
          <TouchableOpacity 
            style={styles.clearFilterButton}
            onPress={() => setSelectedRating(null)}
          >
            <Text style={styles.clearFilterText}>Limpar filtro</Text>
          </TouchableOpacity>
        )}
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
        <Text style={styles.sectionTitle}>
          {selectedRating 
            ? `Avaliações com ${selectedRating} estrelas (${filteredFeedbacks.length})` 
            : `Todas as Avaliações (${filteredFeedbacks.length})`}
        </Text>
        
        {currentFeedbacks.length > 0 ? (
          currentFeedbacks.map((feedback) => (
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
          ))
        ) : (
          <Text style={styles.noFeedbackText}>Nenhuma avaliação encontrada com este filtro.</Text>
        )}
        
        {/* Paginação */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity 
              style={[styles.paginationButton, currentPage === 1 ? styles.disabledButton : {}]}
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Text style={styles.paginationButtonText}>Anterior</Text>
            </TouchableOpacity>
            
            <Text style={styles.paginationText}>
              Página {currentPage} de {totalPages}
            </Text>
            
            <TouchableOpacity 
              style={[styles.paginationButton, currentPage === totalPages ? styles.disabledButton : {}]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.paginationButtonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        )}
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666666',
  },
  chartContainer: {
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#FF0000',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  percentageLegendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
    padding: 4,
    borderRadius: 4,
  },
  selectedLegendItem: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  legendColorBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: 'normal',
  },
  clearFilterButton: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  clearFilterText: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: '500',
  },
  feedbackContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  dateText: {
    color: '#666666',
    fontWeight: 'normal',
    fontSize: 14,
  },
  commentText: {
    color: '#333333',
    fontWeight: 'normal',
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
    fontWeight: 'normal',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF0000',
    borderRadius: 6,
  },
  paginationButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  paginationText: {
    fontSize: 14,
    color: '#666666',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  noFeedbackText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },
});