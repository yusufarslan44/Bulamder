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
                imageUrl: String,
                members: [
                    {
                        name: String,
                        position: String,
                        description: String,
                        image: String,
                        social: [
                            {
                                icon: String,
                                link: String
                            }
                        ]
                    }
                ],
                features: [
                    {
                        icon: String,
                        title: String,
                        description: String
                    }
                ],
                stats: [
                    {
                        value: String,
                        label: String
                    }
                ],
                values: [
                    {
                        icon: String,
                        title: String,
                        description: String
                    }
                ]
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
