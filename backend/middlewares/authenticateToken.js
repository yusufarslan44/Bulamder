const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// JWT secret key
const jwtKey = process.env.SECRET_KEY || 'secretkey';

const authenticateToken = async (req, res, next) => {
    try {
        // Token'ı Authorization header'ından al
        console.log("req.headers", req.headers)
        const authHeader = req.headers['authorization'];
        console.log("authHeader", authHeader)
        if (!authHeader) {
            return res.status(401).json({ message: 'Yetkilendirme başlığı bulunamadı' });
        }
        
        // "Bearer TOKEN" formatından TOKEN kısmını çıkar
        const token = authHeader.split(' ')[1];
        console.log("token", token)
        if (!token) {
            return res.status(401).json({ message: 'Token bulunamadı' });
        }

        // Token'ı doğrula
        jwt.verify(token, jwtKey, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token süresi dolmuş' });
                }
                return res.status(401).json({ message: 'Geçersiz token' });
            }

            // Doğrulanan kullanıcı bilgisini request objesine ekle
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports = authenticateToken;