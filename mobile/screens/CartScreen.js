import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';

// Mock cart items for mobile demo
const mockCartItems = [
  {
    id: '1',
    product: {
      id: '1',
      name: 'Wireless Headphones',
      price: '99.99',
      imageUrl: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=Headphones',
    },
    quantity: 2,
  },
  {
    id: '2',
    product: {
      id: '2',
      name: 'Smart Watch',
      price: '199.99',
      imageUrl: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=Watch',
    },
    quantity: 1,
  },
];

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading cart items
    setTimeout(() => {
      setCartItems(mockCartItems);
      setLoading(false);
    }, 500);
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const clearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setCartItems([]),
        },
      ]
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      'Proceeding to checkout...',
      [
        {
          text: 'OK',
          onPress: () => {
            // In a real app, navigate to checkout screen
            Alert.alert('Success', 'Order placed successfully!');
            setCartItems([]);
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>${item.product.price} each</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Add some products to get started!</Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={() => navigation.navigate('Products')}
      >
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.orderSummary}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Items ({getTotalItems()})</Text>
        <Text style={styles.summaryValue}>${getTotalPrice().toFixed(2)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping</Text>
        <Text style={styles.freeShipping}>Free</Text>
      </View>
      
      <View style={styles.summaryDivider} />
      
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${getTotalPrice().toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Shopping Cart</Text>
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearCartText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {renderOrderSummary()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearCartText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#374151',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  itemTotal: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderSummary: {
    backgroundColor: '#1E293B',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 16,
  },
  summaryValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  freeShipping: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 12,
  },
  totalLabel: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#3B82F6',
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  continueShoppingButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#FFFFFF',
    fontSize: 18,
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
});
