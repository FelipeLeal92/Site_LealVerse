document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Salvar token no localStorage
        localStorage.setItem('token', data.token);
        
        // Redirecionar para o dashboard
        window.location.href = 'dashboard.html';
      } else {
        // Exibir mensagem de erro
        loginError.textContent = data.message;
        loginError.style.display = 'block';
        
        // Limpar mensagem após 5 segundos
        setTimeout(() => {
          loginError.style.display = 'none';
        }, 5000);
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      loginError.textContent = 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
      loginError.style.display = 'block';
      
      // Limpar mensagem após 5 segundos
      setTimeout(() => {
        loginError.style.display = 'none';
      }, 5000);
    }
  });
});