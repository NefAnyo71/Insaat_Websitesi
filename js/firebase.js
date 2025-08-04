// Firebase yapılandırması
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// API URL - Vercel proxy server adresinizi buraya yazın
const API_URL = 'https://safe-api-three.vercel.app';

let app, db;
let isInitialized = false;

// Firebase config'i API'den al ve başlat
async function initializeFirebase() {
  if (isInitialized) return;
  
  try {
    console.log('Firebase config alınıyor...');
    const response = await fetch(`${API_URL}/api/config`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      app = initializeApp(result.data);
      db = getFirestore(app);
      isInitialized = true;
      console.log('Firebase başarıyla başlatıldı');
    } else {
      throw new Error('Config formatı hatalı');
    }
  } catch (error) {
    console.error('Firebase başlatma hatası:', error);
    throw error;
  }
}

// Hizmet ekleme
export async function addService(title, text, textStyle, description, details, images = [], instagram = '', whatsapp = '', gmail = '') {
  try {
    await initializeFirebase();
    
    const serviceData = {
      title: title,
      text: text,
      textStyle: textStyle,
      description: description,
      details: details,
      images: images || [],
      instagram: instagram || '',
      whatsapp: whatsapp || '',
      gmail: gmail || '',
      createdAt: new Date()
    };
    
    await addDoc(collection(db, "services"), serviceData);
    return true;
  } catch (error) {
    console.error("Hizmet eklenirken hata:", error);
    return false;
  }
}

// Hizmetleri getirme
export async function getServices() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "services"));
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });
    return services;
  } catch (error) {
    console.error("Hizmetler getirilirken hata:", error);
    return [];
  }
}

// Proje ekleme
export async function addProject(title, text, textStyle, category, description, image) {
  try {
    await initializeFirebase();
    
    await addDoc(collection(db, "projects"), {
      title: title,
      text: text,
      textStyle: textStyle,
      category: category,
      description: description,
      image: image,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Proje eklenirken hata:", error);
    return false;
  }
}

// Projeleri getirme
export async function getProjects() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (error) {
    console.error("Projeler getirilirken hata:", error);
    return [];
  }
}

// Çalışan ekleme
export async function addEmployee(name, text, textStyle, position, image, experience) {
  try {
    await initializeFirebase();
    
    await addDoc(collection(db, "employees"), {
      name: name,
      text: text,
      textStyle: textStyle,
      position: position,
      image: image,
      experience: experience,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Çalışan eklenirken hata:", error);
    return false;
  }
}

// Çalışanları getirme
export async function getEmployees() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "employees"));
    const employees = [];
    querySnapshot.forEach((doc) => {
      employees.push({ id: doc.id, ...doc.data() });
    });
    return employees;
  } catch (error) {
    console.error("Çalışanlar getirilirken hata:", error);
    return [];
  }
}



// Referans ekleme
export async function addReference(name, text, textStyle, sector, image, description) {
  try {
    await initializeFirebase();
    
    await addDoc(collection(db, "references"), {
      name: name,
      text: text,
      textStyle: textStyle,
      sector: sector,
      image: image,
      description: description,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Referans eklenirken hata:", error);
    return false;
  }
}

// Referansları getirme
export async function getReferences() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "references"));
    const references = [];
    querySnapshot.forEach((doc) => {
      references.push({ id: doc.id, ...doc.data() });
    });
    return references;
  } catch (error) {
    console.error("Referanslar getirilirken hata:", error);
    return [];
  }
}

// Silme fonksiyonu
export async function deleteItem(collectionName, id) {
  try {
    await initializeFirebase();
    
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    console.error("Silme hatası:", error);
    return false;
  }
}

// Admin giriş kontrolü - Firebase'den
export async function checkAdminLogin(username, password) {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "admin"));
    let isValid = false;
    
    querySnapshot.forEach((doc) => {
      const adminData = doc.data();
      if (adminData.username === username && adminData.password === password) {
        isValid = true;
      }
    });
    
    return isValid;
  } catch (error) {
    console.error('Giriş kontrol hatası:', error);
    return false;
  }
}

// Admin kullanıcılarını getirme
export async function getAdmins() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "admin"));
    const admins = [];
    querySnapshot.forEach((doc) => {
      admins.push({ id: doc.id, ...doc.data() });
    });
    return admins;
  } catch (error) {
    console.error("Admin kullanıcılar getirilirken hata:", error);
    return [];
  }
}

// Admin ekleme
export async function addAdmin(username, password) {
  try {
    await initializeFirebase();
    
    await addDoc(collection(db, "admin"), {
      username: username,
      password: password,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Admin eklenirken hata:", error);
    return false;
  }
}

// Admin güncelleme
export async function updateAdmin(id, username, password) {
  try {
    await initializeFirebase();
    
    const adminRef = doc(db, "admin", id);
    await updateDoc(adminRef, {
      username: username,
      password: password,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Admin güncellenirken hata:", error);
    return false;
  }
}



// İletişim ekleme
export async function addContact(type, value, label) {
  try {
    await initializeFirebase();
    
    await addDoc(collection(db, "contacts"), {
      type: type,
      value: value,
      label: label,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("İletişim eklenirken hata:", error);
    return false;
  }
}

// İletişim bilgilerini getirme
export async function getContacts() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "contacts"));
    const contacts = [];
    querySnapshot.forEach((doc) => {
      contacts.push({ id: doc.id, ...doc.data() });
    });
    return contacts;
  } catch (error) {
    console.error("İletişim bilgileri getirilirken hata:", error);
    return [];
  }
}

// İletişim güncelleme
export async function updateContact(id, data) {
  try {
    await initializeFirebase();
    
    const contactRef = doc(db, "contacts", id);
    await updateDoc(contactRef, {
      ...data,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("İletişim güncellenirken hata:", error);
    return false;
  }
}

// Site adı ekleme/güncelleme
export async function setSiteName(siteName) {
  try {
    await initializeFirebase();
    
    // Önce mevcut kayıtları sil
    const querySnapshot = await getDocs(collection(db, "sitename"));
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
    
    // Yeni kayıt ekle
    await addDoc(collection(db, "sitename"), {
      name: siteName,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Site adı kaydedilirken hata:", error);
    return false;
  }
}

// Site adını getirme
export async function getSiteName() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "sitename"));
    let siteName = "KEF YAPI"; // Varsayılan
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      siteName = data.name;
    });
    
    return siteName;
  } catch (error) {
    console.error("Site adı getirilirken hata:", error);
    return "İnşaat WebSitesi";
  }
}

// Favicon ekleme/güncelleme
export async function setFavicon(faviconUrl) {
  try {
    await initializeFirebase();
    
    await addDoc(collection(db, "favicon"), {
      url: faviconUrl,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Favicon kaydedilirken hata:", error);
    return false;
  }
}

// Favicon getirme
export async function getFavicon() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "favicon"));
    let faviconUrl = null;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      faviconUrl = data.url;
    });
    
    return faviconUrl;
  } catch (error) {
    console.error("Favicon getirilirken hata:", error);
    return null;
  }
}

// Deneyim bilgisi ekleme/güncelleme
export async function setExperience(experienceData) {
  try {
    await initializeFirebase();
    
    await addDoc(collection(db, "experience"), {
      years: experienceData.years,
      title: experienceData.title,
      description: experienceData.description,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Deneyim bilgisi kaydedilirken hata:", error);
    return false;
  }
}

// Deneyim bilgisini getirme
export async function getExperience() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "experience"));
    let experience = {
      years: "25",
      title: "Deneyim & Güven",
      description: "Çeyrek asırlık tecrübemizle her projede mükemmellik"
    }; // Varsayılan değerler
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      experience = {
        years: data.years,
        title: data.title,
        description: data.description
      };
    });
    
    return experience;
  } catch (error) {
    console.error("Deneyim bilgisi getirilirken hata:", error);
    return {
      years: "25",
      title: "Deneyim & Güven",
      description: "Çeyrek asırlık tecrübemizle her projede mükemmellik"
    };
  }
}

// Hero görsel ekleme/güncelleme
export async function setHeroImage(imageUrl) {
  try {
    await initializeFirebase();
    
    await addDoc(collection(db, "heroimage"), {
      url: imageUrl,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Hero görsel kaydedilirken hata:", error);
    return false;
  }
}

// Hero görsel getirme
export async function getHeroImage() {
  try {
    await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "heroimage"));
    let heroImageUrl = null;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      heroImageUrl = data.url;
    });
    
    return heroImageUrl;
  } catch (error) {
    console.error("Hero görsel getirilirken hata:", error);
    return null;
  }
}

// Hero görseli varsayılana sıfırla
export async function resetHeroImage() {
  try {
    await initializeFirebase();
    
    await addDoc(collection(db, "heroimage"), {
      url: "default",
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Hero görsel sıfırlanırken hata:", error);
    return false;
  }
}