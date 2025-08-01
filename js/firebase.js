// Firebase yapılandırması
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
export async function addService(title, text, textStyle, description, details, image = null) {
  try {
    await initializeFirebase();
    
    const serviceData = {
      title: title,
      text: text,
      textStyle: textStyle,
      description: description,
      details: details,
      createdAt: new Date()
    };
    
    if (image) {
      serviceData.image = image;
    }
    
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