document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/owner-info')
        .then(res => res.json())
        .then(data => {
            const ownerDiv = document.getElementById('owner-info');
            if (ownerDiv) {
                ownerDiv.textContent = `${data.name} ${data.surname}`;
            }
        })
        .catch(err => {
            console.error('Помилка отримання даних користувача:', err);
        });
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/owner-dogs');
        const dogs = await res.json();

        const dogsBox = document.getElementById('dogs-box');
        dogsBox.innerHTML = '';

        dogs.forEach(dog => {
            const dogEntry = document.createElement('div');
            dogEntry.classList.add('dog-entry');

            dogEntry.innerHTML = `
                <button class="delete-btn" data-id="${dog.id}">❌</button>
                <div class="dog-info">${dog.name} — ${dog.breed}, ${dog.age} років</div>
                <div class="dog-achievement">Досягнення будуть тут</div>
            `;

            dogsBox.appendChild(dogEntry);
        });
    } catch (err) {
        console.error('Помилка при завантаженні собак:', err);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('/api/exhibitions');
      if (!res.ok) throw new Error(res.status);
      const exhibitions = await res.json();
  
      // відрізаємо останню та збираємо HTML-блоки з <hr> між ними
      const html = exhibitions
        .slice(0, -1)
        .map(({ name, date, location, organizer }) => {
          const d = new Date(date).toLocaleDateString('uk-UA', {
            day: 'numeric', month: 'long', year: 'numeric'
          });
          return `
            <div class="exhibition-block">
              <h3 class="exhibition-name">${name}</h3>
              <p class="exhibition-details">
                ${d}, ${location}<br>Організатор: ${organizer}
              </p>
            </div>
          `;
        })
        .join('<hr>');
  
      document.getElementById('exhibitions-list').innerHTML = html;
    } catch (err) {
      console.error('Помилка при завантаженні виставок:', err);
    }
});
    
  


document.getElementById('add-dog-btn').addEventListener('click', function () {
    window.location.href = '/add-dog';
});

