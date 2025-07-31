import { getServices, getProjects, getBlogs } from './firebase.js';

// Sayfa yüklendiğinde Firebase'den verileri çek
document.addEventListener('DOMContentLoaded', async function() {
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

        // Projeleri yükle
        const projects = await getProjects();
        if (projects.length > 0) {
            renderProjects(projects);
        }

        // Blogları yükle
        const blogs = await getBlogs();
        if (blogs.length > 0) {
            renderBlogs(blogs);
        }
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
    }
}

// Hizmetleri render et
function renderServices(services) {
    const servicesContainer = document.querySelector('.service .row');
    if (!servicesContainer) return;

    // Mevcut statik hizmetleri temizle (ilk 6 hizmet)
    const existingServices = servicesContainer.querySelectorAll('.col-lg-4:not(:last-child)');
    existingServices.forEach((service, index) => {
        if (index < 6) { // İlk 6 hizmeti güncelle
            const serviceData = services[index];
            if (serviceData) {
                updateServiceElement(service, serviceData);
            }
        }
    });

    // Eğer Firebase'den daha fazla hizmet varsa, yenilerini ekle
    if (services.length > 6) {
        for (let i = 6; i < services.length; i++) {
            const serviceElement = createServiceElement(services[i]);
            servicesContainer.insertBefore(serviceElement, servicesContainer.lastElementChild);
        }
    }
}

// Hizmet elementini güncelle
function updateServiceElement(element, serviceData) {
    const iconElement = element.querySelector('.service-content i, .service-tytle i');
    const titleElements = element.querySelectorAll('.service-content a, .service-tytle h4');
    const descElement = element.querySelector('.service-content p');

    if (iconElement) {
        iconElement.className = `${serviceData.icon} text-primary fa-4x`;
        element.querySelector('.service-tytle i').className = `${serviceData.icon} text-primary fa-2x`;
    }
    
    titleElements.forEach(title => {
        title.textContent = serviceData.title;
    });
    
    if (descElement) {
        descElement.textContent = serviceData.description;
    }
}

// Yeni hizmet elementi oluştur
function createServiceElement(serviceData) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-4 wow fadeInUp';
    colDiv.setAttribute('data-wow-delay', '0.2s');
    
    colDiv.innerHTML = `
        <div class="service-item">
            <div class="service-img">
                <img src="img/service-1.jpg" class="img-fluid w-100" alt="Image">
            </div>
            <div class="service-content text-center p-4">
                <div class="bg-secondary btn-xl-square mx-auto" style="width: 120px; height: 120px;">
                    <i class="${serviceData.icon} text-primary fa-4x"></i>
                </div>
                <a href="#" class="d-block fs-4 my-4">${serviceData.title}</a>
                <p class="text-white mb-4">${serviceData.description}</p>
                <a class="btn btn-secondary py-2 px-4" href="#">Read More</a>
            </div>
            <div class="service-tytle">
                <div class="d-flex align-items-center ps-4 w-100">
                    <h4>${serviceData.title}</h4>
                </div>
                <div class="btn-xl-square bg-secondary p-4" style="width: 80px; height: 80px;">
                    <i class="${serviceData.icon} text-primary fa-2x"></i>
                </div>
            </div>
        </div>
    `;
    
    return colDiv;
}

// Projeleri render et
function renderProjects(projects) {
    const projectsContainer = document.querySelector('.project .row');
    if (!projectsContainer) return;

    // Mevcut statik projeleri temizle
    const existingProjects = projectsContainer.querySelectorAll('.col-lg-6:not(:last-child)');
    existingProjects.forEach((project, index) => {
        if (index < 4 && projects[index]) { // İlk 4 projeyi güncelle
            updateProjectElement(project, projects[index]);
        }
    });

    // Eğer daha fazla proje varsa, yenilerini ekle
    if (projects.length > 4) {
        for (let i = 4; i < projects.length; i++) {
            const projectElement = createProjectElement(projects[i]);
            projectsContainer.insertBefore(projectElement, projectsContainer.lastElementChild);
        }
    }
}

// Proje elementini güncelle
function updateProjectElement(element, projectData) {
    const imgElement = element.querySelector('.project-img img');
    const categoryElement = element.querySelector('.project-content p');
    const titleElement = element.querySelector('.project-content a.h4');
    const descElement = element.querySelector('.project-content p:last-of-type');

    if (imgElement) imgElement.src = projectData.image;
    if (categoryElement) categoryElement.textContent = projectData.category;
    if (titleElement) titleElement.textContent = projectData.title;
    if (descElement) descElement.textContent = projectData.description;
}

// Yeni proje elementi oluştur
function createProjectElement(projectData) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-6 wow fadeInUp';
    colDiv.setAttribute('data-wow-delay', '0.2s');
    
    colDiv.innerHTML = `
        <div class="project-item">
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="project-img">
                        <img src="${projectData.image}" class="img-fluid w-100 pt-3 ps-3" alt="">
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="project-content mb-4">
                        <p class="fs-5 text-secondary mb-2">${projectData.category}</p>
                        <a href="#" class="h4">${projectData.title}</a>
                        <p class="mb-0 mt-3">${projectData.description}</p>
                    </div>
                    <a class="btn btn-primary py-2 px-4" href="#">Read More</a>
                </div>
            </div>
        </div>
    `;
    
    return colDiv;
}

// Blogları render et
function renderBlogs(blogs) {
    const blogsContainer = document.querySelector('.blog .row');
    if (!blogsContainer) return;

    // Mevcut statik blogları temizle
    const existingBlogs = blogsContainer.querySelectorAll('.col-lg-4');
    existingBlogs.forEach((blog, index) => {
        if (index < 3 && blogs[index]) { // İlk 3 blogu güncelle
            updateBlogElement(blog, blogs[index]);
        }
    });

    // Eğer daha fazla blog varsa, yenilerini ekle
    if (blogs.length > 3) {
        for (let i = 3; i < blogs.length; i++) {
            const blogElement = createBlogElement(blogs[i]);
            blogsContainer.appendChild(blogElement);
        }
    }
}

// Blog elementini güncelle
function updateBlogElement(element, blogData) {
    const imgElement = element.querySelector('.blog-img img');
    const dateElement = element.querySelector('.fa-calendar-check').parentElement;
    const authorElement = element.querySelector('.fa-user').parentElement;
    const titleElement = element.querySelector('.blog-content a.h4');

    if (imgElement) imgElement.src = blogData.image;
    if (dateElement) dateElement.innerHTML = `<i class="fa fa-calendar-check text-secondary me-1"></i> ${blogData.date}`;
    if (authorElement) authorElement.innerHTML = `<i class="fa fa-user text-secondary me-1"></i> ${blogData.author}`;
    if (titleElement) titleElement.textContent = blogData.title;
}

// Yeni blog elementi oluştur
function createBlogElement(blogData) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-4 wow fadeInUp';
    colDiv.setAttribute('data-wow-delay', '0.2s');
    
    colDiv.innerHTML = `
        <div class="blog-item h-100">
            <div class="blog-img">
                <img src="${blogData.image}" class="img-fluid w-100" alt="">
            </div>
            <div class="blog-content p-4">
                <div class="d-flex justify-content-between mb-3">
                    <p class="mb-0"><i class="fa fa-calendar-check text-secondary me-1"></i> ${blogData.date}</p>
                    <p class="mb-0"><i class="fa fa-user text-secondary me-1"></i> ${blogData.author}</p>
                </div>
                <a href="#" class="h4 d-block mb-4">${blogData.title}</a>
                <a class="btn btn-secondary py-2 px-4" href="#">Read More</a>
            </div>
        </div>
    `;
    
    return colDiv;
}

// Animasyonları başlat
function initializeAnimations() {
    // Spinner'ı gizle
    const spinner = document.getElementById('spinner');
    if (spinner) {
        setTimeout(() => {
            spinner.classList.remove('show');
        }, 1000);
    }

    // WOW.js animasyonlarını başlat
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }

    // Counter animasyonları
    const counters = document.querySelectorAll('[data-toggle="counter-up"]');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Intersection Observer ile sayaç animasyonunu başlat
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}