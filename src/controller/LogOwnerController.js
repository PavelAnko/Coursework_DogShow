const path = require('path');
const AuthService = require('../service/AuthService.js')

const LogOwnerController = {
    getLogOwnerPage: (req, res) => {
        res.sendFile(path.join(__dirname, '../../views/log_in.html'));
    },
    
    loginOwner: async (req, res) => {
        const { name, phone_number, password } = req.body;
        try {
            const owner = await AuthService.authenticateOwner({ name, phone_number, password });
            req.session.owner = owner;
            res.json({ redirectTo: '/dashboard' });
        } catch (err) {
            console.error(err);
            res.status(401).json({ error: err.message });
        }
    }     
};

module.exports = LogOwnerController;