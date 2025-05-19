const path = require('path');
const RegistrationServiceDO = require('../../service/RegistrationServiceDO.js');

const RegOwnerController = {
    getRegOwnerPage: (req, res) => {
        res.sendFile(path.join(__dirname, '../../../views/index.html'));
    },
    
    registerOwner: async (req, res) => {
    try {
            const tempOwnerData = await RegistrationServiceDO.registerOwner(req.body);
            req.session.temp_owner_data = tempOwnerData;
            res.json({ redirectTo: '/dog' });
        } catch (err) {
            console.error('Помилка при реєстрації власника:', err);
            res.status(401).json({ error: err.message || 'Помилка реєстрації' });
        }
    }
};

module.exports = RegOwnerController;