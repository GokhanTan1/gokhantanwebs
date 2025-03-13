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
    id: "fizik-simulasyon",
    title: "Fizik Simülasyon Projesi",
    description: "MATLAB kullanarak geliştirilmiş, parçacık fiziği simülasyonu. Kuantum sistemlerinin davranışlarını modelliyor.",
    longDescription: "Bu proje, kuantum mekaniksel sistemlerin davranışlarını simüle etmek için geliştirilmiş kapsamlı bir yazılım çalışmasıdır. MATLAB kullanılarak oluşturulan bu simülasyon, parçacıkların kuantum davranışlarını modelleyerek, teorik fizik çalışmalarına katkı sağlamayı amaçlamaktadır.",
    image: "/project1.jpg",
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
    image: "/project2.jpg",
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
    image: "/project3.jpg",
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
  }
]; 