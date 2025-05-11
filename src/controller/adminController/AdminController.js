const path = require('path');
// const bcrypt = require('bcrypt');
const db = require('../../models/DataBase.js');
const AdminModel = require('../../repository/adminRepository/AdminRepository.js');

const AdminController = {
    getAdminLogInPage: (req, res) => {
        res.sendFile(path.join(__dirname, '../../../views/admin/admin-log-in.html')); 
    },

    loginAdmin: async (req, res) => {
        const { first_name, last_name, password1, password2  } = req.body;
    
        try {
            const admin = await AdminModel.authenticateAdmin({ first_name, last_name, password1, password2  });
            req.session.admin = admin; 
            res.json({ redirectTo: '/admin/dashboard' }); 

        } catch (err) {
            console.error(err);
            res.status(401).json({ error: err.message }); 
        }
    },

    getAdminDashboardPage: (req, res) => {
        if (!req.session.admin) {
            return res.redirect('/error/403');
        }
        res.sendFile(path.join(__dirname, '../../../views/admin/admin-dashboard.html'));
    },

    postDogAchievement: async (req, res) => {
        const {dog_id, achievement_id, exhibition_id} = req.body;
        try {
            const existingAchievement = await AdminModel.checkAchievementForDog(dog_id, achievement_id);
        
            if (existingAchievement) {
                res.status(400).json({ error: 'Собака вже має це досягнення' });
            }
            else{
                await AdminModel.assignAchievementToDog(dog_id, achievement_id)
                await AdminModel.updateExhibitionRegistrationStatus(dog_id, exhibition_id);
                res.json({ message: 'Досягнення успішно додано!' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Помилка сервера при додаванні досягнення' });
        }
    },

    getAllOwners: async (req, res) => {
        try {
            const { rows } = await db.query(`
            SELECT id, name, surname FROM public.owners ORDER BY id ASC`);
            res.json(rows);
        } catch (err) {
            console.error('Помилка отримання власників:', err);
            res.status(500).json({ error: 'DB error' });
        }
    },
    
    getOwnerDogsById: async (req, res) => {
        const ownerId = req.params.ownerId;
        try {
            const dogs = await AdminModel.getDogsFromExhibitionsByOwnerId(ownerId);
            res.json(dogs);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Помилка сервера при отриманні даних собак' });
        }
    },

    getAllDogsAchievements: async (req, res) => {
        try {
            const achievements = await AdminModel.achievementDogAdmin();
            res.json(achievements)
        } catch (err) {
            console.error('Помилка отримання досягнень:', err);
            res.status(500).json({ error: 'DB error' });
        }
    },

    removingDogFromExhibition: async (req, res) => {
        const {dog_id, exhibition_id} = req.body;
        try {
            await AdminModel.updateExhibitionRegistrationStatus(dog_id, exhibition_id);
            res.json({ message: 'Собаку було успішно знято з виставки!' });
        } catch (err) {
            console.error('Помилка знаття собаки з виставки:', err);
            res.status(500).json({ error: 'DB error' });
        }
    },

    getDogExhibitionById: async (req, res) => {
        const dogId = req.params.dogId;
        try {
            const exhibitions = await AdminModel.getExhibitionsByDogId(dogId);
            res.json(exhibitions);
        } catch (err) {
            console.error('Помилка при отриманні виставок собаки:', err);
            res.status(500).json({ error: 'Помилка сервера при отриманні виставок собаки' });
        }
    },

    getAllExhibitionsCategories: async (req, res) => {
        try {
            const categories = await AdminModel.categoriesExhibitionsAdmin();
            res.json(categories)
        } catch (err) {
            console.error('Помилка отримання досягнень:', err);
            res.status(500).json({ error: 'DB error' });
        }
    },

    postExhibitionsByAdmin: async (req, res) => {
        const { name, date, location, organizer, category_id, selectedBreeds } = req.body;
        try {
            const exhibitionId = await AdminModel.postExhibitionToDB(name, date, location, organizer, category_id);
            await AdminModel.updateExhibitionAllowedBreeds(exhibitionId, selectedBreeds);
            res.json({ message: 'Виставка успішно додан!' });
        } catch (err) {
            console.error('Помилка при отриманні виставок собаки:', err);
            res.status(500).json({ error: 'Помилка сервера при отриманні виставок собаки' });
        }
    }

    // createAdministrator: async (req, res) => {
    //     try {
    //         const firstName = 'Admin';
    //         const lastName = 'Admin';
    //         const plainPassword1 = 'password';
    //         const plainPassword2 = 'password';

    //         const password1 = await bcrypt.hash(plainPassword1, 10);
    //         const password2 = await bcrypt.hash(plainPassword2, 10);

    //         const query = `
    //             INSERT INTO admins (first_name, last_name, password1, password2)
    //             VALUES ($1, $2, $3, $4)
    //         `;
    
    //         const values = [firstName, lastName, password1, password2];
    //         await db.query(query, values);

    //     } catch (error) {
    //         console.error('Помилка створення адміністратора:', error);
    //     }
    // },
};

module.exports = AdminController;