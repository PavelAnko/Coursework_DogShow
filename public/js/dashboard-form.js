document.addEventListener('DOMContentLoaded', () => {
    fetch('/dashboard/api/owner-info')
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
    const res = await fetch('/dashboard/api/owner-dogs');
    const dogs = await res.json();

    const dogsBox = document.getElementById('dogs-box');
    dogsBox.innerHTML = '';

    if (dogs.length === 0) {
        dogsBox.innerHTML = '<div class="no-dogs-message">У вас поки що немає зареєстрованих собак 🐶</div>';
        return;
    }

    for (const dog of dogs) {
        const dogEntry = document.createElement('div');
        dogEntry.classList.add('dog-entry');

        let achievementText = 'Досягнень поки немає';
        try {
            let dogId = dog.id;
            const achRes = await fetch(`/dashboard/api/dog-achievements/${dogId}`);
            const achievements = await achRes.json();

            if (Array.isArray(achievements) && achievements.length > 0) {
                achievementText = achievements.map(a => a.title).join(', ');
            }
        } catch (e) {
            console.error(`Помилка завантаження досягнень собаки ${dog.id}:`, e);
        }

        dogEntry.innerHTML = `
            <button class="delete-btn" data-id="${dog.id}">❌</button>
            <div class="dog-info">${dog.name} — ${dog.breed}, ${dog.age} років</div>
            <div class="dog-achievement">${achievementText}</div>
        `;

        dogsBox.appendChild(dogEntry);
      }
    }catch (err) {
        console.error('Помилка при завантаженні собак:', err);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('/dashboard/api/exhibitions');
      if (!res.ok) throw new Error(res.status);
      const exhibitions = await res.json();
  
      const html = exhibitions
        .slice(0, -1)
        .map(({ name, date, location, organizer, category_name }) => {
          const d = new Date(date).toLocaleDateString('uk-UA', {
            day: 'numeric', month: 'long', year: 'numeric'
          });
          return `
            <div class="exhibition-block">
                <h3 class="exhibition-name">${name}</h3>
                <p class="exhibition-details">
                    ${d}, ${location}<br>
                    Організатор: ${organizer}<br>
                     Категорія: ${category_name}
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
    window.location.href = '/dog';
});

document.getElementById('register-dog-exhib-btn').addEventListener('click', function () {
  window.location.href = '/dashboard/reg-exhibirions';
});

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#registrations-table tbody');

  try {
    const response = await fetch('/dashboard/reg-exhibirions/api/owner-registrations');
    const data = await response.json();

    if (!response.ok || !Array.isArray(data)) {
      throw new Error('Некоректна відповідь сервера');
    }

    tableBody.innerHTML = ''; 

    if (data.length === 0) { 
      tableBody.innerHTML = '<tr><td colspan="3">Немає зареєстрованих собак</td></tr>';
      return;
    }

    const activeRegistrations = data.filter(reg => reg.status === 'Зареєстровано'); 

    if (activeRegistrations.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">Немає зареєстрованих собак</td></tr>';
      return;
    }

    activeRegistrations.forEach(reg => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${reg.dog_name}</td>
        <td>${reg.exhibition_name}</td>
        <td>${reg.status}</td>
      `;
      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error('Помилка при завантаженні реєстрацій:', err);
    tableBody.innerHTML = '<tr><td colspan="3">Помилка при завантаженні даних</td></tr>';
  }
});


document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const confirmed = confirm("Ви впевнені, що хочете видалити?");
    if (!confirmed) return;

    const dogId = e.target.getAttribute('data-id');

    if (!dogId) {
      console.error("dogId не знайдено");
      return;
    }

    (async () => {
      try {
        
        const deleteRes = await fetch(`/dashboard/api/delete-dog/${dogId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });

        if (deleteRes.ok) {
          alert("Собку успішно видалено!");
          window.location.reload();
        } else {
          alert("Помилка при видаленні собаки.");
        }
      } catch (err) {
        console.error('Помилка при видаленні собаки:', err);
        alert("Помилка з’єднання з сервером.");
      }
    })();
  }
});

document.getElementById('log-out-btn').addEventListener('click', async () => {
  try {
    const res = await fetch('/dashboard/logout', { method: 'POST' });
    if (res.ok) {
      window.location.href = '/login';
    } else {
      console.error('Помилка при виході з акаунту');
    }
  } catch (err) {
    console.error('Помилка з’єднання при виході:', err);
  }
});
