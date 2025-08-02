import { getServices, getProjects, getEmployees, getReferences, saveSecurityLog } from './firebase.js';

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
    
    // Güvenlik amaçlı IP kaydı (çerez onayından bağımsız)
    await logSecurityAccess();
    
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
        
        // Başlangıçta görünmez yap
        serviceElement.style.opacity = '0';
        serviceElement.style.transform = 'translateX(-100px) rotateY(-15deg)';
        serviceElement.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (service.image) {
            serviceElement.innerHTML = `
                <div class="service-image">
                    <img src="${service.image}" alt="${service.title}" onerror="this.style.display='none'">
                    <div class="service-overlay">
                        <span class="service-text-overlay">${service.text || ''}</span>
                    </div>
                </div>
                <div class="service-content">
                    <h3>${service.title || ''}</h3>
                    <p>${service.description || ''}</p>
                    <button class="service-details-btn" onclick="openServiceModal('${service.id}', '${service.title}', '${service.details}', '${service.image}')">
                        <i class="fas fa-info-circle"></i> Detayları Gör
                    </button>
                </div>
            `;
        } else {
            serviceElement.innerHTML = `
                <div class="service-content-only">
                    <div class="service-icon-placeholder">
                        <i class="fas fa-cogs"></i>
                    </div>
                    <h3>${service.title || ''}</h3>
                    <p>${service.description || ''}</p>
                    <button class="service-details-btn" onclick="openServiceModal('${service.id}', '${service.title}', '${service.details}', '${service.image}')">
                        <i class="fas fa-info-circle"></i> Detayları Gör
                    </button>
                </div>
            `;
        }
        
        // Metin stilini uygula (sadece resimli hizmetler için)
        const textElement = serviceElement.querySelector('.service-text-overlay');
        if (textElement && service.textStyle && service.text) {
            applyTextStyleToElement(textElement, service.textStyle);
        }
        
        // 3D hover efekti ekle
        serviceElement.classList.add('hover-3d');
        
        servicesContainer.appendChild(serviceElement);
        
        // Sırayla animasyonlu göster
        setTimeout(() => {
            serviceElement.style.opacity = '1';
            serviceElement.style.transform = 'translateX(0) rotateY(0)';
        }, index * 150);
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
        
        // Başlangıçta görünmez yap
        projectElement.style.opacity = '0';
        projectElement.style.transform = 'translateY(80px) scale(0.8)';
        projectElement.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        
        projectElement.innerHTML = `
            <div class="project-image-container">
                <img src="${project.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjM1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9qZSBHw7xyc2VsaTwvdGV4dD48L3N2Zz4='}" alt="${project.title || ''}" onerror="this.style.display='none'">
                <div class="project-text-overlay">
                    <span class="project-text-content">${project.text || ''}</span>
                </div>
                <div class="project-gradient-overlay"></div>
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
        
        // 3D hover efekti ekle
        projectElement.classList.add('hover-3d');
        
        projectsContainer.appendChild(projectElement);
        
        // Sırayla animasyonlu göster
        setTimeout(() => {
            projectElement.style.opacity = '1';
            projectElement.style.transform = 'translateY(0) scale(1)';
        }, index * 180);
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
        
        // Başlangıçta görünmez yap
        employeeElement.style.opacity = '0';
        employeeElement.style.transform = 'translateY(120px) rotateX(30deg) rotateY(-15deg) scale(0.7)';
        employeeElement.style.transition = 'all 1.5s cubic-bezier(0.23, 1, 0.32, 1)';
        
        // Görsel URL'si varsa kullan, yoksa varsayılan
        const imageUrl = employee.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=350&fit=crop&crop=face&auto=format';
        
        employeeElement.innerHTML = `
            <div class="employee-container">
                <div class="employee-glow"></div>
                <div class="employee-image" style="background-image: url('${imageUrl}')"></div>
                <div class="employee-overlay"></div>
                <div class="employee-content">
                    <div class="employee-avatar">
                        <img src="${employee.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMTI0OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VXptYW48L3RleHQ+PC9zdmc+'}" alt="${employee.name || ''}">
                    </div>
                    <div class="employee-name">${employee.name || 'Uzman Çalışan'}</div>
                    <div class="employee-position-tag">${employee.position || 'Uzman'}</div>
                    <div class="employee-experience">${employee.experience || 5} yıl deneyimle projelerinizde kaliteli hizmet sunmaktayız. Müşteri memnuniyeti odaklı çalışma anlayışımızla sektörde öncü konumdayız.</div>
                </div>
            </div>
        `;
        
        employeesContainer.appendChild(employeeElement);
        
        // Sırayla animasyonlu göster
        setTimeout(() => {
            employeeElement.style.opacity = '1';
            employeeElement.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
            
            // Mouse takip animasyonunu başlat
            initMouseFollowCards();
        }, index * 300);
    });
}

// Referansları render et
function renderReferences(references) {
    const referencesContainer = document.getElementById('references-list');
    if (!referencesContainer) return;

    referencesContainer.innerHTML = '';
    
    references.forEach((reference, index) => {
        const referenceElement = document.createElement('div');
        referenceElement.className = 'reference-item';
        
        // Başlangıçta görünmez yap
        referenceElement.style.opacity = '0';
        referenceElement.style.transform = 'translateY(120px) rotateX(30deg) rotateY(15deg) scale(0.7)';
        referenceElement.style.transition = 'all 1.5s cubic-bezier(0.23, 1, 0.32, 1)';
        
        // Görsel URL'si varsa kullan, yoksa varsayılan
        const imageUrl = reference.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=entropy&auto=format';
        
        referenceElement.innerHTML = `
            <div class="reference-container">
                <div class="reference-ring"></div>
                <div class="reference-logo-main">
                    <img src="${reference.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDAxMjQ4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2dvPC90ZXh0Pjwvc3ZnPg=='}" alt="${reference.name || ''}">
                </div>
                <div class="reference-back">
                    <div class="reference-back-title">${reference.name || 'Referans Şirketi'}</div>
                    <div class="reference-back-sector">${reference.sector || 'Genel'}</div>
                    <div class="reference-back-description">${reference.description || 'Bu referansımız ile uzun yıllardır başarılı projeler gerçekleştirmekteyiz. Kaliteli hizmet anlayışımızla müşteri memnuniyetini ön planda tutuyoruz.'}</div>
                </div>
            </div>
        `;
        
        referencesContainer.appendChild(referenceElement);
        
        // Sırayla animasyonlu göster
        setTimeout(() => {
            referenceElement.style.opacity = '1';
            referenceElement.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
            
            // Mouse takip animasyonunu başlat
            initMouseFollowCards();
            
            // Referans hover sistemini başlat
            initReferenceHoverSystem();
        }, index * 300);
    });
}

// Hizmet detay modalı aç
window.openServiceModal = function(id, title, details, image) {
    // Modal HTML oluştur
    const modalHTML = `
        <div id="service-modal" class="service-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-cogs"></i> ${title}</h2>
                    <button class="modal-close" onclick="closeServiceModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${image ? `<img src="${image}" alt="${title}" class="modal-image">` : ''}
                    <div class="modal-text">
                        <h3>Hizmet Detayları</h3>
                        <p>${details}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn modal-btn" onclick="closeServiceModal()">
                        <i class="fas fa-check"></i> Tamam
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Modal'ı sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Modal animasyonu
    setTimeout(() => {
        document.getElementById('service-modal').classList.add('show');
    }, 10);
    
    // Scroll'u engelle
    document.body.style.overflow = 'hidden';
}

// Hizmet detay modalını kapat
window.closeServiceModal = function() {
    const modal = document.getElementById('service-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'visible';
        }, 300);
    }
}

// Modal dışına tıklanınca kapat
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('service-modal')) {
        closeServiceModal();
    }
});

// ESC tuşuyla kapat
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeServiceModal();
    }
});

// Scroll Reveal Animation
function initScrollReveal() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        const delay = element.dataset.delay || 0;
        setTimeout(() => {
            element.classList.add('revealed');
        }, delay);
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('revealed');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Initial check
}

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = typingElement.dataset.text || typingElement.textContent;
    typingElement.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Cursor blink efekti
            setTimeout(() => {
                typingElement.classList.add('typing-complete');
            }, 1000);
        }
    };
    
    // 2 saniye bekle sonra başlat
    setTimeout(typeWriter, 2000);
}

// Çerez yönetimi
let userIP = null;
let cookieConsent = false;
let sessionId = null;

async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'unknown';
    }
}

function generateSessionId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

async function showCookieConsent() {
    const consentHTML = `
        <div id="cookie-consent" class="cookie-consent">
            <div class="cookie-content">
                <div class="cookie-icon">
                    <i class="fas fa-cookie-bite"></i>
                </div>
                <div class="cookie-text">
                    <h3>Çerez Kullanımı</h3>
                    <p>Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanıyoruz. <a href="cerez-aydinlatma.html" target="_blank" style="color: #FF6B35; text-decoration: underline;">Detaylı bilgi</a></p>
                </div>
                <div class="cookie-buttons">
                    <button class="cookie-btn accept" onclick="acceptCookies()">
                        <i class="fas fa-check"></i> Kabul Et
                    </button>
                    <button class="cookie-btn decline" onclick="declineCookies()">
                        <i class="fas fa-times"></i> Reddet
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', consentHTML);
    setTimeout(() => {
        document.getElementById('cookie-consent').classList.add('show');
    }, 100);
}

window.acceptCookies = async function() {
    cookieConsent = true;
    localStorage.setItem('cookieConsent', 'true');
    await saveCookieConsent(userIP, true);
    
    document.getElementById('cookie-consent').remove();
    initUserTracking();
}

window.declineCookies = async function() {
    cookieConsent = false;
    localStorage.setItem('cookieConsent', 'false');
    await saveCookieConsent(userIP, false);
    
    // Çerez reddedilse bile güvenlik amaçlı IP kaydı devam eder
    await logSecurityAccess();
    
    document.getElementById('cookie-consent').remove();
}

function initUserTracking() {
    if (!cookieConsent) return;
    
    let mouseData = [];
    let sectionTime = {};
    let currentSection = null;
    let sectionStartTime = Date.now();
    
    document.addEventListener('mousemove', function(e) {
        const section = getCurrentSection(e.clientY);
        const cardElement = getCardElement(e.target);
        
        // Bölüm değişimi takibi
        if (section !== currentSection) {
            if (currentSection) {
                const timeSpent = Date.now() - sectionStartTime;
                sectionTime[currentSection] = (sectionTime[currentSection] || 0) + timeSpent;
            }
            currentSection = section;
            sectionStartTime = Date.now();
        }
        
        mouseData.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now(),
            section: section,
            cardType: cardElement?.type || null,
            cardId: cardElement?.id || null,
            cardTitle: cardElement?.title || null
        });
        
        if (mouseData.length >= 20) {
            saveActivity('mouse_movement', { 
                movements: mouseData,
                sectionTimes: sectionTime
            });
            mouseData = [];
        }
    });
    
    document.addEventListener('click', function(e) {
        const cardElement = getCardElement(e.target);
        saveActivity('click_activity', {
            element: e.target.tagName,
            text: e.target.textContent?.substring(0, 30),
            section: getCurrentSection(e.clientY),
            cardType: cardElement?.type || null,
            cardId: cardElement?.id || null,
            cardTitle: cardElement?.title || null
        });
    });
    
    // Sayfa terk etme
    window.addEventListener('beforeunload', function() {
        if (currentSection) {
            const timeSpent = Date.now() - sectionStartTime;
            sectionTime[currentSection] = (sectionTime[currentSection] || 0) + timeSpent;
        }
        
        if (mouseData.length > 0 || Object.keys(sectionTime).length > 0) {
            saveActivity('session_summary', {
                movements: mouseData,
                sectionTimes: sectionTime,
                totalSessionTime: Date.now() - sessionStartTime
            });
        }
    });
}

function getCardElement(target) {
    // Kart elementini bul
    let element = target;
    while (element && element !== document.body) {
        if (element.classList.contains('service-card')) {
            return {
                type: 'service',
                id: element.dataset.id || 'unknown',
                title: element.querySelector('h3')?.textContent || 'unknown'
            };
        }
        if (element.classList.contains('project-card')) {
            return {
                type: 'project',
                id: element.dataset.id || 'unknown',
                title: element.querySelector('h3')?.textContent || 'unknown'
            };
        }
        if (element.classList.contains('employee-card')) {
            return {
                type: 'employee',
                id: element.dataset.id || 'unknown',
                title: element.querySelector('h3')?.textContent || 'unknown'
            };
        }
        if (element.classList.contains('reference-item')) {
            return {
                type: 'reference',
                id: element.dataset.id || 'unknown',
                title: element.querySelector('h4')?.textContent || 'unknown'
            };
        }
        element = element.parentElement;
    }
    return null;
}

function getCurrentSection(mouseY) {
    const sections = [
        { id: 'home', name: 'Anasayfa' },
        { id: 'services', name: 'Hizmetler' },
        { id: 'employees', name: 'Uzman Ailemiz' },
        { id: 'projects', name: 'Projelerimiz' },
        { id: 'references', name: 'Referanslarımız' }
    ];
    
    for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (mouseY >= rect.top && mouseY <= rect.bottom) {
                return section.name;
            }
        }
    }
    return 'Bilinmeyen Bölüm';
}

let sessionStartTime = Date.now();

async function saveActivity(type, data) {
    if (!cookieConsent) return;
    
    await saveUserActivity({
        sessionId: sessionId,
        ipAddress: userIP,
        activityType: type,
        data: data,
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timestamp: new Date().toISOString(),
        sessionDuration: Date.now() - sessionStartTime
    });
}

// Scroll indicator click handler
document.addEventListener('DOMContentLoaded', async function() {
    userIP = await getUserIP();
    sessionId = generateSessionId();
    
    const existingConsent = await checkCookieConsent(userIP);
    const localConsent = localStorage.getItem('cookieConsent');
    
    if (existingConsent !== null || localConsent !== null) {
        cookieConsent = existingConsent === true || localConsent === 'true';
        if (cookieConsent) {
            initUserTracking();
        }
    }
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const servicesSection = document.querySelector('#services');
            if (servicesSection) {
                servicesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    initScrollReveal();
    initTypingAnimation();
    setTimeout(() => {
        animateSVGPaths();
        initMouseFollowCards();
        initReferenceHoverSystem();
    }, 1000);
});

// Referans kartları için özel hover sistemi
function initReferenceHoverSystem() {
    const referenceItems = document.querySelectorAll('.reference-item');
    
    referenceItems.forEach(item => {
        // Mouse enter - büyüt ve diğerlerini küçült
        item.addEventListener('mouseenter', () => {
            item.classList.add('active');
            
            referenceItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.add('shrink');
                }
            });
        });
        
        // Mouse leave - hepsini normale döndür
        item.addEventListener('mouseleave', () => {
            referenceItems.forEach(allItem => {
                allItem.classList.remove('active', 'shrink');
            });
        });
        
        // Click - toggle büyütme
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (item.classList.contains('active')) {
                // Zaten aktifse hepsini normale döndür
                referenceItems.forEach(allItem => {
                    allItem.classList.remove('active', 'shrink');
                });
            } else {
                // Aktif değilse bu kartı büyüt, diğerlerini küçült
                item.classList.add('active');
                referenceItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.add('shrink');
                    }
                });
            }
        });
    });
}
});

// Mouse takip eden kart animasyonları
function initMouseFollowCards() {
    const isMobile = window.innerWidth <= 768;
    
    // Referans kartları
    document.querySelectorAll('.reference-item').forEach(card => {
        const container = card.querySelector('.reference-container');
        
        if (isMobile) {
            // Mobil için otomatik geri dönme animasyonu
            card.addEventListener('click', (e) => {
                e.preventDefault();
                container.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                
                if (!card.dataset.rotated) {
                    container.style.transform = 'rotateY(15deg) rotateX(8deg) scale(1.05)';
                    card.dataset.rotated = 'true';
                    
                    // 15 saniye sonra otomatik geri dön
                    setTimeout(() => {
                        container.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                        card.dataset.rotated = '';
                    }, 15000);
                }
            });
        } else {
            // Desktop için mouse eventleri
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (centerY - y) / 10;
                const rotateY = (x - centerX) / 10;
                
                container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
                container.style.boxShadow = '0 40px 120px rgba(0, 18, 72, 0.35)';
            });
            
            card.addEventListener('mouseleave', () => {
                container.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                container.style.boxShadow = '0 25px 80px rgba(0, 18, 72, 0.2)';
            });
        }
    });
    
    // Çalışan kartları
    document.querySelectorAll('.employee-card').forEach(card => {
        const container = card.querySelector('.employee-container');
        
        if (isMobile) {
            // Mobil için otomatik geri dönme animasyonu
            card.addEventListener('click', (e) => {
                e.preventDefault();
                container.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                
                if (!card.dataset.rotated) {
                    container.style.transform = 'rotateY(-15deg) rotateX(-8deg) scale(1.05)';
                    card.dataset.rotated = 'true';
                    
                    // 15 saniye sonra otomatik geri dön
                    setTimeout(() => {
                        container.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                        card.dataset.rotated = '';
                    }, 15000);
                }
            });
        } else {
            // Desktop için mouse eventleri
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (centerY - y) / 10;
                const rotateY = (x - centerX) / 10;
                
                container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
                container.style.boxShadow = '0 40px 120px rgba(0, 18, 72, 0.35)';
            });
            
            card.addEventListener('mouseleave', () => {
                container.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                container.style.boxShadow = '0 25px 80px rgba(0, 18, 72, 0.2)';
            });
        }
    });
}

// SVG Path animasyonları
function animateSVGPaths() {
    const svgPaths = document.querySelectorAll('.section-wave path');
    
    svgPaths.forEach((path, index) => {
        const originalD = path.getAttribute('d');
        let time = 0;
        
        function animatePath() {
            time += 0.02;
            
            // Path'i hafifçe deforme et
            const deformation = Math.sin(time + index) * 3;
            const deformation2 = Math.cos(time * 1.5 + index) * 2;
            
            // Orijinal path'i al ve hafifçe değiştir
            let newPath = originalD.replace(/([0-9.]+),([0-9.]+)/g, (match, x, y) => {
                const newX = parseFloat(x) + Math.sin(time + parseFloat(x) * 0.01) * deformation;
                const newY = parseFloat(y) + Math.cos(time + parseFloat(y) * 0.01) * deformation2;
                return `${newX},${newY}`;
            });
            
            path.setAttribute('d', newPath);
            requestAnimationFrame(animatePath);
        }
        
        // Her path için farklı gecikme
        setTimeout(() => {
            animatePath();
        }, index * 500);
    });
}

// Firebase fonksiyonlarını kullan
async function saveCookieConsent(ip, consent) {
    try {
        const { saveCookieConsent: fbSaveCookieConsent } = await import('./firebase.js');
        await fbSaveCookieConsent(ip, consent);
        console.log('Cookie consent saved:', { ip, consent });
    } catch (error) {
        console.error('Cookie consent save error:', error);
    }
}

async function saveUserActivity(data) {
    try {
        const { saveUserActivity: fbSaveUserActivity } = await import('./firebase.js');
        await fbSaveUserActivity(data);
        console.log('User activity saved:', data);
    } catch (error) {
        console.error('User activity save error:', error);
    }
}

async function checkCookieConsent(ip) {
    try {
        const { checkCookieConsent: fbCheckCookieConsent } = await import('./firebase.js');
        const result = await fbCheckCookieConsent(ip);
        console.log('Cookie consent checked for IP:', ip, 'Result:', result);
        return result;
    } catch (error) {
        console.error('Cookie consent check error:', error);
        return null;
    }
}

// Güvenlik amaçlı IP kaydetme (yasal zorunluluk)
async function logSecurityAccess() {
    try {
        const ip = await getUserIP();
        const securityData = {
            ipAddress: ip,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer || 'direct',
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            purpose: 'security_legal_compliance'
        };
        
        await saveSecurityLog(securityData);
    } catch (error) {
        console.error('Security log error:', error);
    }
}



// Loading sonrası çerez göster
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            loadingScreen.remove();
            document.body.style.overflow = 'visible';
            initializePageAnimations();
            
            // Çerez onayını kontrol et ve göster
            setTimeout(async () => {
                try {
                    const existingConsent = await checkCookieConsent(userIP);
                    const localConsent = localStorage.getItem('cookieConsent');
                    
                    console.log('Cookie consent check:', { existingConsent, localConsent, userIP });
                    
                    if (existingConsent === null && localConsent === null) {
                        console.log('Showing cookie consent modal');
                        showCookieConsent();
                    } else {
                        console.log('Cookie consent already exists, not showing modal');
                        if (existingConsent === true || localConsent === 'true') {
                            cookieConsent = true;
                            initUserTracking();
                        }
                    }
                } catch (error) {
                    console.error('Cookie consent check error:', error);
                    // Hata durumunda da çerez onayını göster
                    showCookieConsent();
                }
            }, 1000);
        }, 800);
    }, 2000);
});