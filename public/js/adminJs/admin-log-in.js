document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const { first_name, last_name, password1, password2 } = Object.fromEntries(new FormData(form));

        try {
            const response = await fetch('/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ first_name, last_name, password1, password2 })
            });
    
            const data = await response.json();
            if (response.ok) {
                window.location.href = data.redirectTo;
            } else {
                errorMessage.textContent = data.error || 'Помилка входу';
            }
        } catch {
            errorMessage.textContent = 'Помилка з’єднання з сервером';
        }
    });    
});

