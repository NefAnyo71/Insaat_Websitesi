import { getServices, getProjects, getEmployees, getReferences, getSiteName, getFavicon, getExperience, getHeroImage, getHeroSlides, addContactMessage, getContactInfo } from './firebase.js';

document.addEventListener('DOMContentLoaded', function() {
    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = `&copy; ${currentYear} Kef Yapı. Tüm hakları saklıdır.`;
    }
});

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

        // Start hero text animation after a delay
        setTimeout(startHeroAnimation, 5500); // Metin animasyonları bittikten 3 saniye sonra başlasın
        setTimeout(startHeroAnimation, 4500); // Metin animasyonları bittikten 2 saniye sonra başlasın
    }, 2000); 
});

// Sayfa yüklendiğinde Firebase'den verileri çek
document.addEventListener('DOMContentLoaded', async function() {
    // Loading sırasında scroll'u engelle
    document.body.style.overflow = 'hidden';
    
    await loadDynamicContent();
    initializeAnimations();
    
    // Hover event'lerini başlat
    setTimeout(() => {
        initServiceCardHovers();
    }, 1000); // İçerik yüklendikten sonra hover'ları başlat

    // İletişim formu gönderimini handle et
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;

            const success = await addContactMessage({ name, email, subject, message });

            if (success) {
                alert('Mesajınız başarıyla gönderildi. En kısa sürede size geri döneceğiz.');
                contactForm.reset();
            } else {
                alert('Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        });
    }
});

// Firebase'den dinamik içerikleri yükle
async function loadDynamicContent() {
    try {
        // Site adını yükle - devre dışı
        // const siteName = await getSiteName();
        // updateSiteName(siteName);
        
        // Favicon'ı yükle (statik logo kullanılıyor)
        updatePageFavicon();

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

        // Hero slider'ı yükle
        const slides = await getHeroSlides();
        if (slides.length > 0) {
            renderHeroSlider(slides);
        }

        // İletişim bilgilerini yükle
        const contactInfo = await getContactInfo();
        renderContactInfo(contactInfo);

        // Global scope'a initMap fonksiyonunu ekle
        window.initMap = () => {
            initializeGoogleMap(contactInfo);
        };

        // Eğer Google Maps API zaten yüklendiyse haritayı başlat
        // Bu kontrol, defer ve async ile yüklenen scriptlerde her zaman doğru çalışmayabilir.
        // initMap callback'i zaten API yüklendiğinde çağrılacak.
        // Ancak DOMContentLoaded sırasında API henüz yüklenmemişse bu kısım çalışmaz.
        // initMap callback'i ana mekanizma olmalı.
        // if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        //     initializeGoogleMap(contactInfo);
        // }

    } catch (error) {
        console.error('Veri yükleme hatası:', error);
    }
}

// Google Map'i başlatan fonksiyon
async function initializeGoogleMap(contactInfo) {
    const geocoder = new google.maps.Geocoder();
    const address = contactInfo.address;

    if (!address || address === 'Adres bilgisi girilmemiş.') {
        console.warn("Harita için adres bilgisi bulunamadı veya geçersiz.");
        // Varsayılan bir konum gösterebiliriz veya haritayı gizleyebiliriz.
        // Şimdilik varsayılan bir konum gösterelim (Bodrum merkezi gibi).
        const defaultLocation = { lat: 37.0343, lng: 27.4296 }; // Bodrum, Türkiye
        renderMap(defaultLocation, "Varsayılan Konum");
        return;
    }

    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            renderMap(location, address);
        } else {
            console.error('Geocoding başarısız oldu: ' + status);
            // Geocoding başarısız olursa varsayılan bir konum göster
            const defaultLocation = { lat: 37.0343, lng: 27.4296 }; // Bodrum, Türkiye
            renderMap(defaultLocation, "Varsayılan Konum (Adres bulunamadı)");
        }
    });
}

function renderMap(location, title) {
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("Harita elementi bulunamadı!");
        return;
    }

    const map = new google.maps.Map(mapElement, {
        zoom: 15,
        center: location,
        mapId: 'KefYapi_Map' // Harita stiliniz için bir ID
    });

    new google.maps.Marker({ position: location, map: map, title: title });
}

// İletişim bilgilerini render et
function renderContactInfo(info) {
    const list = document.getElementById('contact-details-list');
    if (!list) return;

    list.innerHTML = `
        <li><i class="fas fa-map-marker-alt"></i> <span>${info.address || 'Adres bilgisi girilmemiş.'}</span></li>
        <li><i class="fas fa-phone-alt"></i> <a href="tel:${(info.phone || '').replace(/\s/g, '')}">${info.phone || 'Telefon bilgisi girilmemiş.'}</a></li>
        <li><i class="fas fa-envelope"></i> <a href="mailto:${info.email || ''}">${info.email || 'E-posta bilgisi girilmemiş.'}</a></li>
    `;
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
        footerText.innerHTML = `&copy; ${new Date().getFullYear()} ${siteName}. Tüm hakları saklıdır.`;
    }

    // Title
    document.title = siteName;
}

// Sayfa favicon'ını güncelle - Şeffaf arka planlı logo kullanılıyor
function updatePageFavicon() {
    // Mevcut tüm favicon linklerini temizle
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
existingLinks.forEach(link => link.remove());

    // Yeni favicon linkini oluştur
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'assets/images/favicon.png';

    // Farklı boyutlar için alternatif favicon tanımları
    const link192 = document.createElement('link');
    link192.rel = 'icon';
    link192.type = 'image/png';
    link192.sizes = '192x192';
    link192.href = 'assets/images/favicon.png';

    const link32 = document.createElement('link');
    link32.rel = 'icon';
    link32.type = 'image/png';
    link32.sizes = '32x32';
    link32.href = 'assets/images/favicon.png';

    // Head'e ekle
    document.head.appendChild(link);
    document.head.appendChild(link192);
    document.head.appendChild(link32);
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
                const button = serviceElement.querySelector('.service-action-btn');

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
                    <div class="employee-experience">${employee.experience ? employee.experience + ' Yıl Deneyim' : ''}</div>
                    <div class="employee-text" style="margin: 10px 0;">
                        <span class="employee-text-content">${employee.text || ''}</span>
                    </div>
                    <div class="employee-dates" style="font-size: 0.75em; opacity: 0.7;">
                        ${employee.createdAt ? `<span>Eklenme: ${formatEmployeeDate(employee.createdAt)}</span>` : ''}
                        ${employee.updatedAt ? `<span style='margin-left:8px;'>Güncelleme: ${formatEmployeeDate(employee.updatedAt)}</span>` : ''}
                    </div>
                </div>
            </div>
        `;

        // TextStyle uygula
        const textContent = employeeElement.querySelector('.employee-text-content');
        if (textContent && employee.textStyle) {
            applyTextStyleToElement(textContent, employee.textStyle);
        }

        // Tarih formatlama fonksiyonu
        function formatEmployeeDate(dateValue) {
            // Firestore Timestamp ise
            if (typeof dateValue === 'object' && dateValue.seconds) {
                const d = new Date(dateValue.seconds * 1000);
                return d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' });
            } else if (typeof dateValue === 'string') {
                // ISO veya başka string ise
                const d = new Date(dateValue);
                if (!isNaN(d)) return d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' });
                return dateValue;
            }
            return '';
        }

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
// Referans detay modalı aç
window.openReferenceModal = function(reference) {
    const modalHTML = `
        <div id="reference-modal" class="reference-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-building"></i> ${reference.name || 'Referans'}</h2>
                    <button class="modal-close" onclick="closeReferenceModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="reference-modal-image" style="background-image: url('${reference.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMTI0OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9nbzwvdGV4dD48L3N2Zz4='}')"></div>
                    <div class="modal-text">
                        <div class="reference-info">
                            <span class="reference-sector">${reference.sector || 'Genel'}</span>
                            <h3>${reference.name || 'Referans Şirketi'}</h3>
                        </div>
                        <p>${reference.description || 'Bu referansımız ile uzun yıllardır başarılı projeler gerçekleştirmekteyiz. Kaliteli hizmet anlayışımızla müşteri memnuniyetini ön planda tutuyoruz.'}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn modal-btn" onclick="closeReferenceModal()">
                        <i class="fas fa-check"></i> Kapat
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    setTimeout(() => {
        document.getElementById('reference-modal').classList.add('show');
    }, 10);

    document.body.style.overflow = 'hidden';
}

// Referans detay modalını kapat
window.closeReferenceModal = function() {
    const modal = document.getElementById('reference-modal');
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
    if (e.target.classList.contains('reference-modal')) {
        closeReferenceModal();
    }
});

// ESC tuşuyla kapat
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('reference-modal')) {
        closeReferenceModal();
    }
});

function renderReferences(references) {
    const referencesContainer = document.getElementById('references-list');
    if (!referencesContainer) return;

    referencesContainer.innerHTML = '';

    references.forEach((reference, index) => {
        const referenceElement = document.createElement('div');
        referenceElement.className = 'reference-item';
        referenceElement.onclick = () => openReferenceModal(reference);

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
                    <div class="reference-more">Daha fazla bilgi için tıklayın</div>
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

    // Get the text from data-text attribute or fallback to current text
    const fullText = typingElement.dataset.text || typingElement.textContent;
    typingElement.innerHTML = ''; // Clear the element

    // Create a text node for the main text
    const textNode = document.createTextNode('');
    // Create a span for the highlighted part
    const spanElement = document.createElement('span');

    // Reconstruct the element structure
    typingElement.appendChild(textNode);
    typingElement.appendChild(spanElement);

    let i = 0;
    let isInSpan = false;
    let mainText = '';
    let spanText = '';

    // Parse the text to separate main text and span content
    for (let j = 0; j < fullText.length; j++) {
        if (fullText.substring(j, j + 6) === '<span>') {
            isInSpan = true;
            j += 5; // Skip the <span> tag
        } else if (fullText.substring(j, j + 7) === '</span>') {
            isInSpan = false;
            j += 6; // Skip the </span> tag
        } else {
            if (isInSpan) {
                spanText += fullText[j];
            } else {
                mainText += fullText[j];
            }
        }
    }

    // Type the main text first
    const typeMainText = () => {
        if (i < mainText.length) {
            textNode.textContent += mainText[i];
            i++;
            setTimeout(typeMainText, 100);
        } else {
            // Start typing the span text
            i = 0;
            setTimeout(typeSpanText, 300);
        }
    };

    // Type the span text
    const typeSpanText = () => {
        if (i < spanText.length) {
            spanElement.textContent += spanText[i];
            i++;
            setTimeout(typeSpanText, 100);
        } else {
            // Animation complete
            setTimeout(() => {
                typingElement.classList.add('typing-complete');
            }, 1000);
        }
    };

    // Start the animation after 2 seconds
    setTimeout(typeMainText, 2000);
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
// Hover ile kart açma/kapama fonksiyonu
window.expandServiceCard = function(serviceCard) {
    const expandedContent = serviceCard.querySelector('.service-expanded-content');
    const cardContainer = serviceCard.querySelector('.service-card-container');
    const button = serviceCard.querySelector('.service-action-btn');

    if (!serviceCard.classList.contains('expanded')) {
        serviceCard.classList.add('expanded');
        cardContainer.style.transform = 'rotateY(180deg)';

        setTimeout(() => {
            expandedContent.style.display = 'block';
            expandedContent.style.opacity = '1';
            expandedContent.style.transform = 'rotateY(0deg)';
            cardContainer.style.transform = 'rotateY(0deg)';
        }, 300);

        if (button) button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    }
};

window.collapseServiceCard = function(serviceCard) {
    const expandedContent = serviceCard.querySelector('.service-expanded-content');
    const cardContainer = serviceCard.querySelector('.service-card-container');
    const button = serviceCard.querySelector('.service-action-btn');

    if (serviceCard.classList.contains('expanded')) {
        cardContainer.style.transform = 'rotateY(-180deg)';
        expandedContent.style.opacity = '0';
        expandedContent.style.transform = 'rotateY(180deg)';

        setTimeout(() => {
            serviceCard.classList.remove('expanded');
            expandedContent.style.display = 'none';
            cardContainer.style.transform = 'rotateY(0deg)';
        }, 300);

        if (button) button.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
};

// Tıklama ile toggle fonksiyonu (eski fonksiyon korundu)
window.toggleServiceDetails = function(button) {
    const serviceCard = button.closest('.service-card');
    const expandedContent = serviceCard.querySelector('.service-expanded-content');
    const cardContainer = serviceCard.querySelector('.service-card-container');
    const isExpanded = serviceCard.classList.contains('expanded');

    if (!isExpanded) {
        window.expandServiceCard(serviceCard);
    } else {
        window.collapseServiceCard(serviceCard);
    }
};

// Hover event'lerini ekle
window.initServiceCardHovers = function() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        let hoverTimeout;

        card.addEventListener('mouseenter', () => {
            // Kısa bir gecikme ile hover açma
            hoverTimeout = setTimeout(() => {
                window.expandServiceCard(card);
            }, 200);
        });

        card.addEventListener('mouseleave', () => {
            // Hover timeout'unu iptal et
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }

            // Kısa bir gecikme ile hover kapama
            setTimeout(() => {
                window.collapseServiceCard(card);
            }, 300);
        });
    });
};

// Hero Section Animation and Slider Logic
function startHeroAnimation() {
    const heroContent = document.querySelector('.hero-content');
    const sliderContainer = document.getElementById('hero-slider-container');

    // Add class to start the text animation
    heroContent.classList.add('animate-out');

    // After text animation finishes, show the slider
    setTimeout(() => {
        heroContent.style.display = 'none';
        if (sliderContainer) {
            sliderContainer.classList.add('visible');
        }
    }, 1500); // Must match the animation duration in CSS
}

function renderHeroSlider(slides) {
    const sliderWrapper = document.querySelector('#hero-slider-container .swiper-wrapper');
    if (!sliderWrapper) return;

    sliderWrapper.innerHTML = ''; // Clear existing slides

    slides.forEach(slide => {
        const slideElement = document.createElement('div');
        slideElement.className = 'swiper-slide';

        slideElement.innerHTML = `
            <img src="${slide.imageUrl}" alt="${slide.title || 'Hero Slide'}">
            <div class="slide-content">
                ${slide.title ? `<h2>${slide.title}</h2>` : ''}
                ${slide.description ? `<p>${slide.description}</p>` : ''}
            </div>
        `;
        sliderWrapper.appendChild(slideElement);
    });

    // Initialize Swiper
    new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}