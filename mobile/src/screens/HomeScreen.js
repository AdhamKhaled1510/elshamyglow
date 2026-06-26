import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n';
import { getProducts } from '../api';

export default function HomeScreen({ navigation }) {
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');
  const isRtl = lang === 'ar';

  useEffect(() => {
    const params = {};
    if (activeCat) params.category = activeCat;
    if (search) params.search = search;
    getProducts(params).then(({ data }) => {
      setProducts(data.products);
      setCategories(data.categories);
    }).catch(() => {});
  }, [activeCat, search]);

  const renderProduct = ({ item }) => {
    const name = lang === 'ar' ? item.name_ar : item.name_en;
    const images = JSON.parse(item.images || '[]');
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <View style={styles.imageContainer}>
          {images[0] ? (
            <Image source={{ uri: images[0] }} style={styles.productImage} />
          ) : (
            <Ionicons name="image-outline" size={48} color="#ddd" />
          )}
        </View>
        <Text style={[styles.productName, isRtl && { textAlign: 'right' }]}>
          {name}
        </Text>
        <Text style={styles.productPrice}>{item.price} ₪</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={[styles.welcome, isRtl && { textAlign: 'right' }]}>
          {t('welcome', lang)}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={[styles.searchInput, isRtl && { textAlign: 'right' }]}
          placeholder={t('search', lang)}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        horizontal
        data={categories}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              activeCat === String(item.id) && styles.categoryBtnActive,
            ]}
            onPress={() =>
              setActiveCat(
                activeCat === String(item.id) ? null : String(item.id)
              )
            }
          >
            <Text
              style={[
                styles.categoryText,
                activeCat === String(item.id) && styles.categoryTextActive,
              ]}
            >
              {lang === 'ar' ? item.name_ar : item.name_en}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => String(item.id)}
      />

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('noProducts', lang)}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#333', flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16 },
  categoriesList: { marginBottom: 12 },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryBtnActive: { backgroundColor: '#FF6B9D' },
  categoryText: { color: '#666', fontWeight: '500' },
  categoryTextActive: { color: '#fff' },
  row: { justifyContent: 'space-between' },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: { width: '100%', height: '100%', borderRadius: 8 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#FF6B9D', marginTop: 4 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});
