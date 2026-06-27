import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet, SafeAreaView, Dimensions, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n';
import { getProducts } from '../api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

const CAT_COLORS = ['#FFE4E6', '#E0F0FF', '#FFF3E0', '#E8F5E9', '#F3E5F5'];
const CAT_ICONS = ['lipstick-outline', 'eye-outline', 'color-palette-outline', 'water-outline', 'flower-outline'];

export default function HomeScreen({ navigation }) {
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [catList, setCatList] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');
  const isRtl = lang === 'ar';

  useEffect(() => {
    const params = {};
    if (activeCat) params.category = activeCat;
    if (search) params.search = search;
    getProducts(params).then(({ data }) => {
      setProducts(data.products);
      setCatList(data.categories);
    }).catch(() => {});
  }, [activeCat, search]);

  const renderProduct = ({ item }) => {
    const name = lang === 'ar' ? item.name_ar : item.name_en;
    const images = JSON.parse(item.images || '[]');
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <View style={styles.imageWrap}>
          <Image source={{ uri: images[0] }} style={styles.productImage} />
          {item.featured ? (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={10} color="#fff" />
            </View>
          ) : null}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{name}</Text>
          <Text style={styles.productPrice}>{item.price} ₪</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('welcome', lang)}</Text>
          <Text style={styles.subtitle}>GlowRX</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="bag-outline" size={24} color="#FF6B9D" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={[styles.searchInput, isRtl && { textAlign: 'right' }]}
          placeholder={t('search', lang)}
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catContent}
      >
        {catList.map((cat, i) => {
          const isActive = activeCat === String(cat.id);
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catCard, { backgroundColor: isActive ? '#FF6B9D' : CAT_COLORS[i % CAT_COLORS.length] }]}
              onPress={() => setActiveCat(isActive ? null : String(cat.id))}
            >
              <View style={[styles.catIconWrap, { backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#fff' }]}>
                <Ionicons name={CAT_ICONS[i % CAT_ICONS.length]} size={24} color={isActive ? '#fff' : '#FF6B9D'} />
              </View>
              <Text style={[styles.catLabel, isActive && { color: '#fff' }]}>
                {lang === 'ar' ? cat.name_ar : cat.name_en}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('noProducts', lang)}</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 8,
  },
  greeting: { fontSize: 14, color: '#999' },
  subtitle: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginTop: 2 },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
  catScroll: { maxHeight: 100, marginBottom: 8 },
  catContent: { paddingHorizontal: 20, gap: 10 },
  catCard: {
    width: 90,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  catIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catLabel: { fontSize: 11, fontWeight: '600', color: '#333', textAlign: 'center' },
  row: { justifyContent: 'space-between', paddingHorizontal: 20, gap: 4 },
  productsList: { paddingTop: 12, paddingBottom: 20 },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  imageWrap: {
    height: CARD_WIDTH,
    backgroundColor: '#f0f0f0',
  },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B9D',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', lineHeight: 18 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#FF6B9D', marginTop: 6 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});
