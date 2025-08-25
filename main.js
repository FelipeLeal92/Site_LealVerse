document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  mobileMenuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
  });
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-menu ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
  
  // Theme Toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const themeIcon = themeToggle.querySelector('i');
  
  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  
  themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });
  
  // Carousel
  const carousel = document.querySelector('.carousel');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  let slideIndex = 0;
  let slides = [];
  
  // Fetch carousel data from API
  fetch('/api/carousel')
    .then(response => response.json())
    .then(data => {
      // Create carousel slides
      data.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.style.backgroundImage = `url(${item.imageUrl})`;
        
        const content = document.createElement('div');
        content.className = 'carousel-content';
        
        const title = document.createElement('h2');
        title.textContent = item.title;
        
        const description = document.createElement('p');
        description.textContent = item.description;
        
        const link = document.createElement('a');
        link.href = item.linkUrl || '#';
        link.className = 'btn btn-primary';
        link.textContent = 'Saiba Mais';
        link.target = '_blank';
        
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(link);
        slide.appendChild(content);
        carousel.appendChild(slide);
        
        slides.push(slide);
      });
      
      // Show first slide
      if (slides.length > 0) {
        showSlide(0);
      }
    })
    .catch(error => console.error('Error fetching carousel data:', error));
  
  function showSlide(index) {
    if (index < 0) {
      slideIndex = slides.length - 1;
    } else if (index >= slides.length) {
      slideIndex = 0;
    } else {
      slideIndex = index;
    }
    
    carousel.style.transform = `translateX(-${slideIndex * 100}%)`;
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(slideIndex - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(slideIndex + 1);
    });
  }
  
  // Auto-advance carousel
  setInterval(() => {
    if (slides.length > 0) {
      showSlide(slideIndex + 1);
    }
  }, 5000);
  
  // Fetch featured products
  const productsGrid = document.querySelector('.products-grid');
  if (productsGrid) {
    fetch('/api/products/featured/true')
      .then(response => response.json())
      .then(data => {
        data.forEach(product => {
          const productCard = document.createElement('div');
          productCard.className = 'product-card';
          
          const productImage = document.createElement('div');
          productImage.className = 'product-image';
          
          const img = document.createElement('img');
          img.src = product.imageUrl;
          img.alt = product.name;
          productImage.appendChild(img);
          
          const productInfo = document.createElement('div');
          productInfo.className = 'product-info';
          
          const productName = document.createElement('h3');
          productName.textContent = product.name;
          
          const productDescription = document.createElement('p');
          productDescription.textContent = product.description.substring(0, 100) + '...';
          
          const productActions = document.createElement('div');
          productActions.className = 'product-actions';
          
          const viewBtn = document.createElement('a');
          viewBtn.href = product.linkUrl || '#';
          viewBtn.className = 'btn btn-primary';
          viewBtn.textContent = 'Ver Detalhes';
          viewBtn.target = '_blank';
          
          productActions.appendChild(viewBtn);
          
          productInfo.appendChild(productName);
          productInfo.appendChild(productDescription);
          productInfo.appendChild(productActions);
          
          productCard.appendChild(productImage);
          productCard.appendChild(productInfo);
          
          productsGrid.appendChild(productCard);
        });
      })
      .catch(error => console.error('Error fetching featured products:', error));
  }
  
  // Fetch blog posts
  const blogGrid = document.querySelector('.blog-grid');
  if (blogGrid) {
    fetch('/api/blog')
      .then(response => response.json())
      .then(data => {
        // Show only the first 3 blog posts
        const recentPosts = data.slice(0, 3);
        
        recentPosts.forEach(post => {
          const blogCard = document.createElement('div');
          blogCard.className = 'blog-card';
          
          const blogImage = document.createElement('div');
          blogImage.className = 'blog-image';
          
          const img = document.createElement('img');
          img.src = post.imageUrl;
          img.alt = post.title;
          blogImage.appendChild(img);
          
          const blogInfo = document.createElement('div');
          blogInfo.className = 'blog-info';
          
          const blogTitle = document.createElement('h3');
          blogTitle.textContent = post.title;
          
          const blogExcerpt = document.createElement('p');
          blogExcerpt.textContent = post.excerpt;
          
          const blogMeta = document.createElement('div');
          blogMeta.className = 'blog-meta';
          
          const author = document.createElement('span');
          author.textContent = `Por ${post.author}`;
          
          const date = document.createElement('span');
          const postDate = new Date(post.createdAt);
          date.textContent = postDate.toLocaleDateString('pt-BR');
          
          blogMeta.appendChild(author);
          blogMeta.appendChild(date);
          
          const blogActions = document.createElement('div');
          blogActions.className = 'blog-actions';
          
          const readBtn = document.createElement('button');
          readBtn.className = 'btn btn-primary';
          readBtn.textContent = 'Ler Mais';
          readBtn.dataset.postId = post._id;
          
          blogActions.appendChild(readBtn);
          
          blogInfo.appendChild(blogTitle);
          blogInfo.appendChild(blogExcerpt);
          blogInfo.appendChild(blogMeta);
          blogInfo.appendChild(blogActions);
          
          blogCard.appendChild(blogImage);
          blogCard.appendChild(blogInfo);
          
          blogGrid.appendChild(blogCard);
          
          // Add event listener to read more button
          readBtn.addEventListener('click', function() {
            window.location.href = `blog.html#${post._id}`;
          });
        });
      })
      .catch(error => console.error('Error fetching blog posts:', error));
  }
  
  // Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Here you would normally send the form data to a server
      // For this example, we'll just show a success message
      
      // Create success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
      successMessage.style.padding = '15px';
      successMessage.style.backgroundColor = '#d4edda';
      successMessage.style.color = '#155724';
      successMessage.style.borderRadius = 'var(--border-radius)';
      successMessage.style.marginTop = '20px';
      
      // Reset form
      contactForm.reset();
      
      // Add success message after form
      contactForm.appendChild(successMessage);
      
      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    });
  }
  
  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = newsletterForm.querySelector('input[type="email"]').value;
      
      // Here you would normally send the email to a server
      // For this example, we'll just show a success message
      
      // Create success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Inscrição realizada com sucesso!';
      successMessage.style.padding = '10px';
      successMessage.style.backgroundColor = '#d4edda';
      successMessage.style.color = '#155724';
      successMessage.style.borderRadius = 'var(--border-radius)';
      successMessage.style.marginTop = '10px';
      successMessage.style.textAlign = 'center';
      
      // Reset form
      newsletterForm.reset();
      
      // Add success message after form
      newsletterForm.appendChild(successMessage);
      
      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Account for fixed header
          behavior: 'smooth'
        });
      }
    });
  });
});