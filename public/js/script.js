document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    nameInput.addEventListener("input", function () {
        this.value = this.value.replace(/[0-9]/g, ''); 
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone_number');
    const form = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');

    phoneInput.addEventListener('focus', () => {
        if (!phoneInput.value.startsWith('+380')) {
            phoneInput.value = '+380';
        }
    });

    phoneInput.addEventListener('input', () => {
        if (!phoneInput.value.startsWith('+380')) {
            phoneInput.value = '+380';
        }
        phoneInput.value = '+380' + phoneInput.value.slice(4).replace(/\D/g, '').slice(0, 9);
    });

    form.addEventListener('submit', (e) => {
        const phoneRegex = /^\+380\d{9}$/;
        errorMessage.textContent = '';

        if (!phoneRegex.test(phoneInput.value)) {
            e.preventDefault();
            errorMessage.textContent = 'Невірний формат номера телефону! Введіть номер у форматі +380XXXXXXXXX.';
            phoneInput.focus();
        }
    });
});

