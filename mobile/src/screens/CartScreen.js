import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { t } from '../i18n';

export default function CartScreen({ navigation }) {
  const { lang } = useLanguage();
  const { items, updateQty, removeItem, total } = useCart();
  const isRtl = lang === 'ar';

  const renderItem = ({ item }) => {
    const name = lang === 'ar' ? item.name_ar : item.name_en;
    return (
      <View style={[styles.item]}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, isRtl && { textAlign: 'right' }]}>
            {name}
          </Text>
          <Text style={styles.itemPrice}>
            {item.price} ₪ × {item.qty}
          </Text>
        </View>
        <View style={styles.qtyControls}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQty(item.id, item.qty - 1)}
          >
            <Ionicons name="remove" size={18} color="#FF6B9D" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.qty}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQty(item.id, item.qty + 1)}
          >
            <Ionicons name="add" size={18} color="#FF6B9D" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeItem(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer]}>
        <Ionicons name="cart-outline" size={80} color="#ddd" />
        <Text style={styles.emptyText}>{t('emptyCart', lang)}</Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopBtnText}>{t('startShopping', lang)}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('total', lang)}</Text>
          <Text style={styles.totalValue}>{total.toFixed(2)} ₪</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>{t('checkout', lang)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: { fontSize: 18, color: '#999', marginTop: 16 },
  shopBtn: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  shopBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  list: { padding: 16 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemPrice: { fontSize: 14, color: '#FF6B9D', marginTop: 4 },
  qtyControls: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  qtyText: { fontSize: 16, fontWeight: '600', marginHorizontal: 8 },
  deleteBtn: { marginLeft: 12 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#FF6B9D' },
  checkoutBtn: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
