import { addService, getServices, addProject, getProjects, addEmployee, getEmployees, addReference, getReferences, deleteItem, checkAdminLogin, getAdmins, addAdmin, updateAdmin, getSiteName, setSiteName, getFavicon, setFavicon, getExperience, setExperience, getHeroImage, setHeroImage, resetHeroImage } from './firebase.js';

// Hizmet ekleme
window.addService = async function() {
  const title = document.getElementById('service-title').value;
  const text = document.getElementById('service-text').value;
  const textStyle = document.getElementById('service-text-style').value;
  const description = document.getElementById('service-desc').value;
  const details = document.getElementById('service-details').value;
  const image = document.getElementById('service-image').value;
  
  if (!title || !text || !description || !details) {
    alert('Lütfen zorunlu alanları doldurun!');
    return;
  }
  
  const success = await addService(title, text, textStyle, description, details, image);
  if (success) {
    alert('Hizmet başarıyla eklendi!');
    document.getElementById('service-title').value = '';
    document.getElementById('service-text').value = '';
    document.getElementById('service-text-style').value = '';
    document.getElementById('service-image').value = '';
    document.getElementById('service-desc').value = '';
    document.getElementById('service-details').value = '';
    document.getElementById('service-preview').style.display = 'none';
    loadServices();
  } else {
    alert('Hizmet eklenirken hata oluştu!');
  }
}

// Hizmet önizleme
window.previewService = function() {
  const title = document.getElementById('service-title').value;
  const text = document.getElementById('service-text').value;
  const textStyle = document.getElementById('service-text-style').value;
  const description = document.getElementById('service-desc').value;
  const image = document.getElementById('service-image').value;
  
  if (!title || !text || !description) {
    alert('Lütfen önizleme için gerekli alanları doldurun!');
    return;
  }
  
  // Önizleme alanını göster
  const preview = document.getElementById('service-preview');
  preview.style.display = 'block';
  
  // Önizleme verilerini güncelle
  document.getElementById('preview-service-title').textContent = title || '';
  document.getElementById('preview-service-desc').textContent = description || '';
  
  const textElement = document.getElementById('preview-text-content');
  textElement.textContent = text || '';
  
  // Metin stilini uygula
  applyTextStyle(textElement, textStyle);
  
  // Eğer resim varsa, arka plan olarak ekle
  const serviceCard = preview.querySelector('.service-card');
  if (image) {
    serviceCard.style.backgroundImage = `linear-gradient(rgba(255, 107, 53, 0.8), rgba(247, 147, 30, 0.8)), url(${image})`;
    serviceCard.style.backgroundSize = 'cover';
    serviceCard.style.backgroundPosition = 'center';
    serviceCard.style.color = 'white';
  } else {
    serviceCard.style.backgroundImage = 'none';
    serviceCard.style.color = '#333';
  }
}

// Metin stili uygulama fonksiyonu
function applyTextStyle(element, style) {
  // Önceki stilleri temizle
  element.className = '';
  element.style.cssText = '';
  
  switch(style) {
    case 'bold':
      element.style.fontWeight = 'bold';
      break;
    case 'italic':
      element.style.fontStyle = 'italic';
      break;
    case 'uppercase':
      element.style.textTransform = 'uppercase';
      element.style.letterSpacing = '2px';
      break;
    case 'gradient':
      element.style.background = 'linear-gradient(45deg, #FF6B35, #F7931E, #FF6B35)';
      element.style.webkitBackgroundClip = 'text';
      element.style.webkitTextFillColor = 'transparent';
      element.style.fontWeight = 'bold';
      break;
    case 'shadow':
      element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
      element.style.fontWeight = 'bold';
      break;
    case 'outline':
      element.style.webkitTextStroke = '2px #FF6B35';
      element.style.webkitTextFillColor = 'transparent';
      element.style.fontWeight = 'bold';
      break;
    case 'modern':
      element.style.fontWeight = '300';
      element.style.letterSpacing = '3px';
      element.style.textTransform = 'uppercase';
      element.style.fontSize = '0.9em';
      break;
  }
}

// Proje ekleme
window.addProject = async function() {
  const title = document.getElementById('project-title').value;
  const text = document.getElementById('project-text').value;
  const textStyle = document.getElementById('project-text-style').value;
  const category = document.getElementById('project-category').value;
  const description = document.getElementById('project-desc').value;
  const image = document.getElementById('project-image').value;
  
  if (!title || !text || !category || !description || !image) {
    alert('Lütfen zorunlu alanları doldurun!');
    return;
  }
  
  const success = await addProject(title, text, textStyle, category, description, image);
  if (success) {
    alert('Proje başarıyla eklendi!');
    document.getElementById('project-title').value = '';
    document.getElementById('project-text').value = '';
    document.getElementById('project-text-style').value = '';
    document.getElementById('project-category').value = '';
    document.getElementById('project-desc').value = '';
    document.getElementById('project-image').value = '';
    loadProjects();
  } else {
    alert('Proje eklenirken hata oluştu!');
  }
}



// Hizmetleri yükleme
async function loadServices() {
  const services = await getServices();
  const container = document.getElementById('services-list');
  container.innerHTML = '';
  
  services.forEach(service => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${service.title || ''}</h4>
      <p>Metin: ${service.text || ''}</p>
      <p>Stil: ${service.textStyle || 'Yok'}</p>
      <p>${service.description || ''}</p>
      <p><strong>Detaylar:</strong> ${(service.details || '').substring(0, 100)}...</p>
      <div class="item-actions">
        <button class="edit-btn" onclick="editService('${service.id}')">Düzenle</button>
        <button class="delete-btn" onclick="deleteService('${service.id}')">Sil</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Projeleri yükleme
async function loadProjects() {
  const projects = await getProjects();
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  
  projects.forEach(project => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${project.title || ''}</h4>
      <p>Metin: ${project.text || ''}</p>
      <p>Kategori: ${project.category || ''}</p>
      <p>${project.description || ''}</p>
      <img src="${project.image || 'https://via.placeholder.com/100x60'}" style="width: 100px; height: 60px; object-fit: cover;">
      <div class="item-actions">
        <button class="edit-btn" onclick="editProject('${project.id}')">Düzenle</button>
        <button class="delete-btn" onclick="deleteProject('${project.id}')">Sil</button>
      </div>
    `;
    container.appendChild(div);
  });
}



// Silme fonksiyonları
window.deleteService = async function(id) {
  if (confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
    const success = await deleteItem('services', id);
    if (success) {
      alert('Hizmet silindi!');
      loadServices();
    }
  }
}

window.deleteProject = async function(id) {
  if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
    const success = await deleteItem('projects', id);
    if (success) {
      alert('Proje silindi!');
      loadProjects();
    }
  }
}



// Çalışan ekleme
window.addEmployee = async function() {
  const name = document.getElementById('employee-name').value;
  const text = document.getElementById('employee-text').value;
  const textStyle = document.getElementById('employee-text-style').value;
  const position = document.getElementById('employee-position').value;
  const experience = document.getElementById('employee-experience').value;
  const image = document.getElementById('employee-image').value;
  
  if (!name || !text || !position || !experience || !image) {
    alert('Lütfen zorunlu alanları doldurun!');
    return;
  }
  
  const success = await addEmployee(name, text, textStyle, position, image, experience);
  if (success) {
    alert('Çalışan başarıyla eklendi!');
    document.getElementById('employee-name').value = '';
    document.getElementById('employee-text').value = '';
    document.getElementById('employee-text-style').value = '';
    document.getElementById('employee-position').value = '';
    document.getElementById('employee-experience').value = '';
    document.getElementById('employee-image').value = '';
    loadEmployees();
  } else {
    alert('Çalışan eklenirken hata oluştu!');
  }
}

// Çalışanları yükleme
async function loadEmployees() {
  const employees = await getEmployees();
  const container = document.getElementById('employees-list');
  container.innerHTML = '';
  
  employees.forEach(employee => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${employee.name || ''}</h4>
      <p>Metin: ${employee.text || ''}</p>
      <p>Pozisyon: ${employee.position || ''}</p>
      <p>Deneyim: ${employee.experience || 0} yıl</p>
      <img src="${employee.image || 'https://via.placeholder.com/100x100'}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;">
      <div class="item-actions">
        <button class="edit-btn" onclick="editEmployee('${employee.id}')">Düzenle</button>
        <button class="delete-btn" onclick="deleteEmployee('${employee.id}')">Sil</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Çalışan silme
window.deleteEmployee = async function(id) {
  if (confirm('Bu çalışanı silmek istediğinizden emin misiniz?')) {
    const success = await deleteItem('employees', id);
    if (success) {
      alert('Çalışan silindi!');
      loadEmployees();
    }
  }
}

// Referans ekleme
window.addReference = async function() {
  const name = document.getElementById('reference-name').value;
  const text = document.getElementById('reference-text').value;
  const textStyle = document.getElementById('reference-text-style').value;
  const sector = document.getElementById('reference-sector').value;
  const image = document.getElementById('reference-image').value;
  const description = document.getElementById('reference-description').value;
  
  if (!name || !text || !sector || !image || !description) {
    alert('Lütfen zorunlu alanları doldurun!');
    return;
  }
  
  const success = await addReference(name, text, textStyle, sector, image, description);
  if (success) {
    alert('Referans başarıyla eklendi!');
    document.getElementById('reference-name').value = '';
    document.getElementById('reference-text').value = '';
    document.getElementById('reference-text-style').value = '';
    document.getElementById('reference-sector').value = '';
    document.getElementById('reference-image').value = '';
    document.getElementById('reference-description').value = '';
    loadReferences();
  } else {
    alert('Referans eklenirken hata oluştu!');
  }
}

// Referansları yükleme
async function loadReferences() {
  const references = await getReferences();
  const container = document.getElementById('references-list');
  container.innerHTML = '';
  
  references.forEach(reference => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${reference.name || ''}</h4>
      <p>Metin: ${reference.text || ''}</p>
      <p>Sektör: ${reference.sector || ''}</p>
      <p>${reference.description || ''}</p>
      <img src="${reference.image || 'https://via.placeholder.com/100x60'}" style="width: 100px; height: 60px; object-fit: cover;">
      <div class="item-actions">
        <button class="edit-btn" onclick="editReference('${reference.id}')">Düzenle</button>
        <button class="delete-btn" onclick="deleteReference('${reference.id}')">Sil</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Referans silme
window.deleteReference = async function(id) {
  if (confirm('Bu referansı silmek istediğinizden emin misiniz?')) {
    const success = await deleteItem('references', id);
    if (success) {
      alert('Referans silindi!');
      loadReferences();
    }
  }
}

// Edit fonksiyonları
window.editService = async function(id) {
  const services = await getServices();
  const service = services.find(s => s.id === id);
  if (service) {
    openEditModal('service', service, id);
  }
}

window.editProject = async function(id) {
  const projects = await getProjects();
  const project = projects.find(p => p.id === id);
  if (project) {
    openEditModal('project', project, id);
  }
}

window.editEmployee = async function(id) {
  const employees = await getEmployees();
  const employee = employees.find(e => e.id === id);
  if (employee) {
    openEditModal('employee', employee, id);
  }
}

window.editReference = async function(id) {
  const references = await getReferences();
  const reference = references.find(r => r.id === id);
  if (reference) {
    openEditModal('reference', reference, id);
  }
}

// Edit modal aç
function openEditModal(type, data, id) {
  let modalContent = '';
  
  if (type === 'service') {
    modalContent = `
      <h2><i class="fas fa-edit"></i> Hizmet Düzenle</h2>
      <div class="edit-form">
        <input type="text" id="edit-service-title" placeholder="Hizmet Adı" value="${data.title || ''}">
        <textarea id="edit-service-desc" placeholder="Hizmet açıklaması...">${data.description || ''}</textarea>
        <textarea id="edit-service-details" placeholder="Detaylı hizmet bilgileri...">${data.details || ''}</textarea>
        <input type="url" id="edit-service-image" placeholder="Hizmet Resim URL" value="${data.image || ''}">
      </div>
      <div class="modal-actions">
        <button class="btn cancel-btn" onclick="closeEditModal()">İptal</button>
        <button class="btn save-btn" onclick="saveEdit('service', '${id}')">Kaydet</button>
      </div>
    `;
  } else if (type === 'project') {
    modalContent = `
      <h2><i class="fas fa-edit"></i> Proje Düzenle</h2>
      <div class="edit-form">
        <input type="text" id="edit-project-title" placeholder="Proje Adı" value="${data.title || ''}">
        <input type="text" id="edit-project-text" placeholder="Kısa Metin" value="${data.text || ''}">
        <select id="edit-project-text-style">
          <option value="">Metin Stili Seçin</option>
          <option value="bold" ${data.textStyle === 'bold' ? 'selected' : ''}>Kalın</option>
          <option value="italic" ${data.textStyle === 'italic' ? 'selected' : ''}>Eğik</option>
          <option value="uppercase" ${data.textStyle === 'uppercase' ? 'selected' : ''}>BÜYÜK HARF</option>
          <option value="gradient" ${data.textStyle === 'gradient' ? 'selected' : ''}>Gradient</option>
          <option value="shadow" ${data.textStyle === 'shadow' ? 'selected' : ''}>Gölgeli</option>
          <option value="outline" ${data.textStyle === 'outline' ? 'selected' : ''}>Konturlu</option>
          <option value="modern" ${data.textStyle === 'modern' ? 'selected' : ''}>Modern</option>
        </select>
        <select id="edit-project-category">
          <option value="">Kategori Seçin</option>
          <option value="Architecture" ${data.category === 'Architecture' ? 'selected' : ''}>Mimarlık</option>
          <option value="Interior Design" ${data.category === 'Interior Design' ? 'selected' : ''}>İç Tasarım</option>
          <option value="House & Exterior" ${data.category === 'House & Exterior' ? 'selected' : ''}>Ev & Dış Mekan</option>
          <option value="Commercial" ${data.category === 'Commercial' ? 'selected' : ''}>Ticari</option>
        </select>
        <input type="url" id="edit-project-image" placeholder="Proje Resim URL" value="${data.image || ''}">
        <textarea id="edit-project-desc" placeholder="Proje açıklaması...">${data.description || ''}</textarea>
      </div>
      <div class="modal-actions">
        <button class="btn cancel-btn" onclick="closeEditModal()">İptal</button>
        <button class="btn save-btn" onclick="saveEdit('project', '${id}')">Kaydet</button>
      </div>
    `;
  } else if (type === 'employee') {
    modalContent = `
      <h2><i class="fas fa-edit"></i> Çalışan Düzenle</h2>
      <div class="edit-form">
        <input type="text" id="edit-employee-name" placeholder="Çalışan Adı" value="${data.name || ''}">
        <input type="text" id="edit-employee-text" placeholder="Kısa Metin" value="${data.text || ''}">
        <select id="edit-employee-text-style">
          <option value="">Metin Stili Seçin</option>
          <option value="bold" ${data.textStyle === 'bold' ? 'selected' : ''}>Kalın</option>
          <option value="italic" ${data.textStyle === 'italic' ? 'selected' : ''}>Eğik</option>
          <option value="uppercase" ${data.textStyle === 'uppercase' ? 'selected' : ''}>BÜYÜK HARF</option>
          <option value="gradient" ${data.textStyle === 'gradient' ? 'selected' : ''}>Gradient</option>
          <option value="shadow" ${data.textStyle === 'shadow' ? 'selected' : ''}>Gölgeli</option>
          <option value="outline" ${data.textStyle === 'outline' ? 'selected' : ''}>Konturlu</option>
          <option value="modern" ${data.textStyle === 'modern' ? 'selected' : ''}>Modern</option>
        </select>
        <input type="text" id="edit-employee-position" placeholder="Pozisyon" value="${data.position || ''}">
        <input type="number" id="edit-employee-experience" placeholder="Deneyim (yıl)" value="${data.experience || ''}">
        <input type="url" id="edit-employee-image" placeholder="Çalışan Resim URL" value="${data.image || ''}">
      </div>
      <div class="modal-actions">
        <button class="btn cancel-btn" onclick="closeEditModal()">İptal</button>
        <button class="btn save-btn" onclick="saveEdit('employee', '${id}')">Kaydet</button>
      </div>
    `;
  } else if (type === 'reference') {
    modalContent = `
      <h2><i class="fas fa-edit"></i> Referans Düzenle</h2>
      <div class="edit-form">
        <input type="text" id="edit-reference-name" placeholder="Şirket/Kişi Adı" value="${data.name || ''}">
        <input type="text" id="edit-reference-text" placeholder="Kısa Metin" value="${data.text || ''}">
        <select id="edit-reference-text-style">
          <option value="">Metin Stili Seçin</option>
          <option value="bold" ${data.textStyle === 'bold' ? 'selected' : ''}>Kalın</option>
          <option value="italic" ${data.textStyle === 'italic' ? 'selected' : ''}>Eğik</option>
          <option value="uppercase" ${data.textStyle === 'uppercase' ? 'selected' : ''}>BÜYÜK HARF</option>
          <option value="gradient" ${data.textStyle === 'gradient' ? 'selected' : ''}>Gradient</option>
          <option value="shadow" ${data.textStyle === 'shadow' ? 'selected' : ''}>Gölgeli</option>
          <option value="outline" ${data.textStyle === 'outline' ? 'selected' : ''}>Konturlu</option>
          <option value="modern" ${data.textStyle === 'modern' ? 'selected' : ''}>Modern</option>
        </select>
        <input type="text" id="edit-reference-sector" placeholder="Sektör" value="${data.sector || ''}">
        <input type="url" id="edit-reference-image" placeholder="Logo/Resim URL" value="${data.image || ''}">
        <textarea id="edit-reference-description" placeholder="Referans açıklaması...">${data.description || ''}</textarea>
      </div>
      <div class="modal-actions">
        <button class="btn cancel-btn" onclick="closeEditModal()">İptal</button>
        <button class="btn save-btn" onclick="saveEdit('reference', '${id}')">Kaydet</button>
      </div>
    `;
  } else if (type === 'admin') {
    modalContent = `
      <h2><i class="fas fa-edit"></i> Admin Düzenle</h2>
      <div class="edit-form">
        <input type="text" id="edit-admin-username" placeholder="Kullanıcı Adı" value="${data.username || ''}">
        <input type="password" id="edit-admin-password" placeholder="Şifre" value="${data.password || ''}">
      </div>
      <div class="modal-actions">
        <button class="btn cancel-btn" onclick="closeEditModal()">İptal</button>
        <button class="btn save-btn" onclick="saveEdit('admin', '${id}')">Kaydet</button>
      </div>
    `;
  }
  
  const modalHTML = `
    <div id="edit-modal" class="edit-modal">
      <div class="edit-modal-content">
        ${modalContent}
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  setTimeout(() => {
    document.getElementById('edit-modal').classList.add('show');
  }, 10);
  document.body.style.overflow = 'hidden';
}

// Edit modal kapat
window.closeEditModal = function() {
  const modal = document.getElementById('edit-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = 'visible';
    }, 300);
  }
}

// Düzenlemeleri kaydet
window.saveEdit = async function(type, id) {
  if (type === 'admin') {
    const username = document.getElementById('edit-admin-username').value;
    const password = document.getElementById('edit-admin-password').value;
    
    if (!username || !password) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    
    const success = await updateAdmin(id, username, password);
    if (success) {
      // Admin güncelleme işlemini logla
      await logAdminAccess('admin_update', { updatedAdminId: id, newUsername: username });
      
      alert('Admin başarıyla güncellendi!');
      closeEditModal();
      loadAdmins();
    } else {
      alert('Güncelleme sırasında hata oluştu!');
    }
  } else if (type === 'reference') {
    const name = document.getElementById('edit-reference-name').value;
    const text = document.getElementById('edit-reference-text').value;
    const textStyle = document.getElementById('edit-reference-text-style').value;
    const sector = document.getElementById('edit-reference-sector').value;
    const image = document.getElementById('edit-reference-image').value;
    const description = document.getElementById('edit-reference-description').value;
    
    if (!name || !sector || !description) {
      alert('Lütfen zorunlu alanları doldurun!');
      return;
    }
    
    try {
      const { updateReference } = await import('./firebase.js');
      await updateReference(id, { name, text, textStyle, sector, image, description });
      alert('Referans başarıyla güncellendi!');
      closeEditModal();
      loadReferences();
    } catch (error) {
      console.error('Referans güncelleme hatası:', error);
      alert('Referans güncellenirken hata oluştu!');
    }
  } else {
    alert('Diğer güncelleme fonksiyonları henüz eklenmedi!');
    closeEditModal();
  }
}

// Admin giriş kontrolü
function checkLogin() {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
  return isLoggedIn === 'true';
}

// Login modal göster
function showLoginModal() {
  const loginHTML = `
    <div id="login-modal" class="login-modal">
      <div class="login-backdrop"></div>
      <div class="login-content">
        <div class="login-header">
          <i class="fas fa-shield-alt"></i>
          <h2>Güvenli Giriş</h2>
          <p>Yönetici paneline erişim için kimlik doğrulaması gereklidir</p>
        </div>
        <div class="login-form">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input type="text" id="admin-username" placeholder="Kullanıcı Adı" required>
          </div>
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input type="password" id="admin-password" placeholder="Şifre" required>
          </div>
          <button class="btn login-btn" onclick="attemptLogin()">
            <i class="fas fa-sign-in-alt"></i> Giriş Yap
          </button>
        </div>
        <div class="login-footer">
          <small><i class="fas fa-info-circle"></i> Bu alan sadece yetkili personel içindir</small>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', loginHTML);
  document.body.style.overflow = 'hidden';
  
  // Enter tuşuyla giriş
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('login-modal')) {
      attemptLogin();
    }
  });
}

// Giriş denemesi
window.attemptLogin = async function() {
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;
  
  if (!username || !password) {
    alert('Lütfen kullanıcı adı ve şifre girin!');
    return;
  }
  
  // Giriş denemesini logla
  await logAdminAccess('login_attempt', { username: username, success: false });
  
  const isValid = await checkAdminLogin(username, password);
  
  if (isValid) {
    // Başarılı girişi logla
    sessionStorage.setItem('currentAdminUser', username);
    setCookie('adminUser', username, 1);
    await logAdminAccess('login_success', { username: username });
    
    sessionStorage.setItem('adminLoggedIn', 'true');
    
    document.getElementById('login-modal').remove();
    document.body.style.overflow = 'visible';
    
    // Admin panelini göster
    const adminContent = document.querySelector('.admin-content');
    if (adminContent) {
      adminContent.style.display = 'block';
    }
    
    loadAdminData();
  } else {
    // Başarısız girişi logla
    await logAdminAccess('login_failed', { username: username });
    alert('Geçersiz kullanıcı adı veya şifre!');
  }
}

// Deneyim güncelleme
window.updateExperience = async function() {
  const years = document.getElementById('experience-years').value;
  const title = document.getElementById('experience-title').value;
  const description = document.getElementById('experience-description').value;
  
  if (!years || !title || !description) {
    alert('Lütfen tüm alanları doldurun!');
    return;
  }
  
  try {
    await logAdminAccess('data_edit', { type: 'experience', years, title, description });
    
    const success = await setExperience({ years, title, description });
    if (success) {
      alert('Deneyim bilgileri başarıyla güncellendi!');
      loadCurrentExperience();
    } else {
      alert('Deneyim bilgileri güncellenirken hata oluştu!');
    }
  } catch (error) {
    console.error('Deneyim güncelleme hatası:', error);
    alert('Deneyim bilgileri güncellenirken hata oluştu!');
  }
}

// Mevcut deneyim bilgilerini yükle
window.loadCurrentExperience = async function() {
  try {
    const experience = await getExperience();
    
    document.getElementById('current-years-badge').textContent = experience.years + '+';
    document.getElementById('current-experience-title').textContent = experience.title;
    document.getElementById('current-experience-desc').textContent = experience.description;
    
    // Form alanlarını da doldur
    document.getElementById('experience-years').value = experience.years;
    document.getElementById('experience-title').value = experience.title;
    document.getElementById('experience-description').value = experience.description;
  } catch (error) {
    console.error('Deneyim bilgileri yüklenirken hata:', error);
    document.getElementById('current-experience-title').textContent = 'Yükleme hatası';
    document.getElementById('current-experience-desc').textContent = 'Veriler yüklenemedi';
  }
}

// Hero görsel güncelleme
window.updateHeroImage = async function() {
  const imageUrl = document.getElementById('hero-image-url').value.trim();
  
  if (!imageUrl) {
    alert('Lütfen görsel URL\'si girin!');
    return;
  }
  
  try {
    await logAdminAccess('data_edit', { type: 'heroimage', newUrl: imageUrl });
    
    const success = await setHeroImage(imageUrl);
    if (success) {
      alert('Ana sayfa görseli başarıyla güncellendi!');
      loadCurrentHeroImage();
    } else {
      alert('Görsel güncellenirken hata oluştu!');
    }
  } catch (error) {
    console.error('Hero görsel güncelleme hatası:', error);
    alert('Görsel güncellenirken hata oluştu!');
  }
}

// Varsayılan hero görseline dön
window.resetToDefaultHero = async function() {
  if (confirm('Varsayılan görsele dönmek istediğinizden emin misiniz?')) {
    try {
      await logAdminAccess('data_edit', { type: 'heroimage', action: 'reset_to_default' });
      
      const success = await resetHeroImage();
      if (success) {
        alert('Varsayılan görsele başarıyla dönüldü!');
        loadCurrentHeroImage();
      } else {
        alert('Varsayılan görsele dönülürken hata oluştu!');
      }
    } catch (error) {
      console.error('Varsayılan görsel sıfırlama hatası:', error);
      alert('Varsayılan görsele dönülürken hata oluştu!');
    }
  }
}

// Mevcut hero görselini yükle
window.loadCurrentHeroImage = async function() {
  try {
    const heroImageUrl = await getHeroImage();
    const previewImg = document.getElementById('hero-preview');
    const statusText = document.getElementById('hero-status');
    const inputField = document.getElementById('hero-image-url');
    
    if (heroImageUrl && heroImageUrl !== 'default') {
      previewImg.src = heroImageUrl;
      previewImg.style.display = 'block';
      statusText.textContent = 'Özel görsel ayarlandı';
      inputField.value = heroImageUrl;
    } else {
      previewImg.style.display = 'none';
      statusText.textContent = 'Varsayılan görsel kullanılıyor';
      inputField.value = '';
    }
  } catch (error) {
    console.error('Hero görsel yüklenirken hata:', error);
    document.getElementById('hero-status').textContent = 'Yükleme hatası';
  }
}

// Admin verilerini yükle
function loadAdminData() {
  loadServices();
  loadProjects();
  loadEmployees();
  loadReferences();
  loadAdmins();
  loadAnalytics();
  loadCurrentSiteName();
  loadCurrentExperience();
  loadCurrentHeroImage();
}

// Site adını yükle
window.loadCurrentSiteName = async function() {
  try {
    const siteName = await getSiteName();
    document.getElementById('current-site-name').textContent = siteName;
    document.getElementById('site-name-input').value = siteName;
  } catch (error) {
    console.error('Site adı yüklenirken hata:', error);
    document.getElementById('current-site-name').textContent = 'Yükleme hatası';
  }
}

// Site adını güncelle
window.updateSiteName = async function() {
  const newSiteName = document.getElementById('site-name-input').value.trim();
  
  if (!newSiteName) {
    alert('Lütfen site adını girin!');
    return;
  }
  
  try {
    await logAdminAccess('data_edit', { type: 'sitename', newName: newSiteName });
    
    const success = await setSiteName(newSiteName);
    if (success) {
      alert('Site adı başarıyla güncellendi!');
      document.getElementById('current-site-name').textContent = newSiteName;
    } else {
      alert('Site adı güncellenirken hata oluştu!');
    }
  } catch (error) {
    console.error('Site adı güncelleme hatası:', error);
    alert('Site adı güncellenirken hata oluştu!');
  }
}

// Favicon yükle
window.loadCurrentFavicon = async function() {
  try {
    const faviconUrl = await getFavicon();
    const previewImg = document.getElementById('favicon-preview');
    const statusSpan = document.getElementById('favicon-status');
    const inputField = document.getElementById('favicon-url-input');
    
    if (faviconUrl) {
      previewImg.src = faviconUrl;
      previewImg.style.display = 'block';
      statusSpan.textContent = 'Favicon ayarlandı';
      inputField.value = faviconUrl;
    } else {
      previewImg.style.display = 'none';
      statusSpan.textContent = 'Favicon ayarlanmamış';
      inputField.value = '';
    }
  } catch (error) {
    console.error('Favicon yüklenirken hata:', error);
    document.getElementById('favicon-status').textContent = 'Yükleme hatası';
  }
}

// Favicon güncelle
window.updateFavicon = async function() {
  const faviconUrl = document.getElementById('favicon-url-input').value.trim();
  
  if (!faviconUrl) {
    alert('Lütfen favicon URL\'si girin!');
    return;
  }
  
  try {
    await logAdminAccess('data_edit', { type: 'favicon', newUrl: faviconUrl });
    
    const success = await setFavicon(faviconUrl);
    if (success) {
      alert('Favicon başarıyla güncellendi!');
      loadCurrentFavicon();
      updatePageFavicon(faviconUrl);
    } else {
      alert('Favicon güncellenirken hata oluştu!');
    }
  } catch (error) {
    console.error('Favicon güncelleme hatası:', error);
    alert('Favicon güncellenirken hata oluştu!');
  }
}

// Sayfa favicon'ını güncelle
function updatePageFavicon(faviconUrl) {
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = faviconUrl;
  document.getElementsByTagName('head')[0].appendChild(link);
}

// İletişim ekleme
window.addContact = async function() {
  const type = document.getElementById('contact-type').value;
  const value = document.getElementById('contact-value').value;
  const label = document.getElementById('contact-label').value;
  
  if (!type || !value || !label) {
    alert('Lütfen tüm alanları doldurun!');
    return;
  }
  
  const success = await addContact(type, value, label);
  if (success) {
    alert('İletişim bilgisi başarıyla eklendi!');
    document.getElementById('contact-type').value = '';
    document.getElementById('contact-value').value = '';
    document.getElementById('contact-label').value = '';
    loadContacts();
  } else {
    alert('İletişim bilgisi eklenirken hata oluştu!');
  }
}

// İletişim bilgilerini yükleme
async function loadContacts() {
  const contacts = await getContacts();
  const container = document.getElementById('contacts-list');
  container.innerHTML = '';
  
  contacts.forEach(contact => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${contact.label || ''}</h4>
      <p>Tür: ${contact.type || ''}</p>
      <p>Değer: ${contact.value || ''}</p>
      <div class="item-actions">
        <button class="edit-btn" onclick="editContact('${contact.id}')">Düzenle</button>
        <button class="delete-btn" onclick="deleteContact('${contact.id}')">Sil</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// İletişim düzenle
window.editContact = async function(id) {
  const contacts = await getContacts();
  const contact = contacts.find(c => c.id === id);
  if (contact) {
    openEditModal('contact', contact, id);
  }
}

// İletişim sil
window.deleteContact = async function(id) {
  if (confirm('Bu iletişim bilgisini silmek istediğinizden emin misiniz?')) {
    const success = await deleteItem('contacts', id);
    if (success) {
      alert('İletişim bilgisi silindi!');
      loadContacts();
    }
  }
}

// Kullanıcı analizlerini yükle
window.loadAnalytics = async function() {
  // Çerez sistemi kaldırıldığı için analiz verileri mevcut değil
  document.getElementById('total-visitors').textContent = '0';
  document.getElementById('total-clicks').textContent = '0';
  document.getElementById('total-sessions').textContent = '0';
  document.getElementById('most-viewed-section').textContent = 'Veri Yok';
  document.getElementById('most-popular-card').textContent = 'Veri Yok';
  
  const ipContainer = document.getElementById('ip-stats');
  if (ipContainer) {
    ipContainer.innerHTML = '<p style="text-align: center; color: #666;">Kullanıcı takibi devre dışı bırakıldı</p>';
  }
  
  const sectionChart = document.getElementById('section-chart');
  if (sectionChart) {
    sectionChart.innerHTML = '<p style="text-align: center; color: #666;">Veri mevcut değil</p>';
  }
  
  const cardChart = document.getElementById('card-chart');
  if (cardChart) {
    cardChart.innerHTML = '<p style="text-align: center; color: #666;">Veri mevcut değil</p>';
  }
}

function drawSectionChart(sectionStats) {
  const container = document.getElementById('section-chart');
  container.innerHTML = '';
  
  const total = Object.values(sectionStats).reduce((a, b) => a + b, 0);
  
  Object.entries(sectionStats).forEach(([section, count]) => {
    const percentage = ((count / total) * 100).toFixed(1);
    const barDiv = document.createElement('div');
    barDiv.className = 'chart-bar';
    barDiv.innerHTML = `
      <div class="bar-label">${section}</div>
      <div class="bar-container">
        <div class="bar-fill" style="width: ${percentage}%"></div>
        <span class="bar-value">${count} (${percentage}%)</span>
      </div>
    `;
    container.appendChild(barDiv);
  });
}

function displayIPStats(ipStats) {
  const container = document.getElementById('ip-stats');
  container.innerHTML = '';
  
  const sortedIPs = Object.entries(ipStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20); // Top 20 IP
  
  const totalIPs = Object.keys(ipStats).length;
  const totalVisits = Object.values(ipStats).reduce((a, b) => a + b, 0);
  
  // Özet bilgi
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'ip-summary';
  summaryDiv.innerHTML = `
    <div class="ip-summary-item">
      <strong>${totalIPs}</strong> farklı IP adresi
    </div>
    <div class="ip-summary-item">
      <strong>${totalVisits}</strong> toplam alınan çerez sayısı
    </div>
  `;
  container.appendChild(summaryDiv);
  
  // IP listesi
  const listDiv = document.createElement('div');
  listDiv.className = 'ip-list';
  
  sortedIPs.forEach(([ip, count], index) => {
    const ipDiv = document.createElement('div');
    ipDiv.className = 'ip-item';
    ipDiv.innerHTML = `
      <div class="ip-rank">#${index + 1}</div>
      <div class="ip-address">${ip}</div>
      <div class="ip-count">${count} çerez alındı</div>
      <div class="ip-bar">
        <div class="ip-bar-fill" style="width: ${(count / sortedIPs[0][1]) * 100}%"></div>
      </div>
    `;
    listDiv.appendChild(ipDiv);
  });
  
  container.appendChild(listDiv);
}

function drawCardChart(cardStats) {
  const container = document.getElementById('card-chart');
  container.innerHTML = '';
  
  const sortedCards = Object.entries(cardStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10); // Top 10
  
  const maxCount = Math.max(...sortedCards.map(([,count]) => count));
  
  sortedCards.forEach(([card, count]) => {
    const percentage = ((count / maxCount) * 100).toFixed(1);
    const barDiv = document.createElement('div');
    barDiv.className = 'chart-bar';
    barDiv.innerHTML = `
      <div class="bar-label">${card.substring(0, 25)}...</div>
      <div class="bar-container">
        <div class="bar-fill" style="width: ${percentage}%"></div>
        <span class="bar-value">${count}</span>
      </div>
    `;
    container.appendChild(barDiv);
  });
}

// Analiz raporu Excel olarak indirme
window.exportAnalytics = async function() {
  const { activities, consents } = await getUserStats();
  
  // Bölüm analizi
  const sectionStats = {};
  const cardStats = {};
  
  activities.forEach(activity => {
    if (activity.activityType === 'mouse_movement' && activity.data.movements) {
      activity.data.movements.forEach(movement => {
        if (movement.section) {
          sectionStats[movement.section] = (sectionStats[movement.section] || 0) + 1;
        }
        
        if (movement.cardType && movement.cardTitle) {
          const cardKey = `${movement.cardType}: ${movement.cardTitle}`;
          cardStats[cardKey] = (cardStats[cardKey] || 0) + 1;
        }
      });
    }
  });
  
  // Excel verisi hazırla
  const workbook = XLSX.utils.book_new();
  
  // Bölüm analizi sayfası
  const sectionData = [['Bölüm', 'Ziyaret Sayısı', 'Yüzde']];
  const sectionTotal = Object.values(sectionStats).reduce((a, b) => a + b, 0);
  Object.entries(sectionStats).forEach(([section, count]) => {
    const percentage = ((count / sectionTotal) * 100).toFixed(1);
    sectionData.push([section, count, `${percentage}%`]);
  });
  
  const sectionSheet = XLSX.utils.aoa_to_sheet(sectionData);
  XLSX.utils.book_append_sheet(workbook, sectionSheet, 'Bölüm Analizi');
  
  // Kart analizi sayfası
  const cardData = [['Kart', 'Tıklama Sayısı']];
  Object.entries(cardStats).forEach(([card, count]) => {
    cardData.push([card, count]);
  });
  
  const cardSheet = XLSX.utils.aoa_to_sheet(cardData);
  XLSX.utils.book_append_sheet(workbook, cardSheet, 'Kart Analizi');
  
  // Özet sayfa
  const summaryData = [
    ['Rapor Tarihi', new Date().toLocaleDateString('tr-TR')],
    ['Toplam Ziyaretçi', new Set(activities.map(a => a.ipAddress)).size],
    ['Toplam Tıklama', activities.filter(a => a.activityType === 'click_activity').length],
    ['Toplam Oturum', new Set(activities.map(a => a.sessionId)).size],
    [''],
    ['Kart Bazında Tıklama Analizi', ''],
    ['Kart Adı', 'Tıklama Sayısı']
  ];
  
  Object.entries(cardStats).forEach(([card, count]) => {
    summaryData.push([card, count]);
  });
  
  summaryData.push(['']);
  summaryData.push(['Bölüm Bazında İlgi Dağılımı', '']);
  summaryData.push(['Bölüm', 'Ziyaret', 'Yüzde']);
  
  Object.entries(sectionStats).forEach(([section, count]) => {
    const percentage = ((count / sectionTotal) * 100).toFixed(1);
    summaryData.push([section, count, `${percentage}%`]);
  });
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Özet Rapor');
  
  // Excel dosyasını indir
  XLSX.writeFile(workbook, `kullanici-analizi-${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Logları yükleme
window.loadLogs = async function() {
  const container = document.getElementById('logs-list');
  container.innerHTML = '<p style="text-align: center; color: #666;">Log sistemi devre dışı bırakıldı</p>';
}

function getActionColor(action) {
  const colors = {
    'page_access': '#17a2b8',
    'login_success': '#28a745',
    'login_failed': '#dc3545',
    'login_attempt': '#ffc107',
    'data_add': '#007bff',
    'data_edit': '#fd7e14',
    'data_delete': '#dc3545',
    'admin_add': '#6f42c1',
    'admin_update': '#20c997',
    'admin_delete': '#e83e8c'
  };
  return colors[action] || '#6c757d';
}

function getActionText(action) {
  const texts = {
    'page_access': 'Sayfa Erişimi',
    'login_success': 'Başarılı Giriş',
    'login_failed': 'Başarısız Giriş',
    'login_attempt': 'Giriş Denemesi',
    'data_add': 'Veri Eklendi',
    'data_edit': 'Veri Düzenlendi',
    'data_delete': 'Veri Silindi',
    'admin_add': 'Admin Eklendi',
    'admin_update': 'Admin Güncellendi',
    'admin_delete': 'Admin Silindi'
  };
  return texts[action] || action;
}

function formatLogDetails(details) {
  if (!details || Object.keys(details).length === 0) return 'Detay yok';
  
  return Object.entries(details)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

// Log filtreleme
window.filterLogs = async function() {
  const dateFilter = document.getElementById('log-date-filter').value;
  const actionFilter = document.getElementById('log-action-filter').value;
  
  const allLogs = await getAdminLogs();
  let filteredLogs = allLogs;
  
  if (dateFilter) {
    filteredLogs = filteredLogs.filter(log => {
      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      return logDate === dateFilter;
    });
  }
  
  if (actionFilter) {
    filteredLogs = filteredLogs.filter(log => log.action === actionFilter);
  }
  
  displayFilteredLogs(filteredLogs);
}

function displayFilteredLogs(logs) {
  const container = document.getElementById('logs-list');
  container.innerHTML = '';
  
  if (logs.length === 0) {
    container.innerHTML = '<p>Filtre kriterlerine uygun log bulunamadı.</p>';
    return;
  }
  
  logs.forEach(log => {
    const logDiv = document.createElement('div');
    logDiv.className = 'log-item';
    
    const actionColor = getActionColor(log.action);
    const detailsText = formatLogDetails(log.details);
    
    logDiv.innerHTML = `
      <div class="log-header">
        <span class="log-action" style="background: ${actionColor}">${getActionText(log.action)}</span>
        <span class="log-time">${log.dateFormatted}</span>
        <span class="log-user">👤 ${log.adminUser}</span>
        <span class="log-ip">🌍 ${log.ipAddress}</span>
      </div>
      <div class="log-details">
        <p><strong>Session:</strong> ${log.sessionId}</p>
        <p><strong>Detaylar:</strong> ${detailsText}</p>
        <p><strong>Tarayıcı:</strong> ${log.browserInfo?.userAgent?.substring(0, 100) || 'Bilinmiyor'}...</p>
        <p><strong>Ekran:</strong> ${log.browserInfo?.screenResolution || 'Bilinmiyor'} | 
           <strong>Dil:</strong> ${log.browserInfo?.language || 'Bilinmiyor'} | 
           <strong>Platform:</strong> ${log.browserInfo?.platform || 'Bilinmiyor'}</p>
      </div>
    `;
    
    container.appendChild(logDiv);
  });
}

// Tüm CRUD işlemlerini logla
window.addService = async function() {
  const title = document.getElementById('service-title').value;
  await logAdminAccess('data_add', { type: 'service', title: title });
  // Orijinal fonksiyon devam eder...
}

// Yeni admin ekleme
window.addNewAdmin = async function() {
  const username = document.getElementById('admin-new-username').value;
  const password = document.getElementById('admin-new-password').value;
  
  if (!username || !password) {
    alert('Lütfen kullanıcı adı ve şifre girin!');
    return;
  }
  
  await logAdminAccess('admin_add', { newUsername: username });
  
  const success = await addAdmin(username, password);
  if (success) {
    alert('Admin başarıyla eklendi!');
    document.getElementById('admin-new-username').value = '';
    document.getElementById('admin-new-password').value = '';
    loadAdmins();
  } else {
    alert('Admin eklenirken hata oluştu!');
  }
}

// Adminleri yükleme
async function loadAdmins() {
  const admins = await getAdmins();
  const container = document.getElementById('admins-list');
  container.innerHTML = '';
  
  admins.forEach(admin => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${admin.username || ''}</h4>
      <p>Şifre: ${'*'.repeat((admin.password || '').length)}</p>
      <div class="item-actions">
        <button class="edit-btn" onclick="editAdmin('${admin.id}')">Düzenle</button>
        <button class="delete-btn" onclick="deleteAdmin('${admin.id}')">Sil</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Admin düzenle
window.editAdmin = async function(id) {
  const admins = await getAdmins();
  const admin = admins.find(a => a.id === id);
  if (admin) {
    openEditModal('admin', admin, id);
  }
}

// Admin sil
window.deleteAdmin = async function(id) {
  if (confirm('Bu admin kullanıcısını silmek istediğinizden emin misiniz?')) {
    // Admin silme işlemini logla
    await logAdminAccess('admin_delete', { deletedAdminId: id });
    
    const success = await deleteItem('admin', id);
    if (success) {
      alert('Admin silindi!');
      loadAdmins();
    }
  }
}

// Çerez ve log fonksiyonları
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || 'direct'
  };
}

async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
}

async function logAdminAccess(action, details = {}) {
  // Log sistemi devre dışı
  return;
}

// Sayfa yüklendiğinde giriş kontrolü yap
document.addEventListener('DOMContentLoaded', async function() {
  // Sayfa erişimini logla
  await logAdminAccess('page_access', { page: 'admin_panel' });
  
  // Hemen giriş modalını göster
  showLoginModal();
});

// Sayfa yüklendiğinde admin panelini gizle
document.addEventListener('DOMContentLoaded', function() {
  const adminContent = document.querySelector('.admin-content');
  if (adminContent) {
    adminContent.style.display = 'none';
  }
});