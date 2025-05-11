const today = new Date().toISOString().split('T')[0];
document.getElementById('date').min = today;

document.addEventListener('DOMContentLoaded', async () => {
    const ownerSelect = document.getElementById('owner_id');
    const dogSelect = document.getElementById('dog_id');
    const achievementSelect = document.getElementById('achievement_id');
    const form = document.getElementById('add-achievement-form');
    const errorMessage = document.getElementById('achievement-error-message');
    const removeButton = document.getElementById('remove-from-exhibition');
    const exhibitionSelect = document.getElementById('exhibition_id');

    dogSelect.disabled = true;
    dogSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть власника --</option>';

    achievementSelect.disabled = true;
    achievementSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть власника --</option>';

    exhibitionSelect.disabled = true;
    exhibitionSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть власника --</option>';

    await fetchData('/api/all-owners', ownerSelect, '-- Оберіть власника --', owners =>
        owners.map(owner => ({
            id: owner.id,
            name: `${owner.id} – ${owner.name} ${owner.surname}`
        }))
    );

    ownerSelect.addEventListener('change', async () => {
        const ownerId = ownerSelect.value;

        if (!ownerId) {
            dogSelect.disabled = true;
            dogSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть власника --</option>';

            achievementSelect.disabled = true;
            achievementSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть власника --</option>';

            exhibitionSelect.disabled = true;
            exhibitionSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть власника --</option>';
            return;
        }

        dogSelect.disabled = false;
        removeButton.disabled = true;

        await fetchData(`/api/owner-dogs/${ownerId}`, dogSelect, '-- Оберіть собаку --', dogs =>
            dogs.map(dog => ({
                id: dog.id,
                name: `${dog.name} – ${dog.breed} – ${dog.age} років`
            }))
        );

        achievementSelect.disabled = true;
        achievementSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть собаку --</option>';

        exhibitionSelect.disabled = true;
        exhibitionSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть собаку --</option>';
    });

    dogSelect.addEventListener('change', async () => {
        const dogId = dogSelect.value;

        if (!dogId) {
            achievementSelect.disabled = true;
            achievementSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть собаку --</option>';

            exhibitionSelect.disabled = true;
            exhibitionSelect.innerHTML = '<option value="" disabled selected>-- Спочатку оберіть собаку --</option>';
            return;
        }

        removeButton.disabled = true;
        exhibitionSelect.disabled = false;
        achievementSelect.disabled = false;

        await fetchData('/api/dog-achievements', achievementSelect, '-- Оберіть досягнення --', achievements =>
            achievements.map(a => ({
                id: a.id,
                name: `${a.title}`
            }))
        );

        await fetchData(`/api/dog-exhibition/${dogId}`, exhibitionSelect, '-- Оберіть виставку --', exhibitions =>
            exhibitions.map(a => ({
                id: a.id,
                name: `${a.title}`
            }))
        );
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const { dog_id, achievement_id, exhibition_id} = Object.fromEntries(new FormData(form));

        console.log('dog_id:', dog_id);
        console.log('achievement_id:', achievement_id);
        console.log('exhibition_id:', exhibition_id);

        try {
            const response = await fetch('/admin/dashboard-achievement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dog_id, achievement_id, exhibition_id})
            });

            const result = await response.json();

            if (response.ok) {
                alert('Досягнення успішно додано!');
                window.location.reload();
            } else {
                errorMessage.textContent = result.error || 'Сталася помилка';
            }
        } catch {
            errorMessage.textContent = 'Помилка з’єднання з сервером';
        }
    });

    exhibitionSelect.addEventListener('change', () => {
        removeButton.disabled = false;
    });
    

});

document.getElementById('remove-from-exhibition').addEventListener('click', async (e) => {
    e.preventDefault();

    const dogSelect = document.getElementById('dog_id');
    const exhibitionSelect = document.getElementById('exhibition_id');
    const dogId = dogSelect.value;
    const exhibitionId = exhibitionSelect.value;

    try {
        const response = await fetch('/admin/removing-dog-exhibition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dog_id: dogId, exhibition_id: exhibitionId })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Собаку знято з виставки');
            window.location.reload();
        } else {
            errorMessage.textContent = result.error || result.message || 'Не вдалося зняти собаку';
        }
    } catch {
        errorMessage.textContent = 'Помилка з’єднання з сервером';
    }
});


document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('category_id');
    const form = document.getElementById('add-exhibition-form');
    const message = document.getElementById('exhibition-message');
    const errorMessage = document.getElementById('exhibition-error-message');    
    const name = document.getElementById('name').value.trim();
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value.trim();
    const organizer = document.getElementById('organizer').value.trim();
    const categoryId = categorySelect.value;
    
    try {
        await fetchData('/api/exhibitions-categories', categorySelect, '-- Оберіть категорію --', categories =>
            categories.map(c => ({
                id: c.id,
                name: c.name
            }))
        );
    } catch (err) {
        console.error('Помилка завантаження категорій:', err);
        errorMessage.textContent = 'Не вдалося завантажити категорії.';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const checkboxes = document.querySelectorAll('input[name="breeds"]:checked');
        const selectedBreeds = [];

        checkboxes.forEach(checkbox => {
           selectedBreeds.push(Number(checkbox.value));
        });

        if (selectedBreeds.length === 0) {
            errorMessage.textContent = 'Будь ласка, оберіть хоча б одну породу.';
            return;
        } else {
            errorMessage.textContent = '';
        }

        const { name, date, location, organizer, category_id} = Object.fromEntries(new FormData(form));

        console.log('name:', name);
        console.log('date:', date);
        console.log('location:', location);
        console.log('organizer:', organizer);
        console.log('category_id:', category_id);
        console.log('Вибрані породи (breed_ids):', selectedBreeds);


        try {
            const response = await fetch('/admin/dashboard-exhibition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, date, location, organizer, category_id, selectedBreeds})
            });

            const result = await response.json();

            if (response.ok) {
                alert('Виставка успішно додано!');
                window.location.reload();
            } else {
                errorMessage.textContent = result.error || 'Сталася помилка';
            }

        } catch {
            errorMessage.textContent = 'Помилка з’єднання з сервером';
        }
    });
});


const fetchData = async (url, targetSelect, defaultMessage, formatDataFn) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Помилка запиту');
        const data = await response.json();
        targetSelect.innerHTML = `<option value="" disabled selected>${defaultMessage}</option>`;
        formatDataFn(data).forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            targetSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Помилка при завантаженні:', err);
        targetSelect.innerHTML = `<option value="" disabled selected>${defaultMessage}</option>`;
    }
};
