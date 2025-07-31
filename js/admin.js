import { addService, getServices, addProject, getProjects, addBlog, getBlogs, addEmployee, getEmployees, deleteItem } from './firebase.js';

// Hizmet ekleme
window.addService = async function() {
  const title = document.getElementById('service-title').value;
  const text = document.getElementById('service-text').value;
  const textStyle = document.getElementById('service-text-style').value;
  const description = document.getElementById('service-desc').value;
  const image = document.getElementById('service-image').value;
  
  if (!title || !text || !description) {
    alert('Lütfen zorunlu alanları doldurun!');
    return;
  }
  
  const success = await addService(title, text, textStyle, description, image);
  if (success) {
    alert('Hizmet başarıyla eklendi!');
    document.getElementById('service-title').value = '';
    document.getElementById('service-text').value = '';
    document.getElementById('service-text-style').value = '';
    document.getElementById('service-image').value = '';
    document.getElementById('service-desc').value = '';
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

// Blog ekleme
window.addBlog = async function() {
  const title = document.getElementById('blog-title').value;
  const text = document.getElementById('blog-text').value;
  const textStyle = document.getElementById('blog-text-style').value;
  const content = document.getElementById('blog-content').value;
  const image = document.getElementById('blog-image').value;
  const author = document.getElementById('blog-author').value;
  
  if (!title || !text || !content || !image || !author) {
    alert('Lütfen zorunlu alanları doldurun!');
    return;
  }
  
  const success = await addBlog(title, text, textStyle, content, image, author);
  if (success) {
    alert('Blog başarıyla eklendi!');
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-text').value = '';
    document.getElementById('blog-text-style').value = '';
    document.getElementById('blog-content').value = '';
    document.getElementById('blog-image').value = '';
    document.getElementById('blog-author').value = '';
    loadBlogs();
  } else {
    alert('Blog eklenirken hata oluştu!');
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
      <button onclick="deleteService('${service.id}')">Sil</button>
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
      <button onclick="deleteProject('${project.id}')">Sil</button>
    `;
    container.appendChild(div);
  });
}

// Blogları yükleme
async function loadBlogs() {
  const blogs = await getBlogs();
  const container = document.getElementById('blogs-list');
  container.innerHTML = '';
  
  blogs.forEach(blog => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${blog.title || ''}</h4>
      <p>Metin: ${blog.text || ''}</p>
      <p>Yazar: ${blog.author || ''}</p>
      <p>Tarih: ${blog.date || ''}</p>
      <p>${(blog.content || '').substring(0, 100)}...</p>
      <button onclick="deleteBlog('${blog.id}')">Sil</button>
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

window.deleteBlog = async function(id) {
  if (confirm('Bu blogu silmek istediğinizden emin misiniz?')) {
    const success = await deleteItem('blogs', id);
    if (success) {
      alert('Blog silindi!');
      loadBlogs();
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
      <button onclick="deleteEmployee('${employee.id}')">Sil</button>
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

// Sayfa yüklendiğinde verileri getir
document.addEventListener('DOMContentLoaded', function() {
  loadServices();
  loadProjects();
  loadBlogs();
  loadEmployees();
});