const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema(
    {
        pageName: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        sections: [
            {
                sectionName: {
                    type: String,
                    required: true
                },
                title: String,
                subtitle: String,
                content: String,
                imageUrl: String
            }
        ],
        status: {
            type: String,
            enum: ['published', 'draft'],
            default: 'published'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('PageContent', pageContentSchema); 