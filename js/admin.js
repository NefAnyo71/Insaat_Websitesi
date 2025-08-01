import { addService, getServices, addProject, getProjects, addEmployee, getEmployees, addReference, getReferences, deleteItem } from './firebase.js';

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
  alert('Güncelleme fonksiyonu henüz eklenmedi!');
  closeEditModal();
}

// Sayfa yüklendiğinde verileri getir
document.addEventListener('DOMContentLoaded', function() {
  loadServices();
  loadProjects();
  loadEmployees();
  loadReferences();
});