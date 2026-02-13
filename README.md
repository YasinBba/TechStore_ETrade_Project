# TechStore - Modern E-Ticaret Platformu 🚀

TechStore, modern teknolojilerle oluşturulmuş, sorunsuz bir alışveriş deneyimi sunmak için tasarlanmış tam kapsamlı bir e-ticaret uygulamasıdır. Proje, güçlü bir .NET backend ve duyarlı bir React frontend içerir.

## 🌟 Temel Özellikler

### Müşteriler İçin:
- 🛍️ **Ürün Kataloğu**: Ürünleri kategoriye, fiyata ve daha fazlasına göre filtreleyip inceleyin.
- 🛒 **Alışveriş Sepeti**: Miktar ayarlamalarıyla gerçek zamanlı sepet yönetimi.
- ❤️ **Favoriler**: Beğendiğiniz ürünleri daha sonra incelemek için kaydedin.
- 💳 **Ödeme Süreci**: Güvenli ve akıcı ödeme akışı.
- 👤 **Kullanıcı Profilleri**: Siparişleri, adresleri ve hesap ayrıntılarını yönetin.
- 🌍 **Çoklu Dil Desteği**: Tamamen yerelleştirilmiş arayüz.

### Yöneticiler İçin:
- 📊 **Panel**: Satışlar, siparişler ve kullanıcı istatistiklerinin gerçek zamanlı genel bakışı.
- 📦 **Ürün Yönetimi**: Envanter ekleyin, güncelleyin ve yönetin.
- 👥 **Kullanıcı Yönetimi**: Müşteri hesaplarını görüntüleyin ve yönetin.
- 📝 **İçerik Yönetimi**: Bannerları ve site içeriğini dinamik olarak güncelleyin.

## 🛠️ Teknoloji Yığını

### Backend (.NET 9.0)
- **Framework**: ASP.NET Core Web API
- **Veritabanı**: Entity Framework Core ile SQL Server
- **Kimlik Doğrulama**: JWT (JSON Web Tokens) & Identity Framework
- **Mimari**: Clean Architecture prensipleri

### Frontend (React 19)
- **Derleme Aracı**: Vite
- **Stil**: Modern ve duyarlı tasarım için Tailwind CSS
- **Durum Yönetimi**: Context API
- **Yönlendirme**: React Router DOM 7
- **Uluslararasılaştırma**: i18next
- **İkonlar**: Lucide React

## 🚀 Başlangıç

### Gereksinimler
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18 veya üzeri)
- SQL Server (LocalDB veya tam sürüm)

### Kurulum

1. **Depoyu klonlayın**
   ```bash
   git clone https://github.com/YasinBba/TechStore_ETrade_Project.git
   cd TechStore_ETrade_Project
   ```

2. **Backend Kurulumu**
   API dizinine gidin ve `appsettings.json` dosyasındaki bağlantı dizesini güncelleyin.
   ```bash
   cd src/TechStore.API
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

3. **Frontend Kurulumu**
   Frontend dizinine gidin.
   ```bash
   cd techstore-frontend
   npm install
   npm run dev
   ```

4. **Uygulamaya Erişim**
   - Frontend: `http://localhost:5173`
   - Backend Swagger: `https://localhost:7001/swagger` (varsayılan port değişebilir)

## 📸 Ekran Görüntüleri
*(Anasayfa, Ürün Detayı ve Yönetici Paneli ekran görüntülerini buraya ekleyin)*

## 🤝 Katkıda Bulunma
Katkılarınız memnuniyetle karşılanır! Lütfen bir Pull Request göndermekten çekinmeyin.

## 📄 Lisans
Bu proje MIT Lisansı altında lisanslanmıştır.
