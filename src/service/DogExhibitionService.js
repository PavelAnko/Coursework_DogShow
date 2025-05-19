const RegisterDogsModel = require('../../src/repository/RegisterDogsRepository.js');

const DogExhibitionService = {
    registerDogToExhibition: async (req, res) => {
        const owner = req.session.owner;
        if (!owner) return res.status(403).json({ error: 'Неавторизований доступ' });

        const { dog_id, exhibition_id } = req.body;
        if (!dog_id || !exhibition_id) {
        return res.status(400).json({ error: 'Відсутні необхідні поля' });
        }

        const checkResult = await RegisterDogsModel.checkIfDogIsRegistered(dog_id, exhibition_id);

        if (checkResult.rowCount > 0) {
            const existing = checkResult.rows[0];
            if (existing.is_active) {
                return res.status(409).json({ error: 'Собака вже зареєстрована на цю виставку' });
            } else {
                await RegisterDogsModel.reactivateDogRegistration(dog_id, exhibition_id);
                return res.json({ message: 'Реєстрацію оновлено повторно', redirectTo: '/dashboard' });
            }
        }

        await RegisterDogsModel.insertDogRegistration(dog_id, exhibition_id, owner.id);
        return res.json({ redirectTo: '/dashboard' });
    }
};

module.exports = DogExhibitionService;
