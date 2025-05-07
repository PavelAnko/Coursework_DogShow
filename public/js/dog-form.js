const ageInput = document.getElementById('age');

ageInput.addEventListener('input', function () {
    let value = ageInput.value;

    if (!/^\d*$/.test(value)) {
        ageInput.value = value.replace(/\D/g, '');
        return;
    }

    if (parseInt(value, 10) > 16) {
        ageInput.value = '16';
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const errorMsg = document.getElementById("error-message");

    nameInput.addEventListener("input", () => {
        const value = nameInput.value;
        if (value.length > 50) {
            errorMsg.textContent = "Максимум 50 символів Клички для собаки.";
            nameInput.value = value.slice(0, 50);
        } else {
            errorMsg.textContent = "";
        }
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    const breedSelect = document.getElementById('breed_id');
 
    try {
        const response = await fetch('/api/breeds');
        if (!response.ok) throw new Error('Помилка запиту до API порід');

        const breeds = await response.json();
        breedSelect.innerHTML = '<option value="" disabled selected>-- Оберіть породу --</option>';

        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Помилка при завантаженні порід:', err);
        breedSelect.innerHTML = '<option value="">Не вдалося завантажити породи</option>';
    }
});
