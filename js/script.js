import { getServices, getProjects, getEmployees, getReferences } from './firebase.js';

// Loading screen kontrolü
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        
        // Loading screen tamamen kaybolunca elementi kaldır
        setTimeout(() => {
            loadingScreen.remove();
            // Ana içeriği animasyonlu göster
            document.body.style.overflow = 'visible';
            initializePageAnimations();
        }, 800);
    }, 2000); // 2 saniye loading göster
});

// Sayfa yüklendiğinde Firebase'den verileri çek
document.addEventListener('DOMContentLoaded', async function() {
    // Loading sırasında scroll'u engelle
    document.body.style.overflow = 'hidden';
    
    await loadDynamicContent();
    initializeAnimations();
});

// Firebase'den dinamik içerikleri yükle
async function loadDynamicContent() {
    try {
        // Hizmetleri yükle
        const services = await getServices();
        if (services.length > 0) {
            renderServices(services);
        }

        // Çalışanları yükle
        const employees = await getEmployees();
        if (employees.length > 0) {
            renderEmployees(employees);
        }

        // Projeleri yükle
        const projects = await getProjects();
        if (projects.length > 0) {
            renderProjects(projects);
        }

        // Referansları yükle
        const references = await getReferences();
        if (references.length > 0) {
            renderReferences(references);
        }
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
    }
}

// Hizmetleri render et
function renderServices(services) {
    const servicesContainer = document.getElementById('services-list');
    if (!servicesContainer) return;

    servicesContainer.innerHTML = '';
    
    services.forEach((service, index) => {
        const serviceElement = document.createElement('div');
        serviceElement.className = 'service-card';
        
        if (service.image) {
            serviceElement.innerHTML = `
                <div class="service-image">
                    <img src="${service.image}" alt="${service.title}" onerror="this.src='https://via.placeholder.com/400x200/FF6B35/FFFFFF?text=Resim+Yüklenemedi'">
                    <div class="service-overlay">
                        <span class="service-text-overlay">${service.text || ''}</span>
                    </div>
                </div>
                <div class="service-content">
                    <h3>${service.title || ''}</h3>
                    <p>${service.description || ''}</p>
                </div>
            `;
        } else {
            serviceElement.innerHTML = `
                <div class="service-text-display">
                    <span class="service-text-content">${service.text || ''}</span>
                </div>
                <h3>${service.title || ''}</h3>
                <p>${service.description || ''}</p>
            `;
        }
        
        // Metin stilini uygula
        const textElement = serviceElement.querySelector('.service-text-overlay, .service-text-content');
        if (textElement && service.textStyle && service.text) {
            applyTextStyleToElement(textElement, service.textStyle);
        }
        
        // Boş metin varsa container'ı gizle
        if (!service.text || service.text.trim() === '') {
            const textDisplay = serviceElement.querySelector('.service-text-display');
            if (textDisplay) {
                textDisplay.style.display = 'none';
            }
        }
        
        servicesContainer.appendChild(serviceElement);
    });
}

// Projeleri render et
function renderProjects(projects) {
    const projectsContainer = document.getElementById('projects-list');
    if (!projectsContainer) return;

    projectsContainer.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card';
        projectElement.innerHTML = `
            <div class="project-image-container">
                <img src="${project.image || 'https://via.placeholder.com/400x250'}" alt="${project.title || ''}" onerror="this.src='https://via.placeholder.com/400x250/FF6B35/FFFFFF?text=Proje+Görseli'">
                <div class="project-text-overlay">
                    <span class="project-text-content">${project.text || ''}</span>
                </div>
            </div>
            <div class="project-info">
                <span class="project-category">${project.category || ''}</span>
                <h3>${project.title || ''}</h3>
                <p>${project.description || ''}</p>
            </div>
        `;
        
        // Metin stilini uygula
        const textElement = projectElement.querySelector('.project-text-content');
        if (textElement && project.textStyle) {
            applyTextStyleToElement(textElement, project.textStyle);
        }
        
        projectsContainer.appendChild(projectElement);
    });
}

// Smooth scroll navigation
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 100; // Navbar yüksekliği için offset
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});



// Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    const navLinks = nav.querySelectorAll('ul li a');
    const logo = nav.querySelector('.logo');
    
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        
        // Linkleri koyu renge çevir
        navLinks.forEach(link => {
            link.style.color = '#333';
        });
        
        // Logo rengini değiştir
        logo.style.color = '#FF6B35';
        logo.querySelector('span').style.color = '#F7931E';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.1)';
        nav.style.backdropFilter = 'blur(5px)';
        
        // Linkleri beyaz renge çevir
        navLinks.forEach(link => {
            link.style.color = 'white';
        });
        
        // Logo rengini beyaz yap
        logo.style.color = '#FF6B35';
        logo.querySelector('span').style.color = '#F7931E';
    }
});

// Sayfa yükleme sonrası animasyonlar
function initializePageAnimations() {
    // Hero section animasyonu
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.animation = 'fadeInUp 1s ease 0.3s both';
    }
    
    // Navbar animasyonu
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.animation = 'slideInFromLeft 0.8s ease 0.1s both';
    }
    
    // Bölüm başlıkları animasyonu
    document.querySelectorAll('section h2').forEach((title, index) => {
        title.style.animation = `scaleIn 0.6s ease ${0.2 + index * 0.1}s both`;
    });
}

// Animasyonları başlat
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Kart animasyonlarını sırayla başlat
                const cards = entry.target.parentElement.querySelectorAll('.service-card, .project-card, .employee-card, .reference-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Animate elements on scroll
    document.querySelectorAll('.service-card, .project-card, .employee-card, .reference-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Container'ları da gözlemle
    document.querySelectorAll('.services-container, .projects-container, .employees-container, .references-container').forEach(container => {
        observer.observe(container);
    });
}

// Metin stili uygulama fonksiyonu (ana sayfa için)
function applyTextStyleToElement(element, style) {
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

// Çalışanları render et
function renderEmployees(employees) {
    const employeesContainer = document.getElementById('employees-list');
    if (!employeesContainer) return;

    employeesContainer.innerHTML = '';
    
    employees.forEach((employee, index) => {
        const employeeElement = document.createElement('div');
        employeeElement.className = 'employee-card';
        employeeElement.innerHTML = `
            <div class="employee-image-container">
                <img src="${employee.image || 'https://via.placeholder.com/300x300'}" alt="${employee.name || ''}" onerror="this.src='https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Çalışan+Fotoğrafı'">
                <div class="employee-text-overlay">
                    <span class="employee-text-content">${employee.text || ''}</span>
                </div>
            </div>
            <div class="employee-info">
                <h3>${employee.name || ''}</h3>
                <span class="employee-position">${employee.position || ''}</span>
                <p class="employee-experience">${employee.experience || 0} yıl deneyim</p>
            </div>
        `;
        
        // Metin stilini uygula
        const textElement = employeeElement.querySelector('.employee-text-content');
        if (textElement && employee.textStyle) {
            applyTextStyleToElement(textElement, employee.textStyle);
        }
        
        employeesContainer.appendChild(employeeElement);
    });
}

// Referansları render et
function renderReferences(references) {
    const referencesContainer = document.getElementById('references-list');
    if (!referencesContainer) return;

    referencesContainer.innerHTML = '';
    
    references.forEach((reference, index) => {
        const referenceElement = document.createElement('div');
        referenceElement.className = 'reference-card';
        referenceElement.innerHTML = `
            <div class="reference-image-container">
                <img src="${reference.image || 'https://via.placeholder.com/300x200'}" alt="${reference.name || ''}" onerror="this.src='https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=Logo'">
                <div class="reference-text-overlay">
                    <span class="reference-text-content">${reference.text || ''}</span>
                </div>
            </div>
            <div class="reference-info">
                <h3>${reference.name || ''}</h3>
                <span class="reference-sector">${reference.sector || ''}</span>
                <p>${reference.description || ''}</p>
            </div>
        `;
        
        // Metin stilini uygula
        const textElement = referenceElement.querySelector('.reference-text-content');
        if (textElement && reference.textStyle) {
            applyTextStyleToElement(textElement, reference.textStyle);
        }
        
        referencesContainer.appendChild(referenceElement);
    });
}