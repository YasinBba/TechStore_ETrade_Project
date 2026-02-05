# TechStore Frontend

React ve Vite ile geliştirilmiş, modern ve responsive bir e-ticaret ön yüz projesi.

## 🚀 Özellikler

- **React 18** ve **Vite** ile yüksek performans
- **Tailwind CSS** ile modern tasarım
- **Context API** ile state yönetimi (Auth & Cart)
- **Axios** ile API entegrasyonu
- **Tasarım:** Responsive Navbar, Hero Slider, Ürün Kartları, Detay Sayfası
- **Alışveriş:** Sepete Ekle, Miktar Güncelle, Sepetten Sil
- **Sipariş:** Çok adımlı Checkout süreci, Sipariş Geçmişi
- **Auth:** JWT tabanlı Giriş/Kayıt, Korumalı Route'lar

## 🛠️ Kurulum

```bash
# Proje dizinine git
cd techstore-frontend

# Bağımlılıkları yükle
npm install

# Projeyi çalıştır
npm run dev
```

## 📦 Klasör Yapısı

- `src/components`: Tekrar kullanılabilir bileşenler (Navbar, Footer, vb.)
- `src/pages`: Sayfa bileşenleri (HomePage, ProductListPage, vb.)
- `src/context`: Global state yönetimi (AuthContext, CartContext)
- `src/services`: API servisleri (authService, productService, orderService)
- `src/layouts`: Sayfa düzenleri

## 🔗 API Bağlantısı

Proje varsayılan olarak `http://localhost:5000/api` adresindeki .NET Core Web API'ye bağlanır.
`src/context/AuthContext.jsx` dosyasından baseURL ayarlanabilir.
