const PageContent = require('../models/PageContent');
const { toAbsoluteUrl } = require("../utils/filePaths");

const normalizeUploadPath = (value) => {
    if (!value || typeof value !== "string") return value;
    const uploadsIndex = value.indexOf("/uploads/");
    if (uploadsIndex === -1) return value;
    return value.slice(uploadsIndex);
};

const normalizeMembers = (members = []) =>
    members.map((member) => ({
        ...member,
        image: normalizeUploadPath(member?.image),
    }));

const normalizeSections = (sections = []) =>
    sections.map((section) => ({
        ...section,
        imageUrl: normalizeUploadPath(section?.imageUrl),
        imageUrls: Array.isArray(section?.imageUrls)
            ? section.imageUrls.map((url) => normalizeUploadPath(url)).filter(Boolean)
            : section?.imageUrls,
        members: Array.isArray(section?.members)
            ? normalizeMembers(section.members)
            : section?.members,
    }));

const formatMembers = (members = [], req) =>
    members.map((member) => ({
        ...member,
        image: toAbsoluteUrl(req, member?.image),
    }));

const formatSections = (sections = [], req) =>
    sections.map((section) => ({
        ...section,
        imageUrl: toAbsoluteUrl(req, section?.imageUrl),
        imageUrls: Array.isArray(section?.imageUrls)
            ? section.imageUrls.map((url) => toAbsoluteUrl(req, url)).filter(Boolean)
            : section?.imageUrls,
        members: Array.isArray(section?.members)
            ? formatMembers(section.members, req)
            : section?.members,
    }));

const formatPageContent = (pageContentDoc, req) => {
    if (!pageContentDoc) return null;
    const pageContent =
        typeof pageContentDoc.toObject === "function"
            ? pageContentDoc.toObject()
            : { ...pageContentDoc };

    if (Array.isArray(pageContent.sections)) {
        pageContent.sections = formatSections(pageContent.sections, req);
    }

    return pageContent;
};

// Tüm sayfa içeriklerini getir
exports.getAllPageContents = async (req, res) => {
    try {
        const pageContents = await PageContent.find({});
        res.status(200).json({
            pageContents: pageContents.map((page) => formatPageContent(page, req)),
        });
    } catch (error) {
        console.error('Sayfa içerikleri getirilirken hata:', error);
        res.status(500).json({ message: 'Sayfa içerikleri getirilirken bir hata oluştu', error: error.message });
    }
};

// Belirli bir sayfanın içeriğini getir
exports.getPageContentByName = async (req, res) => {
    try {
        const { pageName } = req.params;
        const pageContent = await PageContent.findOne({ pageName, status: 'published' });

        if (!pageContent) {
            return res.status(404).json({ message: 'Sayfa içeriği bulunamadı' });
        }

        res.status(200).json({ pageContent: formatPageContent(pageContent, req) });
    } catch (error) {
        console.error('Sayfa içeriği getirilirken hata:', error);
        res.status(500).json({ message: 'Sayfa içeriği getirilirken bir hata oluştu', error: error.message });
    }
};

// Yeni sayfa içeriği oluştur
exports.createPageContent = async (req, res) => {
    try {
        const { pageName, title, sections, status } = req.body;
        const normalizedSections = Array.isArray(sections)
            ? normalizeSections(sections)
            : [];

        // Sayfa adına göre önceden var mı kontrol et
        const existingPage = await PageContent.findOne({ pageName });
        if (existingPage) {
            return res.status(400).json({ message: 'Bu isimde bir sayfa içeriği zaten mevcut' });
        }

        const newPageContent = new PageContent({
            pageName,
            title,
            sections: normalizedSections,
            status: status || 'published'
        });

        await newPageContent.save();
        res.status(201).json({
            message: 'Sayfa içeriği başarıyla oluşturuldu',
            pageContent: formatPageContent(newPageContent, req)
        });
    } catch (error) {
        console.error('Sayfa içeriği oluşturulurken hata:', error);
        res.status(500).json({ message: 'Sayfa içeriği oluşturulurken bir hata oluştu', error: error.message });
    }
};

// Sayfa içeriğini güncelle
exports.updatePageContent = async (req, res) => {
    try {
        const { pageName } = req.params;
        const { title, sections, status } = req.body;
        const normalizedSections = Array.isArray(sections)
            ? normalizeSections(sections)
            : null;

        const pageContent = await PageContent.findOne({ pageName });

        if (!pageContent) {
            return res.status(404).json({ message: 'Güncellenecek sayfa içeriği bulunamadı' });
        }

        // Alanları güncelle
        if (title) pageContent.title = title;
        if (normalizedSections) pageContent.sections = normalizedSections;
        if (status) pageContent.status = status;

        await pageContent.save();
        res.status(200).json({
            message: 'Sayfa içeriği başarıyla güncellendi',
            pageContent: formatPageContent(pageContent, req)
        });
    } catch (error) {
        console.error('Sayfa içeriği güncellenirken hata:', error);
        res.status(500).json({ message: 'Sayfa içeriği güncellenirken bir hata oluştu', error: error.message });
    }
};

// Sayfa içeriğini sil
exports.deletePageContent = async (req, res) => {
    try {
        const { pageName } = req.params;

        const result = await PageContent.findOneAndDelete({ pageName });

        if (!result) {
            return res.status(404).json({ message: 'Silinecek sayfa içeriği bulunamadı' });
        }

        res.status(200).json({ message: 'Sayfa içeriği başarıyla silindi' });
    } catch (error) {
        console.error('Sayfa içeriği silinirken hata:', error);
        res.status(500).json({ message: 'Sayfa içeriği silinirken bir hata oluştu', error: error.message });
    }
}; 
