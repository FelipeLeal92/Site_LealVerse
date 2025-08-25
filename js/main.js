// main.js - Funcionalidades principais do site LealVerse

document.addEventListener('DOMContentLoaded', function() {
    console.log('Site LealVerse carregado');
    
    // Carregar dados dinâmicos
    loadCarousel();
    loadProducts();
    loadBlogPosts();
    
    // Configurar formulário de contato
    setupContactForm();
    
    // Configurar newsletter
    setupNewsletter();
    
    // Configurar alternador de tema
    setupThemeToggle();
    
    // Configurar navegação suave
    setupSmoothScrolling();
});

// Função para carregar carrossel
async function loadCarousel() {
    try {
        const response = await fetch('/api/carousel');
        const carouselItems = await response.json();
        
        const carouselContainer = document.querySelector('.carousel-content');
        if (carouselContainer && carouselItems.length > 0) {
            carouselContainer.innerHTML = carouselItems.map(item => `
                <div class="carousel-item">
                    <img src="${item.imageUrl}" alt="${item.title}">
                    <div class="carousel-caption">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        ${item.linkUrl ? `<a href="${item.linkUrl}" class="btn btn-primary">Saiba Mais</a>` : ''}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar carrossel:', error);
    }
}

// Função para carregar produtos
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        const productsContainer = document.querySelector('.products-grid');
        if (productsContainer && products.length > 0) {
            productsContainer.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <a href="${product.linkUrl}" class="btn btn-primary">Ver Produto</a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Função para carregar posts do blog
async function loadBlogPosts() {
    try {
        const response = await fetch('/api/blog');
        const blogPosts = await response.json();
        
        const blogContainer = document.querySelector('.blog-grid');
        if (blogContainer && blogPosts.length > 0) {
            // Mostrar apenas os 3 posts mais recentes
            const recentPosts = blogPosts.slice(0, 3);
            blogContainer.innerHTML = recentPosts.map(post => `
                <div class="blog-card">
                    <img src="${post.imageUrl}" alt="${post.title}">
                    <div class="blog-info">
                        <h3>${post.title}</h3>
                        <p>${post.excerpt}</p>
                        <span class="author">Por ${post.author}</span>
                        <a href="blog.html?id=${post.id}" class="btn btn-outline">Ler Mais</a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar blog:', error);
    }
}

// Configurar formulário de contato
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name') || document.getElementById('name').value,
                email: formData.get('email') || document.getElementById('email').value,
                subject: formData.get('subject') || document.getElementById('subject').value,
                message: formData.get('message') || document.getElementById('message').value
            };
            
            try {
                // Aqui você pode implementar o envio do formulário
                console.log('Formulário de contato enviado:', data);
                alert('Mensagem enviada com sucesso!');
                this.reset();
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                alert('Erro ao enviar mensagem. Tente novamente.');
            }
        });
    }
}

// Configurar newsletter
function setupNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            try {
                // Aqui você pode implementar a inscrição na newsletter
                console.log('Newsletter inscrição:', email);
                alert('Inscrição realizada com sucesso!');
                this.reset();
            } catch (error) {
                console.error('Erro ao inscrever na newsletter:', error);
                alert('Erro ao realizar inscrição. Tente novamente.');
            }
        });
    }
}

// Configurar alternador de tema
function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Aplicar tema
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Atualizar ícone
      const icon = this.querySelector('i');
      if (newTheme === 'dark') {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
      
      // Salvar preferência
      localStorage.setItem('theme', newTheme);
      
      console.log(`Tema alterado para: ${newTheme}`);
    });
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = themeToggle.querySelector('i');
    if (savedTheme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }
}

// Configurar navegação suave
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para mostrar/ocultar menu mobile
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Função para fechar menu mobile ao clicar em um link
function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

// Adicionar listener para fechar menu ao clicar em links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        closeMobileMenu();
    }
});

console.log('main.js carregado com sucesso');
