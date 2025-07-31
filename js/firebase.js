// Firebase yapılandırması
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// API URL - Vercel'deki proxy server adresinizi buraya yazın
const API_URL = 'https://safe-api-three.vercel.app/';

let app, db;

// Firebase config'i API'den al ve başlat
async function initializeFirebase() {
  try {
    const response = await fetch(`${API_URL}/api/config`);
    const result = await response.json();
    
    if (result.status === 'success') {
      app = initializeApp(result.data);
      db = getFirestore(app);
      console.log('Firebase başarıyla başlatıldı');
    } else {
      throw new Error('Config alınamadı');
    }
  } catch (error) {
    console.error('Firebase başlatma hatası:', error);
    // Fallback: Yerel config kullan
    const fallbackConfig = {
      apiKey: "demo-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo.appspot.com",
      messagingSenderId: "123456789",
      appId: "demo-app-id"
    };
    app = initializeApp(fallbackConfig);
    db = getFirestore(app);
  }
}

// Firebase'i başlat
await initializeFirebase();

// Hizmet ekleme
export async function addService(title, text, textStyle, description, image = null) {
  try {
    if (!db) await initializeFirebase();
    
    const serviceData = {
      title: title,
      text: text,
      textStyle: textStyle,
      description: description,
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
    if (!db) await initializeFirebase();
    
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
    if (!db) await initializeFirebase();
    
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
    if (!db) await initializeFirebase();
    
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

// Blog ekleme
export async function addBlog(title, text, textStyle, content, image, author) {
  try {
    if (!db) await initializeFirebase();
    
    await addDoc(collection(db, "blogs"), {
      title: title,
      text: text,
      textStyle: textStyle,
      content: content,
      image: image,
      author: author,
      date: new Date().toLocaleDateString('tr-TR'),
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Blog eklenirken hata:", error);
    return false;
  }
}

// Blogları getirme
export async function getBlogs() {
  try {
    if (!db) await initializeFirebase();
    
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const blogs = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    return blogs;
  } catch (error) {
    console.error("Bloglar getirilirken hata:", error);
    return [];
  }
}

// Çalışan ekleme
export async function addEmployee(name, text, textStyle, position, image, experience) {
  try {
    if (!db) await initializeFirebase();
    
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
    if (!db) await initializeFirebase();
    
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

// Silme fonksiyonu
export async function deleteItem(collectionName, id) {
  try {
    if (!db) await initializeFirebase();
    
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    console.error("Silme hatası:", error);
    return false;
  }
}

// Admin giriş kontrolü
export async function checkAdminLogin(username, password) {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.error('Giriş kontrol hatası:', error);
    return false;
  }
}