document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const { name, surname, phone_number, password } = Object.fromEntries(new FormData(form));

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, surname, phone_number, password })
            });

            const data = await response.json();
            if (response.ok) {
                window.location.href = data.redirectTo;
            } else {
                errorMessage.textContent = data.error || 'Помилка реєстрації';
            }
        } catch {
            errorMessage.textContent = 'Помилка з’єднання з сервером';
        }
    });
});
