const path = require('path');

const ErrorController = {
    handle404: (req, res) => {
        res.status(404).sendFile(path.join(__dirname, '../../views/error.html'));
    },

    handle403: (req, res) => {
        res.status(403).sendFile(path.join(__dirname, '../../views/error.html'));
    },

    handle500: (req, res) => {
        res.status(500).sendFile(path.join(__dirname, '../../views/error.html'));
    }
};

module.exports = ErrorController;
