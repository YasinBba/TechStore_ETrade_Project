using TechStore.Core.Entities;

namespace TechStore.Infrastructure.Data;

public static class DbSeeder
{
    public static void SeedData(ApplicationDbContext context)
    {
        // Eğer zaten veri varsa seed etme
        if (context.Categories.Any() || context.Products.Any())
            return;

        // Markalar
        var brands = new List<Brand>
        {
            new() { Name = "Logitech", Slug = "logitech", IsActive = true },
            new() { Name = "Razer", Slug = "razer", IsActive = true },
            new() { Name = "Corsair", Slug = "corsair", IsActive = true },
            new() { Name = "SteelSeries", Slug = "steelseries", IsActive = true },
            new() { Name = "HyperX", Slug = "hyperx", IsActive = true },
            new() { Name = "ASUS ROG", Slug = "asus-rog", IsActive = true },
            new() { Name = "MSI", Slug = "msi", IsActive = true },
            new() { Name = "Gigabyte", Slug = "gigabyte", IsActive = true },
            new() { Name = "AMD", Slug = "amd", IsActive = true },
            new() { Name = "NVIDIA", Slug = "nvidia", IsActive = true },
            new() { Name = "Intel", Slug = "intel", IsActive = true },
            new() { Name = "Samsung", Slug = "samsung", IsActive = true },
            new() { Name = "LG", Slug = "lg", IsActive = true },
            new() { Name = "Dell", Slug = "dell", IsActive = true }
        };

        context.Brands.AddRange(brands);
        context.SaveChanges();

        // Ana kategoriler
        var mainCategories = new List<Category>
        {
            new() { Name = "Bilgisayar Bileşenleri", Slug = "bilgisayar-bilesenleri", DisplayOrder = 1, IsActive = true },
            new() { Name = "Gaming Periferler", Slug = "gaming-periferler", DisplayOrder = 2, IsActive = true },
            new() { Name = "Laptop & Dizüstü Bilgisayar", Slug = "laptop-dizustu-bilgisayar", DisplayOrder = 3, IsActive = true },
            new() { Name = "Monitör & Ekran", Slug = "monitor-ekran", DisplayOrder = 4, IsActive = true },
            new() { Name = "Gaming Koltuk & Aksesuar", Slug = "gaming-koltuk-aksesuar", DisplayOrder = 5, IsActive = true }
        };

        context.Categories.AddRange(mainCategories);
        context.SaveChanges();

        // Alt kategoriler
        var subCategories = new List<Category>
        {
            new() { Name = "Ekran Kartı", Slug = "ekran-karti", ParentCategoryId = mainCategories[0].Id, DisplayOrder = 1, IsActive = true },
            new() { Name = "İşlemci", Slug = "islemci", ParentCategoryId = mainCategories[0].Id, DisplayOrder = 2, IsActive = true },
            new() { Name = "Anakart", Slug = "anakart", ParentCategoryId = mainCategories[0].Id, DisplayOrder = 3, IsActive = true },
            new() { Name = "RAM", Slug = "ram", ParentCategoryId = mainCategories[0].Id, DisplayOrder = 4, IsActive = true },
            new() { Name = "SSD & Depolama", Slug = "ssd-depolama", ParentCategoryId = mainCategories[0].Id, DisplayOrder = 5, IsActive = true },
            new() { Name = "Gaming Mouse", Slug = "gaming-mouse", ParentCategoryId = mainCategories[1].Id, DisplayOrder = 1, IsActive = true },
            new() { Name = "Gaming Klavye", Slug = "gaming-klavye", ParentCategoryId = mainCategories[1].Id, DisplayOrder = 2, IsActive = true },
            new() { Name = "Gaming Kulaklık", Slug = "gaming-kulaklik", ParentCategoryId = mainCategories[1].Id, DisplayOrder = 3, IsActive = true },
            new() { Name = "Mouse Pad", Slug = "mouse-pad", ParentCategoryId = mainCategories[1].Id, DisplayOrder = 4, IsActive = true }
        };

        context.Categories.AddRange(subCategories);
        context.SaveChanges();

        // 50 ürün
        var products = new List<Product>
        {
            // Ekran Kartları (5 adet)
            new() { Name = "NVIDIA GeForce RTX 4090", Slug = "nvidia-rtx-4090", SKU = "GPU-4090-001", Price = 54999, CategoryId = subCategories[0].Id, BrandId = brands[9].Id, StockQuantity = 8, IsFeatured = true, IsActive = true, 
                Description = "24GB GDDR6X bellekli, 4K oyun performansı için en üst seviye ekran kartı. Ray tracing ve DLSS 3 desteği." },
            new() { Name = "NVIDIA GeForce RTX 4080", Slug = "nvidia-rtx-4080", SKU = "GPU-4080-001", Price = 39999, CategoryId = subCategories[0].Id, BrandId = brands[9].Id, StockQuantity = 12, IsFeatured = true, IsActive = true,
                Description = "16GB GDDR6X bellekli güçlü ekran kartı. 4K gaming ve ray tracing performansı." },
            new() { Name = "AMD Radeon RX 7900 XTX", Slug = "amd-rx-7900-xtx", SKU = "GPU-7900-001", Price = 34999, OldPrice = 37999, CategoryId = subCategories[0].Id, BrandId = brands[8].Id, StockQuantity = 15, IsFeatured = true, IsActive = true,
                Description = "24GB GDDR6 bellekli AMD'nin amiral gemisi ekran kartı. Yüksek FPS ve ray tracing desteği." },
            new() { Name = "NVIDIA GeForce RTX 4070 Ti", Slug = "nvidia-rtx-4070-ti", SKU = "GPU-4070TI-001", Price = 27999, CategoryId = subCategories[0].Id, BrandId = brands[9].Id, StockQuantity = 20, IsActive = true,
                Description = "12GB GDDR6X bellekli, 1440p oyunlar için ideal ekran kartı." },
            new() { Name = "AMD Radeon RX 7800 XT", Slug = "amd-rx-7800-xt", SKU = "GPU-7800-001", Price = 19999, CategoryId = subCategories[0].Id, BrandId = brands[8].Id, StockQuantity = 18, IsActive = true,
                Description = "16GB GDDR6 bellekli, 1440p gaming için mükemmel performans/fiyat dengesi." },
            
            // İşlemciler (5 adet)
            new() { Name = "AMD Ryzen 9 7950X", Slug = "amd-ryzen-9-7950x", SKU = "CPU-7950X-001", Price = 21999, CategoryId = subCategories[1].Id, BrandId = brands[8].Id, StockQuantity = 14, IsFeatured = true, IsActive = true,
                Description = "16 çekirdek, 32 thread. 5.7GHz boost frekansı. Yüksek performanslı işlemci." },
            new() { Name = "Intel Core i9-14900K", Slug = "intel-i9-14900k", SKU = "CPU-14900K-001", Price = 24999, CategoryId = subCategories[1].Id, BrandId = brands[10].Id, StockQuantity = 10, IsFeatured = true, IsActive = true,
                Description = "24 çekirdek (8P+16E), 6.0GHz boost. Gaming ve çoklu görev performansı." },
            new () { Name = "AMD Ryzen 7 7800X3D", Slug = "amd-ryzen-7-7800x3d", SKU = "CPU-7800X3D-001", Price = 16999, OldPrice = 18499, CategoryId = subCategories[1].Id, BrandId = brands[8].Id, StockQuantity = 22, IsFeatured = true, IsActive = true,
                Description = "8 çekirdek, 3D V-Cache teknolojisi. Gaming performansında zirve." },
            new() { Name = "Intel Core i7-14700K", Slug = "intel-i7-14700k", SKU = "CPU-14700K-001", Price = 17999, CategoryId = subCategories[1].Id, BrandId = brands[10].Id, StockQuantity = 16, IsActive = true,
                Description = "20 çekirdek (8P+12E), 5.6GHz boost. Üst seviye gaming işlemcisi." },
            new() { Name = "AMD Ryzen 5 7600X", Slug = "amd-ryzen-5-7600x", SKU = "CPU-7600X-001", Price = 9999, CategoryId = subCategories[1].Id, BrandId = brands[8].Id, StockQuantity = 25, IsActive = true,
                Description = "6 çekirdek, 12 thread. 5.3GHz boost. Giriş seviye gaming için ideal." },

            // Gaming Mouse (5 adet)
            new() { Name = "Logitech G Pro X Superlight", Slug = "logitech-g-pro-x-superlight", SKU = "MOUSE-GPRO-001", Price = 3299, CategoryId = subCategories[5].Id, BrandId = brands[0].Id, StockQuantity = 45, IsFeatured = true, IsActive = true,
                Description = "63 gram ultra hafif, 25K sensör. Profesyonel oyuncular için wireless gaming mouse." },
            new() { Name = "Razer DeathAdder V3 Pro", Slug = "razer-deathadder-v3-pro", SKU = "MOUSE-DA3-001", Price = 4199, CategoryId = subCategories[5].Id, BrandId = brands[1].Id, StockQuantity = 38, IsFeatured = true, IsActive = true,
                Description = "30K sensör, ergonomik tasarım, 90 saat pil ömrü. Wireless gaming mouse." },
            new() { Name = "Logitech G502 HERO", Slug = "logitech-g502-hero", SKU = "MOUSE-G502-001", Price = 1899, OldPrice = 2199, CategoryId = subCategories[5].Id, BrandId = brands[0].Id, StockQuantity = 52, IsActive = true,
                Description = "25K sensör, ayarlanabilir ağırlık sistemi, 11 programlanabilir tuş." },
            new() { Name = "Razer Viper V3 HyperSpeed", Slug = "razer-viper-v3-hyperspeed", SKU = "MOUSE-VIPER3-001", Price = 2899, CategoryId = subCategories[5].Id, BrandId = brands[1].Id, StockQuantity = 41, IsActive = true,
                Description = "30K sensör, simetrik tasarım, HyperSpeed wireless teknoloji." },
            new() { Name = "Corsair Dark Core RGB Pro", Slug = "corsair-dark-core-rgb-pro", SKU = "MOUSE-DARK-001", Price = 2499, CategoryId = subCategories[5].Id, BrandId = brands[2].Id, StockQuantity = 35, IsActive = true,
                Description = "18K sensör, Qi wireless şarj, çift bağlantı modu (2.4GHz/Bluetooth)." },

            // Gaming Klavye (5 adet)
            new() { Name = "Corsair K70 RGB TKL", Slug = "corsair-k70-rgb-tkl", SKU = "KB-K70TKL-001", Price = 4299, CategoryId = subCategories[6].Id, BrandId = brands[2].Id, StockQuantity = 28, IsFeatured = true, IsActive = true,
                Description = "Cherry MX Red switch, alüminyum kasa, tenkeyless tasarım, per-key RGB." },
            new() { Name = "Razer BlackWidow V4 Pro", Slug = "razer-blackwidow-v4-pro", SKU = "KB-BW4-001", Price = 5499, CategoryId = subCategories[6].Id, BrandId = brands[1].Id, StockQuantity = 22, IsFeatured = true, IsActive = true,
                Description = "Razer Green Mechanical switch, komut çevirici, PBT keycaps." },
            new() { Name = "Logitech G915 TKL", Slug = "logitech-g915-tkl", SKU = "KB-G915TKL-001", Price = 4799, CategoryId = subCategories[6].Id, BrandId = brands[0].Id, StockQuantity = 19, IsActive = true,
                Description = "GL Tactile switch, ultra ince tasarım, wireless, RGB backlighting." },
            new() { Name = "SteelSeries Apex Pro TKL", Slug = "steelseries-apex-pro-tkl", SKU = "KB-APEXTKL-001", Price = 4199, OldPrice = 4599, CategoryId = subCategories[6].Id, BrandId = brands[3].Id, StockQuantity = 26, IsActive = true,
                Description = "OmniPoint ayarlanabilir switch, OLED ekran, manyetik sensör." },
            new() { Name = "HyperX Alloy Origins Core", Slug = "hyperx-alloy-origins-core", SKU = "KB-ALLOY-001", Price = 2299, CategoryId = subCategories[6].Id, BrandId = brands[4].Id, StockQuantity = 34, IsActive = true,
                Description = "HyperX Red Linear switch, kompakt TKL tasarım, dayanıklı kasa." },

            // Gaming Kulaklık (5 adet)
            new() { Name = "SteelSeries Arctis Nova Pro Wireless", Slug = "steelseries-arctis-nova-pro-wireless", SKU = "HS-NOVA-001", Price = 8999, CategoryId = subCategories[7].Id, BrandId = brands[3].Id, StockQuantity = 15, IsFeatured = true, IsActive = true,
                Description = "Hi-Res Audio sertifikalı, aktif gürültü engelleme, çift batarya sistemi." },
            new() { Name = "Logitech G Pro X 2 Lightspeed", Slug = "logitech-g-pro-x2-lightspeed", SKU = "HS-GPROX2-001", Price = 6499, CategoryId = subCategories[7].Id, BrandId = brands[0].Id, StockQuantity = 24, IsFeatured = true, IsActive = true,
                Description = "50mm GrapheneDrivers, Blue VO!CE mikrofon, 50 saat pil ömrü." },
            new() { Name = "Razer BlackShark V2 Pro", Slug = "razer-blackshark-v2-pro", SKU = "HS-BSV2-001", Price = 4799, CategoryId = subCategories[7].Id, BrandId = brands[1].Id, StockQuantity = 32, IsActive = true,
                Description = "THX Spatial Audio, TriForce 50mm driver, wireless freedom." },
            new() { Name = "HyperX Cloud Alpha Wireless", Slug = "hyperx-cloud-alpha-wireless", SKU = "HS-ALPHA-001", Price = 5299, OldPrice = 5799, CategoryId = subCategories[7].Id, BrandId = brands[4].Id, StockQuantity = 28, IsActive = true,
                Description = "300 saat pil ömrü, Dual Chamber driver, dayanıklı alüminyum çerçeve." },
            new() { Name = "Corsair HS80 RGB Wireless", Slug = "corsair-hs80-rgb-wireless", SKU = "HS-HS80-001", Price = 3799, CategoryId = subCategories[7].Id, BrandId = brands[2].Id, StockQuantity = 36, IsActive = true,
                Description = "Dolby Atmos, omni-directional mikrofon, 20 saat pil ömrü." },

            // Anakartlar (4 adet)
            new() { Name = "ASUS ROG Maximus Z790 Hero", Slug = "asus-rog-maximus-z790-hero", SKU = "MB-Z790-001", Price = 14999, CategoryId = subCategories[2].Id, BrandId = brands[5].Id, StockQuantity = 12, IsFeatured = true, IsActive = true,
                Description = "Intel Z790 chipset, DDR5 support, PCIe 5.0, WiFi 6E." },
            new() { Name = "MSI MAG X670E Tomahawk", Slug = "msi-mag-x670e-tomahawk", SKU = "MB-X670-001", Price = 11999, CategoryId = subCategories[2].Id, BrandId = brands[6].Id, StockQuantity = 16, IsFeatured = true, IsActive = true,
                Description = "AMD X670E chipset, DDR5, PCIe 5.0, güçlü VRM tasarımı." },
            new() { Name = "Gigabyte B650 AORUS Elite AX", Slug = "gigabyte-b650-aorus-elite-ax", SKU = "MB-B650-001", Price = 7999, CategoryId = subCategories[2].Id, BrandId = brands[7].Id, StockQuantity = 21, IsActive = true,
                Description = "AMD B650 chipset, DDR5, WiFi 6E, mükemmel fiyat/performans." },
            new() { Name = "ASUS TUF Gaming B760M-Plus", Slug = "asus-tuf-b760m-plus", SKU = "MB-B760-001", Price = 5499, OldPrice = 5999, CategoryId = subCategories[2].Id, BrandId = brands[5].Id, StockQuantity = 24, IsActive = true,
                Description = "Intel B760, DDR5, Micro-ATX, askeri sınıf bileşenler." },

            // RAM (3 adet)
            new() { Name = "Corsair Vengeance DDR5 32GB 6000MHz", Slug = "corsair-vengeance-ddr5-32gb-6000", SKU = "RAM-VENG-001", Price = 4799, CategoryId = subCategories[3].Id, BrandId = brands[2].Id, StockQuantity = 42, IsFeatured = true, IsActive = true,
                Description = "32GB (2x16GB) DDR5, 6000MHz, CL30, Intel XMP 3.0, yüksek performans." },
            new() { Name = "G.Skill Trident Z5 RGB 32GB 6400MHz", Slug = "gskill-trident-z5-32gb-6400", SKU = "RAM-TZ5-001", Price = 5299, CategoryId = subCategories[3].Id, BrandId = brands[0].Id, StockQuantity = 36, IsActive = true,
                Description = "32GB DDR5, 6400MHz CL32, RGB aydınlatma, yüksek overclock potansiyeli." },
            new() { Name = "Kingston Fury Beast DDR5 32GB 5600MHz", Slug = "kingston-fury-beast-32gb-5600", SKU = "RAM-FURY-001", Price = 3999, OldPrice = 4299, CategoryId = subCategories[3].Id, BrandId = brands[4].Id, StockQuantity = 48, IsActive = true,
                Description = "32GB DDR5, 5600MHz CL36, Intel XMP 3.0, uygun fiyatlı performans." },

            // SSD (3 adet)
            new() { Name = "Samsung 990 Pro 2TB NVMe SSD", Slug = "samsung-990-pro-2tb", SKU = "SSD-990P-001", Price = 6999, CategoryId = subCategories[4].Id, BrandId = brands[11].Id, StockQuantity = 28, IsFeatured = true, IsActive = true,
                Description = "2TB PCIe 4.0, 7450MB/s okuma, V-NAND teknolojisi, 5 yıl garanti." },
            new() { Name = "WD Black SN850X 2TB NVMe SSD", Slug = "wd-black-sn850x-2tb", SKU = "SSD-SN850-001", Price = 6499, CategoryId = subCategories[4].Id, BrandId = brands[13].Id, StockQuantity = 32, IsActive = true,
                Description = "2TB PCIe 4.0, 7300MB/s okuma, PS5 uyumlu, Game Mode 2.0." },
            new() { Name = "Crucial P5 Plus 1TB NVMe SSD", Slug = "crucial-p5-plus-1tb", SKU = "SSD-P5P-001", Price = 2999, OldPrice = 3299, CategoryId = subCategories[4].Id, BrandId = brands[13].Id, StockQuantity = 41, IsActive = true,
                Description = "1TB PCIe 4.0, 6600MB/s okuma, uygun fiyat, güvenilir performans." },

            // Monitörler (4 adet)
            new() { Name = "ASUS ROG Swift PG27AQDM", Slug = "asus-rog-swift-pg27aqdm", SKU = "MON-PG27-001", Price = 28999, CategoryId = mainCategories[3].Id, BrandId = brands[5].Id, StockQuantity = 8, IsFeatured = true, IsActive = true,
                Description = "27 inch 1440p OLED, 240Hz, 0.03ms, G-SYNC, HDR400. Gaming için mükemmel." },
            new() { Name = "LG UltraGear 27GP950-B", Slug = "lg-ultragear-27gp950", SKU = "MON-27GP-001", Price = 19999, CategoryId = mainCategories[3].Id, BrandId = brands[12].Id, StockQuantity = 14, IsFeatured = true, IsActive = true,
                Description = "27 inch 4K IPS, 144Hz, 1ms, HDMI 2.1, HDR600, konsol uyumlu." },
            new() { Name = "Samsung Odyssey G7 32 inch", Slug = "samsung-odyssey-g7-32", SKU = "MON-G732-001", Price = 14999, CategoryId = mainCategories[3].Id, BrandId = brands[11].Id, StockQuantity = 17, IsActive = true,
                Description = "32 inch 1440p VA, 240Hz, 1ms, 1000R eğri ekran, G-SYNC." },
            new() { Name = "Dell S2722DGM", Slug = "dell-s2722dgm", SKU = "MON-S27-001", Price = 8999, OldPrice = 9999, CategoryId = mainCategories[3].Id, BrandId = brands[13].Id, StockQuantity = 22, IsActive = true,
                Description = "27 inch 1440p VA, 165Hz, 1ms, FreeSync Premium, eğri tasarım." },

            // Laptop (3 adet)
            new() { Name = "ASUS ROG Strix G16 (2024)", Slug = "asus-rog-strix-g16-2024", SKU = "LAP-G16-001", Price = 54999, CategoryId = mainCategories[2].Id, BrandId = brands[5].Id, StockQuantity = 6, IsFeatured = true, IsActive = true,
                Description = "Intel i9-14900HX, RTX 4070, 16GB DDR5, 1TB SSD, 16 inch 240Hz QHD." },
            new() { Name = "MSI Katana 15 B13V", Slug = "msi-katana-15-b13v", SKU = "LAP-KAT15-001", Price = 32999, CategoryId = mainCategories[2].Id, BrandId = brands[6].Id, StockQuantity = 11, IsActive = true,
                Description = "Intel i7-13620H, RTX 4060, 16GB DDR5, 512GB SSD, 15.6 inch 144Hz." },
            new() { Name = "Gigabyte AORUS 17 XE5", Slug = "gigabyte-aorus-17-xe5", SKU = "LAP-A17-001", Price = 64999, CategoryId = mainCategories[2].Id, BrandId = brands[7].Id, StockQuantity = 4, IsFeatured = true, IsActive = true,
                Description = "Intel i9-13900HX, RTX 4070, 32GB DDR5, 1TB SSD, 17.3 inch 360Hz." },

            // Mouse Pad (4 adet)
            new() { Name = "Razer Gigantus V2 XXL", Slug = "razer-gigantus-v2-xxl", SKU = "PAD-GIGV2-001", Price = 799, CategoryId = subCategories[8].Id, BrandId = brands[1].Id, StockQuantity = 68, IsActive = true,
                Description = "940x410mm, tekstil yüzey, kaymaz taban, geniş alan." },
            new() { Name = "Logitech G840 XL", Slug = "logitech-g840-xl", SKU = "PAD-G840-001", Price = 999, CategoryId = subCategories[8].Id, BrandId = brands[0].Id, StockQuantity = 54, IsActive = true,
                Description = "900x400mm, yumuşak kumaş yüzey, tutarlı performans." },
            new() { Name = "Corsair MM300 Extended", Slug = "corsair-mm300-extended", SKU = "PAD-MM300-001", Price = 699, OldPrice = 799, CategoryId = subCategories[8].Id, BrandId = brands[2].Id, StockQuantity = 72, IsActive = true,
                Description = "930x300mm, optimize edilmiş yüzey, esnek kauçuk taban." },
            new() { Name = "SteelSeries QcK Heavy XXL", Slug = "steelseries-qck-heavy-xxl", SKU = "PAD-QCK-001", Price = 1199, CategoryId = subCategories[8].Id, BrandId = brands[3].Id, StockQuantity = 46, IsActive = true,
                Description = "900x400mm, kalın 6mm kumaş, premium kalite." },

            // Gaming Koltuk (4 adet)
            new() { Name = "Corsair T3 Rush Gaming Chair", Slug = "corsair-t3-rush-gaming-chair", SKU = "CHAIR-T3-001", Price = 7999, CategoryId = mainCategories[4].Id, BrandId = brands[2].Id, StockQuantity = 8, IsFeatured = true, IsActive = true,
                Description = "Yumuşak kumaş kaplama, 4D kolçak, lomber destek, 120kg kapasite." },
            new() { Name = "Razer Iskur V2", Slug = "razer-iskur-v2", SKU = "CHAIR-ISK-001", Price = 12999, CategoryId = mainCategories[4].Id, BrandId = brands[1].Id, StockQuantity = 5, IsFeatured = true, IsActive = true,
                Description = "Deri kaplama, entegre lomber destek, 4D kolçak, dayanıklı çelik." },
            new() { Name = "Secretlab Titan Evo 2022", Slug = "secretlab-titan-evo-2022", SKU = "CHAIR-TIT-001", Price = 14999, CategoryId = mainCategories[4].Id, BrandId = brands[3].Id, StockQuantity = 6, IsActive = true,
                Description = "NEO Hybrid kumaş, manyetik yastık, 4 yönlü kolçak, premium kalite." },
            new() { Name = "Asus ROG Destrier Ergo Gaming Chair", Slug = "asus-rog-destrier-ergo", SKU = "CHAIR-DEST-001", Price = 9999, OldPrice = 11499, CategoryId = mainCategories[4].Id, BrandId = brands[5].Id, StockQuantity = 7, IsActive = true,
                Description = "Ergonomik tasarım, PU deri, 3D kolçak, RGB aydınlatma." }
        };

        context.Products.AddRange(products);
        context.SaveChanges();

        // Ürün resimleri - SaveChanges'ten sonra ID'ler atandı, şimdi resimleri ekleyelim
        var savedProducts = context.Products.ToList();
        var productImages = new List<ProductImage>();
        
        foreach (var product in savedProducts)
        {
            productImages.Add(new ProductImage
            {
                ProductId = product.Id,
                ImageUrl = $"https://placehold.co/600x400/1a1a2e/0ea5e9?text={Uri.EscapeDataString(product.Name.Substring(0, Math.Min(15, product.Name.Length)))}",
                AltText = product.Name,
                IsPrimary = true,
                DisplayOrder = 1
            });
        }

        context.ProductImages.AddRange(productImages);
        context.SaveChanges();
    }

    public static async Task SeedUsersAsync(
        Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager,
        Microsoft.AspNetCore.Identity.RoleManager<ApplicationRole> roleManager)
    {
        // Create roles if they don't exist
        string[] roleNames = { "Admin", "User" };
        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new ApplicationRole { Name = roleName });
            }
        }

        // Create admin user
        if (await userManager.FindByEmailAsync("admin@admin.com") == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = "admin@admin.com",
                Email = "admin@admin.com",
                FirstName = "Admin",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // Create test user
        if (await userManager.FindByEmailAsync("test@test.com") == null)
        {
            var testUser = new ApplicationUser
            {
                UserName = "test@test.com",
                Email = "test@test.com",
                FirstName = "Test",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(testUser, "Test123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(testUser, "User");
            }
        }
    }
}
