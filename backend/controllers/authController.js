const Admin = require("../models/Admin");

const { checkValidationErrors } = require("../utils");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    console.log("req body", req.body);
    try {
        const { email } = req.body

        const emailExist = await Admin.findOne({ email })
        if (emailExist) {
            return res.status(400).json({ error: 'The Email is already exist' })
        }

        const user = await Admin.create(req.body)

        user.password = undefined
        return res
            .status(201)
            .json({ message: 'Admin kaydı oluşturuldu. Onay bekleniyor.', user: user })

    } catch (error) {
        //Handle mongoose validation error
        if (error.name === 'ValidationError') {
            if (checkValidationErrors(error, res)) return
        } else {
            console.error("Erorr at register", error)
            return res.status(500).json({ error: 'Internal Server error' })
        }
    }
}



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ message: 'Geçersiz giriş bilgileri' });
        }

        // Kullanıcı onaylanmadıysa giriş yapmasına izin verme
        if (admin.status !== 'approved') {
            return res.status(403).json({ message: 'Hesabınız henüz onaylanmamış. Lütfen admin onayını bekleyin.' });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.SECRET_KEY || 'secretkey', { expiresIn: '1h' });

        // Token ve kullanıcı bilgilerini dön
        res.json({ 
            message: 'Giriş başarılı',
            token: token,
            user: {
                _id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Login hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

const getPendingAdmins = async (req, res) => {
    try {
        const pendingAdmins = await Admin.find({ status: 'pending' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(pendingAdmins);
    } catch (error) {
        console.error("Error at getPendingAdmins:", error);
        res.status(500).json({ error: 'Internal Server error' });
    }
};

const approveAdmin = async (req, res) => {
    const { action, approvedBy } = req.body;
    const { id } = req.params;

    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin bulunamadı' });
        }

        if (admin.status !== 'pending') {
            return res.status(400).json({ error: 'Bu başvuru zaten işlenmiş' });
        }

        admin.status = action === 'approve' ? 'approved' : 'rejected';
        admin.approvedBy = approvedBy;
        await admin.save();

        // Email gönderme işlemi burada yapılabilir
        // await sendStatusEmail(admin.email, admin.status);

        res.json({ 
            message: `Admin başvurusu ${action === 'approve' ? 'onaylandı' : 'reddedildi'}`,
            admin: {
                ...admin.toObject(),
                password: undefined
            }
        });
    } catch (error) {
        console.error("Error at approveAdmin:", error);
        res.status(500).json({ error: 'Internal Server error' });
    }
};
// const getProtectedData = (req, res) => {
//     res.json({ message: 'Protected data', user: req.user });
// };

module.exports = {
    register,
    login,
    getPendingAdmins,
    approveAdmin
    // getProtectedData,
}