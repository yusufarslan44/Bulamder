const mongoose = require('mongoose');

const isValidİd = (id, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Object Id in not valid' })
    }
}

// const findDocumentById = async (model, id, res) => {

//     try {
//         const document = await model.findById(id)
//         if (!document) {
//             res.status(404).json({ error: `The ${model.modelName} does not exist!` })
//             return null;

//         }
//         return document
//     } catch (error) {
//         console.error(`Error while finding ${model.modelName}by ID`, error);
//         return res.status(500).json({ error: 'Internal Server error' })
//     }
// }

const checkValidationErrors = (error, res) => {
    const validationErrors = {};

    for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message
    }
    return res
        .status(400)
        .json({ error: 'Validation error', validationErrors })
}

module.exports = {
    isValidİd,

    checkValidationErrors
}