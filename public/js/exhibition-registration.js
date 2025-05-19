document.addEventListener('DOMContentLoaded', async () => {
  const exhibitionSelect = document.getElementById('exhibition_id');
  const dogSelect = document.getElementById('dog_id');
  const form = document.querySelector('form');
  const errorMessage = document.getElementById('error-message');

  const fetchData = async (url, targetSelect, defaultMessage, getDataFunc) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Помилка запиту');
      const data = await response.json();
      targetSelect.innerHTML = `<option value="" disabled selected>${defaultMessage}</option>`;
      getDataFunc(data).forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name || `${item.name} (${new Date(item.date).toLocaleDateString()})`;
        targetSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Помилка при завантаженні:', err);
      targetSelect.innerHTML = `<option value="">${defaultMessage}</option>`;
    }
  };

  await fetchData('/dashboard/api/exhibitions', exhibitionSelect, 'Не вдалося завантажити виставки', exhibitions => exhibitions);
  await fetchData('/dashboard/api/owner-dogs', dogSelect, '-- Оберіть собаку --', dogs => dogs.map(dog => ({
    id: dog.id,
    name: `${dog.name} – ${dog.breed} – ${dog.age} років`
  })));

  dogSelect.addEventListener('change', () => {
    exhibitionSelect.disabled = !dogSelect.value;
    exhibitionSelect.innerHTML = exhibitionSelect.disabled ? 
      '<option value="" disabled selected>-- Спочатку оберіть собаку --</option>' : '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { dog_id, exhibition_id } = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch('/dashboard/reg-exhibirions/pet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dog_id, exhibition_id, is_active: true })
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

  dogSelect.addEventListener('change', async () => {
    exhibitionSelect.innerHTML = '';
    if (!dogSelect.value) return;
    await fetchData(`/dashboard/reg-exhibirions/available-exhibitions/${dogSelect.value}`, exhibitionSelect, '-- Оберіть виставку --', exhibitions => exhibitions);
  });

  exhibitionSelect.disabled = true;
});
