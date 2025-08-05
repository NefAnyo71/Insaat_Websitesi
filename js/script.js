import { getServices, getProjects, getEmployees, getReferences, getSiteName, getFavicon, getExperience, getHeroImage } from './firebase.js';

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
        // Site adını yükle - devre dışı
        // const siteName = await getSiteName();
        // updateSiteName(siteName);
        
        // Favicon yükle
        const faviconUrl = await getFavicon();
        if (faviconUrl) {
            updatePageFavicon(faviconUrl);
        }

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

        // Deneyim bilgilerini yükle
        const experience = await getExperience();
        renderExperience(experience);

        // Hero görselini yükle
        const heroImageUrl = await getHeroImage();
        if (heroImageUrl && heroImageUrl !== 'default') {
            updateHeroBackground(heroImageUrl);
        }

    } catch (error) {
        console.error('Veri yükleme hatası:', error);
    }
}

// Site adını güncelle
function updateSiteName(siteName) {
    // Navbar'daki logo
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
        const parts = siteName.split(' ');
        if (parts.length >= 2) {
            logoElement.innerHTML = `${parts[0]}<span>${parts.slice(1).join(' ')}</span>`;
        } else {
            logoElement.innerHTML = `${siteName}<span></span>`;
        }
    }
    
    // Loading screen'deki logo
    const loadingLogo = document.querySelector('.loading-logo h2');
    if (loadingLogo) {
        const parts = siteName.split(' ');
        if (parts.length >= 2) {
            loadingLogo.innerHTML = `${parts[0]}<span>${parts.slice(1).join(' ')}</span>`;
        } else {
            loadingLogo.innerHTML = `${siteName}<span></span>`;
        }
    }
    
    // Footer
    const footerText = document.querySelector('footer p');
    if (footerText) {
        footerText.innerHTML = `&copy; 2025 ${siteName}. Tüm hakları saklıdır.`;
    }
    
    // Title
    document.title = siteName;
}

// Sayfa favicon'ını güncelle
function updatePageFavicon(faviconUrl) {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
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
        serviceElement.style.transform = 'translateY(120px) scale(0.6) rotateX(30deg) rotateY(-15deg)';
        serviceElement.style.transition = 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)';
        serviceElement.style.filter = 'blur(10px)';
        
        // Hizmet numarası ve kategori rengi
        const serviceNumber = String(index + 1).padStart(2, '0');
        const categoryColors = ['#FF6B35', '#F7931E', '#0056b3', '#28a745', '#dc3545', '#6f42c1'];
        const categoryColor = categoryColors[index % categoryColors.length];
        
        // Dinamik ikon belirleme
        const getServiceIcon = (title, category) => {
            const titleLower = (title || '').toLowerCase();
            const categoryLower = (category || '').toLowerCase();
            
            if (titleLower.includes('inşaat') || titleLower.includes('yapı')) return 'fas fa-building';
            if (titleLower.includes('tasarım') || titleLower.includes('mimari')) return 'fas fa-drafting-compass';
            if (titleLower.includes('tadilat') || titleLower.includes('renovasyon')) return 'fas fa-hammer';
            if (titleLower.includes('elektrik')) return 'fas fa-bolt';
            if (titleLower.includes('su') || titleLower.includes('tesisat')) return 'fas fa-tint';
            if (titleLower.includes('boya') || titleLower.includes('boyama')) return 'fas fa-paint-roller';
            if (titleLower.includes('düşey') || titleLower.includes('yüksek')) return 'fas fa-city';
            if (titleLower.includes('peyzaj') || titleLower.includes('bahçe')) return 'fas fa-seedling';
            if (titleLower.includes('danışmanlık')) return 'fas fa-user-tie';
            return 'fas fa-cogs';
        };
        
        const serviceIcon = getServiceIcon(service.title, service.category);
        
        // Görsel rotasyonu için
        const images = service.images && service.images.length > 0 ? service.images : (service.image ? [service.image] : []);
        const hasImages = images.length > 0;
        
        serviceElement.innerHTML = `
            <div class="service-card-container">
                <div class="service-hologram"></div>
                <div class="service-header" ${hasImages ? '' : `style="background: linear-gradient(135deg, #667eea, #764ba2)"`}>
                    ${hasImages ? `
                        <div class="service-image-slider">
                            ${images.map((img, imgIndex) => `
                                <img src="${img}" alt="${service.title}" class="service-slide ${imgIndex === 0 ? 'active' : ''}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; opacity: ${imgIndex === 0 ? 1 : 0}; transition: opacity 0.5s ease;">
                            `).join('')}
                        </div>
                    ` : `
                        <div class="service-icon-main">
                            <i class="${serviceIcon}"></i>
                        </div>
                    `}
                </div>
                
                <div class="service-body">
                    <div class="service-number-badge">${serviceNumber}</div>
                    
                    ${service.category ? `<span class="service-category-pill">${service.category}</span>` : ''}
                    
                    <h3 class="service-title">${service.title || ''}</h3>
                    
                    <p class="service-description">${service.description || ''}</p>
                    
                    <div class="service-features-mini">
                        ${service.features ? service.features.split(',').slice(0, 4).map((f, i) => `<span class="feature-mini" style="--i: ${i}">${f.trim()}</span>`).join('') : ''}
                    </div>
                    
                    ${(service.instagram || service.whatsapp || service.gmail) ? `
                        <div class="service-social-links">
                            ${service.instagram ? `<a href="${service.instagram}" target="_blank" class="service-social-btn instagram"><i class="fab fa-instagram"></i></a>` : ''}
                            ${service.whatsapp ? `<a href="https://wa.me/${service.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="service-social-btn whatsapp"><i class="fab fa-whatsapp"></i></a>` : ''}
                            ${service.gmail ? `<a href="mailto:${service.gmail}" class="service-social-btn gmail"><i class="fas fa-envelope"></i></a>` : ''}
                        </div>
                    ` : ''}
                    
                    <button class="service-action-btn" onclick="toggleServiceDetails(this)">
                        <i class="fas fa-chevron-down"></i> DETAYLAR
                    </button>
                    
                    <div class="service-expanded-content">
                        <div class="service-details-wrapper">
                            <h4 style="color: #FF6B35; margin-bottom: 1rem; font-size: 1.1rem;">Detaylar:</h4>
                            <p style="font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; line-height: 1.6;">${service.details || service.description || 'Bu hizmet hakkında detaylı bilgi için bizimle iletişime geçin.'}</p>
                            <div class="service-features">
                                ${service.features ? service.features.split(',').map(f => `<span class="feature-tag" style="background: rgba(255, 107, 53, 0.1); color: #FF6B35; border: 1px solid rgba(255, 107, 53, 0.3); padding: 0.3rem 0.6rem; border-radius: 12px; font-size: 0.75rem; margin: 0.2rem; display: inline-block;">${f.trim()}</span>`).join('') : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Metin stilini uygula (sadece resimli hizmetler için)
        const textElement = serviceElement.querySelector('.service-text-overlay');
        if (textElement && service.textStyle && service.text) {
            applyTextStyleToElement(textElement, service.textStyle);
        }
        
        // 3D hover efekti ekle
        serviceElement.classList.add('hover-3d');
        
        // Görsel rotasyonu başlat (sadece birden fazla görsel varsa)
        if (images.length > 1) {
            let currentImageIndex = 0;
            const slides = serviceElement.querySelectorAll('.service-slide');
            
            setInterval(() => {
                slides[currentImageIndex].style.opacity = '0';
                currentImageIndex = (currentImageIndex + 1) % images.length;
                slides[currentImageIndex].style.opacity = '1';
            }, 2000);
        }
        
        // Kart tıklama eventi
        serviceElement.addEventListener('click', function(e) {
            if (!e.target.closest('.service-action-btn') && !e.target.closest('.service-social-btn')) {
                if (window.innerWidth <= 768) {
                    openServiceModal(service);
                } else {
                    toggleServiceDetails(this.querySelector('.service-action-btn'));
                }
            }
        });
        
        serviceElement.addEventListener('mouseenter', function() {
            if (typeof logServiceInteraction === 'function') {
                logServiceInteraction(service.id, 'card_hover');
            }
        });
        
        servicesContainer.appendChild(serviceElement);
        
        // Sırayla animasyonlu göster
        setTimeout(() => {
            serviceElement.style.opacity = '1';
            serviceElement.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
            serviceElement.style.filter = 'blur(0px)';
            
            // Kart belirdikten sonra içerik animasyonu
            setTimeout(() => {
                const icon = serviceElement.querySelector('.service-icon, .service-text-display, .service-image-container');
                const title = serviceElement.querySelector('h3');
                const desc = serviceElement.querySelector('p');
                const number = serviceElement.querySelector('.service-number');
                const category = serviceElement.querySelector('.service-category');
                const features = serviceElement.querySelectorAll('.feature-tag');
                const button = serviceElement.querySelector('.service-details-btn');
                
                if (icon) {
                    icon.style.animation = 'iconPulse 4s ease-in-out infinite, iconBounceIn 0.8s ease-out';
                }
                if (title) {
                    title.style.animation = 'textSlideIn 0.6s ease-out 0.2s both, textGlow 3s ease-in-out infinite alternate 1s';
                }
                if (desc) {
                    desc.style.animation = 'textSlideIn 0.6s ease-out 0.4s both';
                }
                if (number) {
                    number.style.animation = 'numberBounce 2s ease-in-out infinite 0.6s, numberSpinIn 0.8s ease-out';
                }
                if (category) {
                    category.style.animation = 'categorySlideIn 0.5s ease-out 0.1s both';
                }
                if (button) {
                    button.style.animation = 'buttonBounceIn 0.6s ease-out 0.8s both';
                }
                
                // Özellik etiketlerini sırayla animasyonla
                features.forEach((feature, idx) => {
                    feature.style.animation = `featureSlideIn 0.4s ease-out ${0.6 + idx * 0.1}s both`;
                });
            }, 300);
        }, index * 300);
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
        projectElement.style.transform = 'translateY(120px) rotateX(30deg) rotateY(-15deg) scale(0.7)';
        projectElement.style.transition = 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)';
        projectElement.style.filter = 'blur(8px)';
        
        projectElement.innerHTML = `
            <div class="project-card-container">
                <div class="project-image-container">
                    <img src="${project.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjM1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9qZSBHw7xyc2VsaTwvdGV4dD48L3N2Zz4='}" alt="${project.title || ''}">
                    <div class="project-image-glow"></div>
                    <div class="project-text-overlay">
                        <span class="project-text-content">${project.text || ''}</span>
                    </div>
                    <div class="project-shine"></div>
                </div>
                <div class="project-info">
                    <span class="project-category">${project.category || ''}</span>
                    <h3>${project.title || ''}</h3>
                    <p>${project.description || ''}</p>
                </div>
            </div>
        `;
        
        // Metin stilini uygula
        const textElement = projectElement.querySelector('.project-text-content');
        if (textElement && project.textStyle) {
            applyTextStyleToElement(textElement, project.textStyle);
        }
        
        // Mobil cihazlar için tıklama eventi
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            projectElement.addEventListener('click', function(e) {
                e.preventDefault();
                const container = this.querySelector('.project-card-container');
                container.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                
                if (!this.dataset.rotated) {
                    this.classList.add('mobile-rotated');
                    this.dataset.rotated = 'true';
                    
                    // 10 saniye sonra otomatik geri dön
                    setTimeout(() => {
                        this.classList.remove('mobile-rotated');
                        this.dataset.rotated = '';
                    }, 10000);
                } else {
                    this.classList.remove('mobile-rotated');
                    this.dataset.rotated = '';
                }
            });
        }
        
        projectsContainer.appendChild(projectElement);
        
        // Sırayla animasyonlu göster
        setTimeout(() => {
            projectElement.style.opacity = '1';
            projectElement.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
            projectElement.style.filter = 'blur(0px)';
        }, index * 250);
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
        const referenceImageUrl = reference.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=entropy&auto=format';
        
        referenceElement.innerHTML = `
            <div class="reference-container">
                <div class="reference-glow"></div>
                <div class="reference-image" style="background-image: url('${referenceImageUrl}')"></div>
                <div class="reference-overlay"></div>
                <div class="reference-content">
                    <div class="reference-avatar">
                        <img src="${reference.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMTI0OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9nbzwvdGV4dD48L3N2Zz4='}" alt="${reference.name || ''}">
                    </div>
                    <div class="reference-name">${reference.name || 'Referans Şirketi'}</div>
                    <div class="reference-sector-tag">${reference.sector || 'Genel'}</div>
                    <div class="reference-description">${reference.description || 'Bu referansımız ile uzun yıllardır başarılı projeler gerçekleştirmekteyiz. Kaliteli hizmet anlayışımızla müşteri memnuniyetini ön planda tutuyoruz.'}</div>
                </div>
            </div>
        `;
        
        referencesContainer.appendChild(referenceElement);
        
        // Sırayla animasyonlu göster
        setTimeout(() => {
            referenceElement.style.opacity = '1';
            referenceElement.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
        }, index * 300);
    });
}

// Deneyim bilgilerini render et
function renderExperience(experience) {
    const experienceContainer = document.querySelector('.animated-experience');
    if (!experienceContainer) return;

    // Yıl rozeti güncelle
    const yearsBadge = experienceContainer.querySelector('.badge-number');
    if (yearsBadge) {
        yearsBadge.textContent = experience.years + '+';
    }

    // Başlık güncelle
    const title = experienceContainer.querySelector('.experience-title');
    if (title) {
        title.textContent = experience.title;
    }

    // Açıklama güncelle
    const description = experienceContainer.querySelector('.experience-description');
    if (description) {
        // İkonları koru, sadece metni güncelle
        const icons = description.querySelectorAll('i');
        const iconHTML = icons.length > 0 ? 
            `<i class="${icons[0].className}"></i> ${experience.description} <i class="${icons[1] ? icons[1].className : 'fas fa-trophy pulse-icon'}"></i>` :
            `<i class="fas fa-award pulse-icon"></i> ${experience.description} <i class="fas fa-trophy pulse-icon"></i>`;
        description.innerHTML = iconHTML;
    }
}

// Hero arka plan görselini güncelle
function updateHeroBackground(imageUrl) {
    const heroSection = document.querySelector('.hero');
    if (heroSection && imageUrl) {
        heroSection.style.background = `linear-gradient(rgba(0, 18, 72, 0.7), rgba(0, 18, 72, 0.7)), url('${imageUrl}') no-repeat center/cover`;
    }
}



// Hizmet detay modalı aç
window.openServiceModal = function(service) {
    const images = service.images && service.images.length > 0 ? service.images : (service.image ? [service.image] : []);
    const hasImages = images.length > 0;
    
    const modalHTML = `
        <div id="service-modal" class="service-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-cogs"></i> ${service.title}</h2>
                    <button class="modal-close" onclick="closeServiceModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${hasImages ? `
                        <div class="modal-image-slider">
                            ${images.map((img, index) => `
                                <img src="${img}" alt="${service.title}" class="modal-slide ${index === 0 ? 'active' : ''}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 10px; ${index === 0 ? 'display: block;' : 'display: none;'}">
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="modal-text">
                        <h3>Hizmet Detayları</h3>
                        <p>${service.details || service.description}</p>
                        ${(service.instagram || service.whatsapp || service.gmail) ? `
                            <div class="modal-social-links" style="margin-top: 1rem; text-align: center;">
                                ${service.instagram ? `<a href="${service.instagram}" target="_blank" class="service-social-btn instagram"><i class="fab fa-instagram"></i></a>` : ''}
                                ${service.whatsapp ? `<a href="https://wa.me/${service.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="service-social-btn whatsapp"><i class="fab fa-whatsapp"></i></a>` : ''}
                                ${service.gmail ? `<a href="mailto:${service.gmail}" class="service-social-btn gmail"><i class="fas fa-envelope"></i></a>` : ''}
                            </div>
                        ` : ''}
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
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Görsel rotasyonu başlat
    if (images.length > 1) {
        let currentIndex = 0;
        const slides = document.querySelectorAll('.modal-slide');
        
        setInterval(() => {
            slides[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % images.length;
            slides[currentIndex].style.display = 'block';
        }, 2000);
    }
    
    setTimeout(() => {
        document.getElementById('service-modal').classList.add('show');
    }, 10);
    
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







// Scroll indicator click handler
document.addEventListener('DOMContentLoaded', async function() {
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
    }, 1000);
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



// Hizmet detaylarını aç/kapat
window.toggleServiceDetails = function(button) {
    const serviceCard = button.closest('.service-card');
    const expandedContent = serviceCard.querySelector('.service-expanded-content');
    const cardContainer = serviceCard.querySelector('.service-card-container');
    const isExpanded = serviceCard.classList.contains('expanded');
    
    if (!isExpanded) {
        // Açılıyor
        serviceCard.classList.add('expanded');
        cardContainer.style.transform = 'rotateY(180deg)';
        
        setTimeout(() => {
            expandedContent.style.display = 'block';
            expandedContent.style.opacity = '1';
            expandedContent.style.transform = 'rotateY(0deg)';
            cardContainer.style.transform = 'rotateY(0deg)';
        }, 300);
        
        button.innerHTML = '<i class="fas fa-chevron-up"></i> KAPAT';
    } else {
        // Kapanıyor
        cardContainer.style.transform = 'rotateY(-180deg)';
        expandedContent.style.opacity = '0';
        expandedContent.style.transform = 'rotateY(180deg)';
        
        setTimeout(() => {
            serviceCard.classList.remove('expanded');
            expandedContent.style.display = 'none';
            cardContainer.style.transform = 'rotateY(0deg)';
        }, 300);
        
        button.innerHTML = '<i class="fas fa-chevron-down"></i> DETAYLAR';
    }
};

