export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  objectives: string[];
  technologies: string[];
  results: string[];
  link?: string;
  githubLink?: string;
}

export const projects: Project[] = [
  {
    id: "gunes-enerjisi-santrali",
    title: "Osmaniye/Toprakkale Güneş Enerjisi Santrali Projesi",
    description: "Osmaniye'nin Toprakkale ilçesinde kurulumu planlanan 240 kWp gücünde şebeke bağlantılı güneş enerjisi santrali projesi.",
    longDescription: "Osmaniye ili, Toprakkale ilçesinde (koordinatlar: 36.99°K enlem, 36.11°D boylam), Organize Sanayi Bölgesi yakınında kurulumu planlanan bu proje, 1.135 m² alan üzerine inşa edilecek 240 kWp gücünde bir on-grid (şebeke bağlantılı) güneş enerji santralini kapsamaktadır. Direkt şebekeye enerji satışı hedeflenen sistemin yıllık üretim kapasitesi 365 MWh, işletim ömrü ise 30 yıl olarak öngörülmektedir. Proje, hem ekonomik hem de çevresel sürdürülebilirliğe katkı sağlamayı amaçlamaktadır.",
    image: "/toprakkale-ges.jpg",
    tags: ["Yenilenebilir Enerji", "Güneş Enerjisi", "Sürdürülebilirlik"],
    objectives: [
      "365 MWh yıllık enerji üretim kapasitesi",
      "Şebekeye direkt enerji satışı",
      "30 yıl işletim ömrü hedefi",
      "Çevresel sürdürülebilirliğe katkı"
    ],
    technologies: [
      "On-grid Bağlantı Sistemi",
      "Fotovoltaik Paneller",
      "Şebeke İnvertörleri",
      "İzleme ve Kontrol Sistemleri"
    ],
    results: [
      "Yıllık 4.220 ton CO₂ emisyon azaltımı",
      "365 MWh yıllık enerji üretimi",
      "1.135 m² alan değerlendirmesi"
    ],
    link: "/toprakkale-ges-raporu.pdf"
  },
  {
    id: "fizik-simulasyon",
    title: "Fizik Simülasyon Projesi",
    description: "MATLAB kullanarak geliştirilmiş, parçacık fiziği simülasyonu. Kuantum sistemlerinin davranışlarını modelliyor.",
    longDescription: "Bu proje, kuantum mekaniksel sistemlerin davranışlarını simüle etmek için geliştirilmiş kapsamlı bir yazılım çalışmasıdır. MATLAB kullanılarak oluşturulan bu simülasyon, parçacıkların kuantum davranışlarını modelleyerek, teorik fizik çalışmalarına katkı sağlamayı amaçlamaktadır.",
    image: "/placeholder.jpg",
    tags: ["MATLAB", "Fizik", "Simülasyon"],
    objectives: [
      "Kuantum sistemlerinin temel davranışlarını modellemek",
      "Parçacık fiziği deneylerini simüle etmek",
      "Teorik hesaplamaları görselleştirmek"
    ],
    technologies: [
      "MATLAB R2023a",
      "Simulink",
      "Quantum Toolbox",
      "Parallel Computing Toolbox"
    ],
    results: [
      "Başarılı kuantum sistem simülasyonları",
      "Yüksek doğrulukta hesaplamalar",
      "Görsel ve interaktif sonuçlar"
    ],
    githubLink: "https://github.com/yourusername/physics-sim"
  },
  {
    id: "veri-analizi",
    title: "Veri Analizi Çalışması",
    description: "Python ile deneysel verilerin analizi ve görselleştirilmesi. İstatistiksel yöntemler kullanılarak sonuçların değerlendirilmesi.",
    longDescription: "Laboratuvar deneylerinden elde edilen verilerin kapsamlı analizi için geliştirilen bu proje, Python programlama dili ve çeşitli veri analizi kütüphaneleri kullanılarak oluşturulmuştur. Proje, deneysel sonuçların istatistiksel değerlendirmesini ve görsel sunumunu içermektedir.",
    image: "/placeholder.jpg",
    tags: ["Python", "Veri Analizi", "İstatistik"],
    objectives: [
      "Deneysel verilerin sistematik analizi",
      "İstatistiksel modellerin uygulanması",
      "Sonuçların görselleştirilmesi"
    ],
    technologies: [
      "Python 3.9",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "SciPy"
    ],
    results: [
      "Detaylı veri analiz raporları",
      "İnteraktif veri görselleştirmeleri",
      "İstatistiksel analiz sonuçları"
    ],
    githubLink: "https://github.com/yourusername/data-analysis"
  },
  {
    id: "lab-otomasyon",
    title: "Laboratuvar Otomasyon Sistemi",
    description: "Deney düzeneğinin otomatik kontrolü ve veri toplama sistemi. Arduino ve Python kullanılarak geliştirildi.",
    longDescription: "Bu proje, fizik laboratuvarındaki deney düzeneklerinin otomatik kontrolünü ve veri toplama işlemlerini otomatikleştirmek için geliştirilmiş bir sistemdir. Arduino mikrodenetleyici ve Python programlama dili kullanılarak, deney süreçlerinin otomasyonu sağlanmıştır.",
    image: "/placeholder.jpg",
    tags: ["Arduino", "Python", "Otomasyon"],
    objectives: [
      "Deney süreçlerinin otomatikleştirilmesi",
      "Gerçek zamanlı veri toplama",
      "Deney kontrolünün optimize edilmesi"
    ],
    technologies: [
      "Arduino IDE",
      "Python 3.9",
      "PySerial",
      "Qt Framework",
      "SQLite"
    ],
    results: [
      "Tam otomatik deney kontrolü",
      "Hassas veri toplama sistemi",
      "Kullanıcı dostu arayüz"
    ],
    githubLink: "https://github.com/yourusername/lab-automation"
  },
  {
    id: "takim-bulma-platformu",
    title: "Takım Bulma ve Proje İşbirliği Platformu",
    description: "Proje ekipleri ile bireyleri tek bir çatı altında buluşturan web tabanlı platform.",
    longDescription: "Günümüzde proje tabanlı çalışma ve iş birlikleri, hem bireylerin kariyerlerini şekillendirmesi hem de şirketlerin inovasyon süreçleri için kritik bir rol oynuyor. Ancak doğru ekibi kurmak veya yeteneklerini sergileyecek bir proje bulmak, çoğu zaman zaman alıcı ve karmaşık bir sürece dönüşebiliyor. İşte tam da bu noktada, Takım Bulma ve Proje İşbirliği Platformu, proje ekipleri ile bireyleri tek bir çatı altında buluşturarak bu süreci kolaylaştırmayı hedefliyorum.",
    image: "/placeholder.jpg",
    tags: ["Web Geliştirme", "İş Birliği", "Platform"],
    objectives: [
      "Proje ekipleri ve bireyler arasında eşleşme sağlamak",
      "İş birliği süreçlerini kolaylaştırmak",
      "Yenilikçi projelerin geliştirilmesine katkıda bulunmak"
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL"
    ],
    results: [
      "Kullanıcı dostu arayüz",
      "Etkili eşleştirme sistemi",
      "Güvenli iletişim altyapısı"
    ],
    githubLink: "https://github.com/yourusername/team-finder"
  }
];