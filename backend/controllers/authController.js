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
// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const user = await Admin.findOne({ email })
//         if (!user) {
//             return res.status(404).json({ error: 'The Admin not found' })
//         }
//         const isValidPassword = await bcrypt.compare(password, user.password)
//         if (!isValidPassword) {
//             return res.status(401).json({ error: 'The Password incorret' })
//         }

//         //Create Token
//         const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });



//         user.password = undefined
//         return res
//             .status(200)
//             .json({ message: 'Admin logged in successfully', user, token })
//     } catch (error) {
//         console.error("Erorr at login", error)
//         return res.status(500).json({ error: 'Internal Server error' })
//     }
// }


const login = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ message: 'Geçersiz giriş bilgileri' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, 'secretkey', { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000
    });

    res.json({ message: 'Giriş başarılı' });
};

const approveAdmin = async (req, res) => {
    const { action, approvedBy } = req.body; // action: 'approve' | 'reject'
    const { id } = req.params;

    try {
        const admin = await Admin.findById(id);
        if (!admin) return res.status(404).json({ message: 'Admin bulunamadı' });

        admin.status = action === 'approve' ? 'approved' : 'rejected';
        admin.approvedBy = approvedBy;
        await admin.save();

        // E-posta bildirimi gönder (aşağıda detay)
        await sendStatusEmail(admin.email, admin.status);

        res.json({ message: `Admin ${action === 'approve' ? 'onaylandı' : 'reddedildi'}` });
    } catch (err) {
        res.status(500).json({ message: 'Hata', error: err.message });
    }
}
// const getProtectedData = (req, res) => {
//     res.json({ message: 'Protected data', user: req.user });
// };

module.exports = {
    register,
    login,
    approveAdmin
    // getProtectedData,
}