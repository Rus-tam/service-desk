const accessLimitation = async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        res.redirect('/');
    }
    next();
};

module.exports = accessLimitation;