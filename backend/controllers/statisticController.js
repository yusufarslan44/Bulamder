const Statistic = require('../models/Statistic');
const Photo = require('../models/Photo');
const Event = require('../models/Event');

// Sahte haftalık veriler
const fakeWeeklyData = {
  monday: 245,
  tuesday: 312,
  wednesday: 287,
  thursday: 334,
  friday: 389,
  saturday: 423,
  sunday: 298
};

// İstatistikleri getir
exports.getStatistics = async (req, res) => {
  try {
    let stats = await Statistic.findOne();
    
    if (!stats) {
      // Eğer istatistik yoksa, sahte başlangıç değerleriyle oluştur
      const totalVisitors = Object.values(fakeWeeklyData).reduce((a, b) => a + b, 0);
      stats = new Statistic({
        visitorCount: totalVisitors,
        photoCount: (await Photo.countDocuments()) || 45, // En az 45 fotoğraf
        eventCount: (await Event.countDocuments()) || 12, // En az 12 etkinlik
        weeklyVisitors: fakeWeeklyData,
        lastUpdated: new Date()
      });
      await stats.save();
    } else {
      // Güncel sayıları al
      const photoCount = await Photo.countDocuments() || 45;
      const eventCount = await Event.countDocuments() || 12;

      // İstatistikleri güncelle
      stats.photoCount = photoCount;
      stats.eventCount = eventCount;
      stats.weeklyVisitors = fakeWeeklyData;
      stats.lastUpdated = new Date();
      
      await stats.save();
    }

    res.json(stats);
  } catch (error) {
    console.error('İstatistikler getirilirken hata:', error);
    res.status(500).json({ message: 'İstatistikler getirilirken bir hata oluştu' });
  }
};

// Ziyaretçi sayısını artır
exports.incrementVisitorCount = async (req, res) => {
  try {
    let stats = await Statistic.findOne();
    
    if (!stats) {
      const totalVisitors = Object.values(fakeWeeklyData).reduce((a, b) => a + b, 0);
      stats = new Statistic({
        visitorCount: totalVisitors,
        weeklyVisitors: fakeWeeklyData
      });
    }

    // Günün ziyaretçi sayısını artır
    const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
    if (stats.weeklyVisitors) {
      stats.weeklyVisitors[today] = (stats.weeklyVisitors[today] || 0) + 1;
    }
    
    stats.visitorCount += 1;
    await stats.save();

    res.json({ success: true, visitorCount: stats.visitorCount, weeklyVisitors: stats.weeklyVisitors });
  } catch (error) {
    console.error('Ziyaretçi sayısı güncellenirken hata:', error);
    res.status(500).json({ message: 'Ziyaretçi sayısı güncellenirken bir hata oluştu' });
  }
}; 