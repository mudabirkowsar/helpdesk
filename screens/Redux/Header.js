import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useSelector } from 'react-redux';

export default function Header() {

  const cartData = useSelector((state) => state.reducer)
  const cartCount = cartData.length; 

  const navigation = useNavigation()

  const openCartScreen = () => {
    navigation.navigate("CartProducts")
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.logo}>MyStore</Text>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.cartIconContainer} onPress={openCartScreen}>
            <Icon name="cart-outline" size={26} color="#333" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    width: '100%',
    paddingTop: 40,         // 👈 add padding top here
    paddingHorizontal: 16,
    paddingBottom: 12,      // reduce paddingBottom since paddingTop added
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIconContainer: {
    position: 'relative',
    marginRight: 8,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
