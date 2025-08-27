import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome to Brill Prime</Text>
          <Text style={styles.heroSubtitle}>
            Discover amazing products with fast delivery and excellent customer service
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.primaryButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.features}>
          <Text style={styles.sectionTitle}>Why Choose Brill Prime?</Text>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>🚚 Fast Shipping</Text>
            <Text style={styles.featureText}>
              Free shipping on orders over $50 with next-day delivery available
            </Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>🔒 Secure Shopping</Text>
            <Text style={styles.featureText}>
              Your data is protected with bank-level security and encryption
            </Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>⭐ Premium Quality</Text>
            <Text style={styles.featureText}>
              Carefully curated products from trusted brands and manufacturers
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Ready to Start Shopping?</Text>
          <Text style={styles.ctaText}>
            Join thousands of satisfied customers and discover the Brill Prime difference today
          </Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.secondaryButtonText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#1E293B',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 24,
  },
  feature: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  cta: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: '600',
  },
});
