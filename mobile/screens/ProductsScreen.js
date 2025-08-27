import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';

// Mock products for mobile demo - in real app, this would come from Firebase
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: '99.99',
    category: 'electronics',
    imageUrl: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=Headphones',
    stock: 15,
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Advanced fitness tracking and smart notifications',
    price: '199.99',
    category: 'electronics',
    imageUrl: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=Watch',
    stock: 8,
  },
  {
    id: '3',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for all terrains',
    price: '79.99',
    category: 'sports',
    imageUrl: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=Shoes',
    stock: 22,
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker with programmable timer',
    price: '129.99',
    category: 'home',
    imageUrl: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=Coffee',
    stock: 5,
  },
];

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'home', label: 'Home' },
    { value: 'sports', label: 'Sports' },
  ];

  useEffect(() => {
    // Simulate loading products
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    Alert.alert(
      'Added to Cart',
      `${product.name} has been added to your cart!`,
      [
        {
          text: 'Continue Shopping',
          style: 'default',
        },
        {
          text: 'View Cart',
          onPress: () => navigation.navigate('Cart'),
        },
      ]
    );
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
        <Text style={styles.stockInfo}>Stock: {item.stock}</Text>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            item.stock === 0 && styles.disabledButton
          ]}
          onPress={() => handleAddToCart(item)}
          disabled={item.stock === 0}
        >
          <Text style={styles.addToCartText}>
            {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.value}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item.value && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory(item.value)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item.value && styles.activeCategoryText
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {renderCategoryFilter()}

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  activeCategoryButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    margin: 8,
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#374151',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productPrice: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productCategory: {
    color: '#64748B',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  stockInfo: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#374151',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#F8FAFC',
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#94A3B8',
    fontSize: 14,
  },
});
