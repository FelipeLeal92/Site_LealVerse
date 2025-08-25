document.addEventListener('DOMContentLoaded', function() {
  // Verificar se o usuário está autenticado
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  // Elementos do DOM
  const sidebarLinks = document.querySelectorAll('.sidebar-menu ul li a[data-page]');
  const adminPages = document.querySelectorAll('.admin-page');
  const pageTitle = document.getElementById('pageTitle');
  const logoutBtn = document.getElementById('logoutBtn');
  const itemModal = document.getElementById('itemModal');
  const modalTitle = document.getElementById('modalTitle');
  const itemForm = document.getElementById('itemForm');
  const closeModalBtns = document.querySelectorAll('.close');
  const confirmModal = document.getElementById('confirmModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  
  // Botões de adição
  const addCarouselBtn = document.getElementById('addCarouselBtn');
  const addProductBtn = document.getElementById('addProductBtn');
  const addBlogBtn = document.getElementById('addBlogBtn');
  
  // Tabelas
  const carouselTableBody = document.getElementById('carouselTableBody');
  const productsTableBody = document.getElementById('productsTableBody');
  const blogTableBody = document.getElementById('blogTableBody');
  
  // Contadores do dashboard
  const carouselCount = document.getElementById('carouselCount');
  const productsCount = document.getElementById('productsCount');
  const blogCount = document.getElementById('blogCount');
  
  // Variáveis globais
  let currentItemType = '';
  let currentItemId = '';
  let deleteItemId = '';
  let deleteItemType = '';
  
  // Função para mostrar uma página
  function showPage(pageId) {
    // Esconder todas as páginas
    adminPages.forEach(page => {
      page.classList.remove('active');
    });
    
    // Remover classe active de todos os links
    sidebarLinks.forEach(link => {
      link.parentElement.classList.remove('active');
    });
    
    // Mostrar a página selecionada
    const selectedPage = document.getElementById(`${pageId}Page`);
    if (selectedPage) {
      selectedPage.classList.add('active');
    }
    
    // Adicionar classe active ao link selecionado
    const selectedLink = document.querySelector(`.sidebar-menu ul li a[data-page="${pageId}"]`);
    if (selectedLink) {
      selectedLink.parentElement.classList.add('active');
    }
    
    // Atualizar título da página
    pageTitle.textContent = pageId.charAt(0).toUpperCase() + pageId.slice(1);
    
    // Carregar dados da página
    loadPageData(pageId);
  }
  
  // Função para carregar dados da página
  async function loadPageData(pageId) {
    try {
      switch (pageId) {
        case 'dashboard':
          await loadDashboardData();
          break;
        case 'carousel':
          await loadCarouselData();
          break;
        case 'products':
          await loadProductsData();
          break;
        case 'blog':
          await loadBlogData();
          break;
      }
    } catch (err) {
      console.error(`Erro ao carregar dados da página ${pageId}:`, err);
    }
  }
  
  // Função para carregar dados do dashboard
  async function loadDashboardData() {
    try {
      // Carregar contadores
      const [carouselResponse, productsResponse, blogResponse] = await Promise.all([
        fetch('/api/carousel', {
          headers: {
            'x-auth-token': token
          }
        }),
        fetch('/api/products', {
          headers: {
            'x-auth-token': token
          }
        }),
        fetch('/api/blog', {
          headers: {
            'x-auth-token': token
          }
        })
      ]);
      
      const carouselData = await carouselResponse.json();
      const productsData = await productsResponse.json();
      const blogData = await blogResponse.json();
      
      carouselCount.textContent = carouselData.length;
      productsCount.textContent = productsData.length;
      blogCount.textContent = blogData.length;
      
      // Carregar atualizações recentes
      await loadRecentUpdates();
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    }
  }
  
  // Função para carregar atualizações recentes
  async function loadRecentUpdates() {
    try {
      const recentUpdates = document.getElementById('recentUpdates');
      if (!recentUpdates) return;
      
      // Buscar dados de todas as entidades
      const [carouselResponse, productsResponse, blogResponse] = await Promise.all([
        fetch('/api/carousel', {
          headers: {
            'x-auth-token': token
          }
        }),
        fetch('/api/products', {
          headers: {
            'x-auth-token': token
          }
        }),
        fetch('/api/blog', {
          headers: {
            'x-auth-token': token
          }
        })
      ]);
      
      const carouselData = await carouselResponse.json();
      const productsData = await productsResponse.json();
      const blogData = await blogResponse.json();
      
      // Combinar e ordenar por data de criação
      const allUpdates = [];
      
      carouselData.forEach(item => {
        allUpdates.push({
          type: 'carousel',
          title: item.title,
          date: new Date(item.created_at),
          action: 'criado'
        });
      });
      
      productsData.forEach(item => {
        allUpdates.push({
          type: 'produto',
          title: item.name,
          date: new Date(item.created_at),
          action: 'criado'
        });
      });
      
      blogData.forEach(item => {
        allUpdates.push({
          type: 'post',
          title: item.title,
          date: new Date(item.created_at),
          action: 'criado'
        });
      });
      
      // Ordenar por data (mais recente primeiro)
      allUpdates.sort((a, b) => b.date - a.date);
      
      // Mostrar apenas as 5 atualizações mais recentes
      const recentUpdatesList = allUpdates.slice(0, 5);
      
      recentUpdates.innerHTML = recentUpdatesList.map(update => `
        <div class="update-item">
          <div class="update-icon">
            <i class="fas fa-${getUpdateIcon(update.type)}"></i>
          </div>
          <div class="update-content">
            <div class="update-title">${update.title}</div>
            <div class="update-meta">
              <span class="update-type">${update.type}</span>
              <span class="update-date">${formatDate(update.date)}</span>
            </div>
          </div>
        </div>
      `).join('');
      
    } catch (err) {
      console.error('Erro ao carregar atualizações recentes:', err);
    }
  }
  
  // Função para obter ícone baseado no tipo de atualização
  function getUpdateIcon(type) {
    switch (type) {
      case 'carousel': return 'images';
      case 'produto': return 'box';
      case 'post': return 'newspaper';
      default: return 'info-circle';
    }
  }
  
  // Função para formatar data
  function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
  }
  
  // Função para carregar dados do carrossel
  async function loadCarouselData() {
    try {
      const response = await fetch('/api/carousel', {
        headers: {
          'x-auth-token': token
        }
      });
      
      const data = await response.json();
      
      // Limpar tabela
      carouselTableBody.innerHTML = '';
      
      // Adicionar itens à tabela
      data.forEach(item => {
        const row = document.createElement('tr');
        
        const imageCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.title;
        image.style.width = '80px';
        image.style.height = '50px';
        image.style.objectFit = 'cover';
        imageCell.appendChild(image);
        
        const titleCell = document.createElement('td');
        titleCell.textContent = item.title;
        
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = item.description.length > 50 
          ? item.description.substring(0, 50) + '...' 
          : item.description;
        
        const linkCell = document.createElement('td');
        const link = document.createElement('a');
        link.href = item.linkUrl;
        link.textContent = item.linkUrl || '-';
        link.target = '_blank';
        linkCell.appendChild(link);
        
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `badge ${item.active ? 'badge-success' : 'badge-danger'}`;
        statusBadge.textContent = item.active ? 'Ativo' : 'Inativo';
        statusCell.appendChild(statusBadge);
        
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-primary';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => openEditModal('carousel', item._id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => openConfirmModal('carousel', item._id));
        
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        
        row.appendChild(imageCell);
        row.appendChild(titleCell);
        row.appendChild(descriptionCell);
        row.appendChild(linkCell);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);
        
        carouselTableBody.appendChild(row);
      });
    } catch (err) {
      console.error('Erro ao carregar dados do carrossel:', err);
    }
  }
  
  // Função para carregar dados de produtos
  async function loadProductsData() {
    try {
      const response = await fetch('/api/products', {
        headers: {
          'x-auth-token': token
        }
      });
      
      const data = await response.json();
      
      // Limpar tabela
      productsTableBody.innerHTML = '';
      
      // Adicionar produtos à tabela
      data.forEach(product => {
        const row = document.createElement('tr');
        
        const imageCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = product.imageUrl;
        image.alt = product.name;
        image.style.width = '80px';
        image.style.height = '50px';
        image.style.objectFit = 'cover';
        imageCell.appendChild(image);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;
        
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = product.description.length > 50 
          ? product.description.substring(0, 50) + '...' 
          : product.description;
        
        const featuredCell = document.createElement('td');
        const featuredBadge = document.createElement('span');
        featuredBadge.className = `badge ${product.featured ? 'badge-success' : 'badge-secondary'}`;
        featuredBadge.textContent = product.featured ? 'Sim' : 'Não';
        featuredCell.appendChild(featuredBadge);
        
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-primary';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => openEditModal('product', product._id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => openConfirmModal('product', product._id));
        
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        
        row.appendChild(imageCell);
        row.appendChild(nameCell);
        row.appendChild(descriptionCell);
        row.appendChild(featuredCell);
        row.appendChild(actionsCell);
        
        productsTableBody.appendChild(row);
      });
    } catch (err) {
      console.error('Erro ao carregar dados de produtos:', err);
    }
  }
  
  // Função para carregar dados do blog
  async function loadBlogData() {
    try {
      const response = await fetch('/api/blog', {
        headers: {
          'x-auth-token': token
        }
      });
      
      const data = await response.json();
      
      // Limpar tabela
      blogTableBody.innerHTML = '';
      
      // Adicionar posts à tabela
      data.forEach(post => {
        const row = document.createElement('tr');
        
        const imageCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = post.imageUrl;
        image.alt = post.title;
        image.style.width = '80px';
        image.style.height = '50px';
        image.style.objectFit = 'cover';
        imageCell.appendChild(image);
        
        const titleCell = document.createElement('td');
        titleCell.textContent = post.title;
        
        const excerptCell = document.createElement('td');
        excerptCell.textContent = post.excerpt.length > 50 
          ? post.excerpt.substring(0, 50) + '...' 
          : post.excerpt;
        
        const authorCell = document.createElement('td');
        authorCell.textContent = post.author;
        
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `badge ${post.active ? 'badge-success' : 'badge-danger'}`;
        statusBadge.textContent = post.active ? 'Ativo' : 'Inativo';
        statusCell.appendChild(statusBadge);
        
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-primary';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => openEditModal('blog', post._id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => openConfirmModal('blog', post._id));
        
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        
        row.appendChild(imageCell);
        row.appendChild(titleCell);
        row.appendChild(excerptCell);
        row.appendChild(authorCell);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);
        
        blogTableBody.appendChild(row);
      });
    } catch (err) {
      console.error('Erro ao carregar dados do blog:', err);
    }
  }
  
  // Função para abrir modal de edição
  async function openEditModal(itemType, itemId) {
    currentItemType = itemType;
    currentItemId = itemId;
    
    // Definir título do modal
    modalTitle.textContent = `Editar ${getItemTypeLabel(itemType)}`;
    
    // Limpar formulário
    itemForm.innerHTML = '';
    
    // Adicionar campos ocultos
    const idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.id = 'itemId';
    idInput.value = itemId;
    itemForm.appendChild(idInput);
    
    const typeInput = document.createElement('input');
    typeInput.type = 'hidden';
    typeInput.id = 'itemType';
    typeInput.value = itemType;
    itemForm.appendChild(typeInput);
    
    try {
      // Buscar dados do item
      let response;
      switch (itemType) {
        case 'carousel':
          response = await fetch(`/api/carousel/${itemId}`, {
            headers: {
              'x-auth-token': token
            }
          });
          break;
        case 'product':
          response = await fetch(`/api/products/${itemId}`, {
            headers: {
              'x-auth-token': token
            }
          });
          break;
        case 'blog':
          response = await fetch(`/api/blog/${itemId}`, {
            headers: {
              'x-auth-token': token
            }
          });
          break;
      }
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do item');
      }
      
      const item = await response.json();
      
      // Adicionar campos específicos do tipo de item
      switch (itemType) {
        case 'carousel':
          addCarouselFields(item);
          break;
        case 'product':
          addProductFields(item);
          break;
        case 'blog':
          addBlogFields(item);
          break;
      }
      
      // Mostrar modal
      itemModal.style.display = 'block';
    } catch (err) {
      console.error('Erro ao abrir modal de edição:', err);
    }
  }
  
  // Função para adicionar campos do carrossel
  function addCarouselFields(item) {
    // Campo Título
    const titleGroup = createFormGroup('title', 'Título', 'text', item.title);
    itemForm.appendChild(titleGroup);
    
    // Campo Descrição
    const descriptionGroup = createFormGroup('description', 'Descrição', 'textarea', item.description);
    itemForm.appendChild(descriptionGroup);
    
    // Campo Link
    const linkGroup = createFormGroup('linkUrl', 'Link', 'text', item.linkUrl);
    itemForm.appendChild(linkGroup);
    
    // Campo Status
    const statusGroup = createFormGroup('active', 'Status', 'checkbox', item.active);
    itemForm.appendChild(statusGroup);
    
    // Campo Imagem
    const imageGroup = createImageFormGroup('image', 'Imagem', item.imageUrl);
    itemForm.appendChild(imageGroup);
    
    // Botão de envio
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Salvar Alterações';
    itemForm.appendChild(submitBtn);
  }
  
  // Função para adicionar campos de produto
  function addProductFields(item) {
    // Campo Nome
    const nameGroup = createFormGroup('name', 'Nome', 'text', item.name);
    itemForm.appendChild(nameGroup);
    
    // Campo Descrição
    const descriptionGroup = createFormGroup('description', 'Descrição', 'textarea', item.description);
    itemForm.appendChild(descriptionGroup);
    
    // Campo Link
    const linkGroup = createFormGroup('linkUrl', 'Link', 'text', item.linkUrl);
    itemForm.appendChild(linkGroup);
    
    // Campo Destaque
    const featuredGroup = createFormGroup('featured', 'Destaque', 'checkbox', item.featured);
    itemForm.appendChild(featuredGroup);
    
    // Campo Imagem
    const imageGroup = createImageFormGroup('image', 'Imagem', item.imageUrl);
    itemForm.appendChild(imageGroup);
    
    // Botão de envio
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Salvar Alterações';
    itemForm.appendChild(submitBtn);
  }
  
  // Função para adicionar campos do blog
  function addBlogFields(item) {
    // Campo Título
    const titleGroup = createFormGroup('title', 'Título', 'text', item.title);
    itemForm.appendChild(titleGroup);
    
    // Campo Resumo
    const excerptGroup = createFormGroup('excerpt', 'Resumo', 'textarea', item.excerpt);
    itemForm.appendChild(excerptGroup);
    
    // Campo Conteúdo
    const contentGroup = createFormGroup('content', 'Conteúdo', 'textarea', item.content, true);
    itemForm.appendChild(contentGroup);
    
    // Campo Autor
    const authorGroup = createFormGroup('author', 'Autor', 'text', item.author);
    itemForm.appendChild(authorGroup);
    
    // Campo Status
    const statusGroup = createFormGroup('active', 'Status', 'checkbox', item.active);
    itemForm.appendChild(statusGroup);
    
    // Campo Imagem
    const imageGroup = createImageFormGroup('image', 'Imagem', item.imageUrl);
    itemForm.appendChild(imageGroup);
    
    // Botão de envio
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Salvar Alterações';
    itemForm.appendChild(submitBtn);
  }
  
  // Função para criar um grupo de formulário
  function createFormGroup(id, label, type, value, isTextarea = false) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    group.appendChild(labelElement);
    
    if (type === 'checkbox') {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = id;
      input.name = id;
      input.checked = value;
      group.appendChild(input);
    } else if (isTextarea) {
      const textarea = document.createElement('textarea');
      textarea.id = id;
      textarea.name = id;
      textarea.value = value;
      textarea.rows = 5;
      group.appendChild(textarea);
    } else {
      const input = document.createElement('input');
      input.type = type;
      input.id = id;
      input.name = id;
      input.value = value;
      group.appendChild(input);
    }
    
    return group;
  }
  
  // Função para criar um grupo de formulário de imagem
  function createImageFormGroup(id, label, currentImage) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    group.appendChild(labelElement);
    
    // Imagem atual
    if (currentImage) {
      const currentImageContainer = document.createElement('div');
      currentImageContainer.className = 'current-image';
      
      const img = document.createElement('img');
      img.src = currentImage;
      img.alt = 'Imagem atual';
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      currentImageContainer.appendChild(img);
      
      group.appendChild(currentImageContainer);
    }
    
    // Input de arquivo
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = id;
    fileInput.name = id;
    fileInput.accept = 'image/*';
    group.appendChild(fileInput);
    
    return group;
  }
  
  // Função para obter o rótulo do tipo de item
  function getItemTypeLabel(itemType) {
    switch (itemType) {
      case 'carousel':
        return 'Item do Carrossel';
      case 'product':
        return 'Produto';
      case 'blog':
        return 'Post do Blog';
      default:
        return 'Item';
    }
  }
  
  // Função para abrir modal de confirmação de exclusão
  function openConfirmModal(itemType, itemId) {
    deleteItemType = itemType;
    deleteItemId = itemId;
    
    // Mostrar modal
    confirmModal.style.display = 'block';
  }
  
  // Event Listeners
  
  // Navegação do sidebar
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      showPage(pageId);
    });
  });
  
  // Logout
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
  
  // Botões de adição
  addCarouselBtn.addEventListener('click', function() {
    currentItemType = 'carousel';
    currentItemId = '';
    modalTitle.textContent = 'Adicionar Item ao Carrossel';
    itemForm.innerHTML = '';
    
    // Adicionar campos ocultos
    const typeInput = document.createElement('input');
    typeInput.type = 'hidden';
    typeInput.id = 'itemType';
    typeInput.value = 'carousel';
    itemForm.appendChild(typeInput);
    
    // Adicionar campos
    addCarouselFields({
      title: '',
      description: '',
      linkUrl: '',
      active: true,
      imageUrl: ''
    });
    
    // Mostrar modal
    itemModal.style.display = 'block';
  });
  
  addProductBtn.addEventListener('click', function() {
    currentItemType = 'product';
    currentItemId = '';
    modalTitle.textContent = 'Adicionar Produto';
    itemForm.innerHTML = '';
    
    // Adicionar campos ocultos
    const typeInput = document.createElement('input');
    typeInput.type = 'hidden';
    typeInput.id = 'itemType';
    typeInput.value = 'product';
    itemForm.appendChild(typeInput);
    
    // Adicionar campos
    addProductFields({
      name: '',
      description: '',
      linkUrl: '',
      featured: false,
      imageUrl: ''
    });
    
    // Mostrar modal
    itemModal.style.display = 'block';
  });
  
  addBlogBtn.addEventListener('click', function() {
    currentItemType = 'blog';
    currentItemId = '';
    modalTitle.textContent = 'Adicionar Post ao Blog';
    itemForm.innerHTML = '';
    
    // Adicionar campos ocultos
    const typeInput = document.createElement('input');
    typeInput.type = 'hidden';
    typeInput.id = 'itemType';
    typeInput.value = 'blog';
    itemForm.appendChild(typeInput);
    
    // Adicionar campos
    addBlogFields({
      title: '',
      excerpt: '',
      content: '',
      author: 'Leal Verse',
      active: true,
      imageUrl: ''
    });
    
    // Mostrar modal
    itemModal.style.display = 'block';
  });
  
  // Fechar modais
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      itemModal.style.display = 'none';
      confirmModal.style.display = 'none';
    });
  });
  
  // Fechar modais ao clicar fora
  window.addEventListener('click', function(event) {
    if (event.target === itemModal) {
      itemModal.style.display = 'none';
    }
    if (event.target === confirmModal) {
      confirmModal.style.display = 'none';
    }
  });
  
  // Cancelar exclusão
  cancelDeleteBtn.addEventListener('click', function() {
    confirmModal.style.display = 'none';
  });
  
  // Confirmar exclusão
  confirmDeleteBtn.addEventListener('click', async function() {
    try {
      let response;
      switch (deleteItemType) {
        case 'carousel':
          response = await fetch(`/api/carousel/${deleteItemId}`, {
            method: 'DELETE',
            headers: {
              'x-auth-token': token
            }
          });
          break;
        case 'product':
          response = await fetch(`/api/products/${deleteItemId}`, {
            method: 'DELETE',
            headers: {
              'x-auth-token': token
            }
          });
          break;
        case 'blog':
          response = await fetch(`/api/blog/${deleteItemId}`, {
            method: 'DELETE',
            headers: {
              'x-auth-token': token
            }
          });
          break;
      }
      
      if (response.ok) {
        // Fechar modal
        confirmModal.style.display = 'none';
        
        // Recarregar dados da página
        const currentPage = document.querySelector('.sidebar-menu ul li.active a').getAttribute('data-page');
        loadPageData(currentPage);
      } else {
        throw new Error('Erro ao excluir item');
      }
    } catch (err) {
      console.error('Erro ao excluir item:', err);
    }
  });
  
  // Enviar formulário de item
  itemForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    const itemType = document.getElementById('itemType').value;
    const itemId = document.getElementById('itemId') ? document.getElementById('itemId').value : '';
    
    // Adicionar campos ao formData
    switch (itemType) {
      case 'carousel':
        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('linkUrl', document.getElementById('linkUrl').value);
        formData.append('active', document.getElementById('active').checked);
        if (document.getElementById('image').files[0]) {
          formData.append('image', document.getElementById('image').files[0]);
        }
        break;
      case 'product':
        formData.append('name', document.getElementById('name').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('linkUrl', document.getElementById('linkUrl').value);
        formData.append('featured', document.getElementById('featured').checked);
        if (document.getElementById('image').files[0]) {
          formData.append('image', document.getElementById('image').files[0]);
        }
        break;
      case 'blog':
        formData.append('title', document.getElementById('title').value);
        formData.append('excerpt', document.getElementById('excerpt').value);
        formData.append('content', document.getElementById('content').value);
        formData.append('author', document.getElementById('author').value);
        formData.append('active', document.getElementById('active').checked);
        if (document.getElementById('image').files[0]) {
          formData.append('image', document.getElementById('image').files[0]);
        }
        break;
    }
    
    try {
      let response;
      let url;
      
      switch (itemType) {
        case 'carousel':
          url = itemId ? `/api/carousel/${itemId}` : '/api/carousel';
          break;
        case 'product':
          url = itemId ? `/api/products/${itemId}` : '/api/products';
          break;
        case 'blog':
          url = itemId ? `/api/blog/${itemId}` : '/api/blog';
          break;
      }
      
      const method = itemId ? 'PUT' : 'POST';
      
      response = await fetch(url, {
        method: method,
        headers: {
          'x-auth-token': token
        },
        body: formData
      });
      
      if (response.ok) {
        // Fechar modal
        itemModal.style.display = 'none';
        
        // Recarregar dados da página
        const currentPage = document.querySelector('.sidebar-menu ul li.active a').getAttribute('data-page');
        loadPageData(currentPage);
      } else {
        throw new Error('Erro ao salvar item');
      }
    } catch (err) {
      console.error('Erro ao salvar item:', err);
    }
  });
  
  // Carregar página inicial (dashboard)
  showPage('dashboard');
});