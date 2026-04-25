const QRCode = require("qrcode");

class QRCodeService {
  async generate(url) {
    if (!url || typeof url !== "string") {
      const error = new Error("A valid URL is required to generate QR code");
      error.statusCode = 400;
      throw error;
    }

    return QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 320,
    });
  }
}

module.exports = QRCodeService;
