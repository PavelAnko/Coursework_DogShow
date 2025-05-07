document.addEventListener('DOMContentLoaded', async () => {
    const exhibitionSelect = document.getElementById('exhibition_id');
  
    try {
      const response = await fetch('/api/exhibitions');
      if (!response.ok) throw new Error('Помилка запиту до API виставок');
  
      const exhibitions = await response.json();
      exhibitionSelect.innerHTML = '<option value="" disabled selected>-- Оберіть виставку --</option>';
  
      exhibitions.forEach(exhibition => {
        const option = document.createElement('option');
        option.value = exhibition.id;
        option.textContent = exhibition.name;
        exhibitionSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Помилка при завантаженні виставок:', err);
      exhibitionSelect.innerHTML = '<option value="">Не вдалося завантажити виставки</option>';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const dogSelect = document.getElementById('dog_id');
  
    try {
      const res = await fetch('/api/owner-dogs');
      if (!res.ok) throw new Error('Помилка запиту');
  
      const dogs = await res.json();
  
      dogSelect.innerHTML = '<option value="" disabled selected>-- Оберіть собаку --</option>';
  
      dogs.forEach(dog => {
        const option = document.createElement('option');
        option.value = dog.id;
        option.textContent = `${dog.name} – ${dog.breed} – ${dog.age} років`;
        dogSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Помилка при завантаженні собак:', err);
      dogSelect.innerHTML = '<option value="">Не вдалося завантажити собак</option>';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const { dog_id, exhibition_id } = Object.fromEntries(new FormData(form));
  
      try {
        const response = await fetch('/dashboard/reg-exhibirions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dog_id,
            exhibition_id,
            is_active: true 
          })
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

  
  