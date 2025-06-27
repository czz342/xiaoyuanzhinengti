/*
 * uQRCode
 * @author Sansnn
 * @version 4.0.6
 * @see https://github.com/Sansnn/uQRCode
 *
 * The word "QR Code" is registered trademark of DENSO WAVE INCORPORATED
 * http://www.denso-wave.com/qrcode/faqpatent-e.html
 */
(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.UQRCode = factory());
}(this, (function() {
	'use strict';

	functionPlugin.prototype.hooks = {};

	function Plugin(options) {
		this.options = options;
	}

	function extend(target, source) {
		if (source) {
			for (var k in source) {
				target[k] = source[k];
			}
		}
		return target;
	}

	var Util = {
		/* dear-qrcode/src/core/util.js */
		getBackingStorePixelRatio: function(ctx) {
			return (
				ctx.webkitBackingStorePixelRatio ||
				ctx.mozBackingStorePixelRatio ||
				ctx.msBackingStorePixelRatio ||
				ctx.oBackingStorePixelRatio ||
				ctx.backingStorePixelRatio ||
				1
			);
		},
		getDevicePixelRatio: function() {
			return window.devicePixelRatio || 1;
		},
		/* qrcode-core/src/util/util.js */
		checkVersion: function(text, errorCorrectLevel) {
			var length = text.length;
			var bits = 0;
			var version = 1;
			var errorCorrectCapacity;
			while (version <= 40) {
				errorCorrectCapacity = this.getErrorCorrectCapacity(version, errorCorrectLevel);
				switch (this.getMode(text)) {
					case QRMode.MODE_8BIT_BYTE:
						bits = length * 8;
						break;
				}

				if (bits <= errorCorrectCapacity) {
					return version;
				}
				version++;
			}
			return '您的内容超长了';
		},
		getErrorCorrectCapacity: function(version, errorCorrectLevel) {
			var errorCorrectCapacity = G_ERROR_CORRECT_CAPACITY[version-1][errorCorrectLevel-1];
			return errorCorrectCapacity;
		},
		getMode: function(text) {
			var mode = QRMode.MODE_8BIT_BYTE;
			return mode;
		},
		getLengthInBits: function(mode, text, version) {
			var length = text.length;
			if (1 <= version && version < 10) {
				// 1 - 9
				switch (mode) {
					case QRMode.MODE_NUMBER:
						return 10;
					case QRMode.MODE_ALPHA_NUM:
						return 9;
					case QRMode.MODE_8BIT_BYTE:
						return 8;
					case QRMode.MODE_KANJI:
						return 8;
					default:
						throw new Error("mode:" + mode);
				}

			} else if (version < 27) {
				// 10 - 26
				switch (mode) {
					case QRMode.MODE_NUMBER:
						return 12;
					case QRMode.MODE_ALPHA_NUM:
						return 11;
					case QRMode.MODE_8BIT_BYTE:
						return 16;
					case QRMode.MODE_KANJI:
						return 10;
					default:
						throw new Error("mode:" + mode);
				}

			} else if (version < 41) {
				// 27 - 40
				switch (mode) {
					case QRMode.MODE_NUMBER:
						return 14;
					case QRMode.MODE_ALPHA_NUM:
						return 13;
					case QRMode.MODE_8BIT_BYTE:
						return 16;
					case QRMode.MODE_KANJI:
						return 12;
					default:
						throw new Error("mode:" + mode);
				}

			} else {
				throw new Error("version:" + version);
			}
		},
		getLostPoint: function(qrcode) {
			var moduleCount = qrcode.moduleCount;
			var lostPoint = 0;
			var row, col;

			// LEVEL1
			for (row = 0; row < moduleCount; row++) {
				for (col = 0; col < moduleCount; col++) {
					var sameCount = 0;
					var dark = qrcode.isDark(row, col);

					for (var r = -1; r <= 1; r++) {
						if (row + r < 0 || moduleCount <= row + r) {
							continue;
						}
						for (var c = -1; c <= 1; c++) {
							if (col + c < 0 || moduleCount <= col + c) {
								continue;
							}
							if (r == 0 && c == 0) {
								continue;
							}
							if (dark == qrcode.isDark(row + r, col + c)) {
								sameCount++;
							}
						}
					}

					if (sameCount > 5) {
						lostPoint += (3 + sameCount - 5);
					}
				}
			}

			// LEVEL2
			for (row = 0; row < moduleCount - 1; row++) {
				for (col = 0; col < moduleCount - 1; col++) {
					var count = 0;
					if (qrcode.isDark(row, col)) count++;
					if (qrcode.isDark(row + 1, col)) count++;
					if (qrcode.isDark(row, col + 1)) count++;
					if (qrcode.isDark(row + 1, col + 1)) count++;
					if (count == 0 || count == 4) {
						lostPoint += 3;
					}
				}
			}

			// LEVEL3
			for (row = 0; row < moduleCount; row++) {
				for (col = 0; col < moduleCount - 6; col++) {
					if (qrcode.isDark(row, col) &&
						!qrcode.isDark(row, col + 1) &&
						qrcode.isDark(row, col + 2) &&
						qrcode.isDark(row, col + 3) &&
						qrcode.isDark(row, col + 4) &&
						!qrcode.isDark(row, col + 5) &&
						qrcode.isDark(row, col + 6)) {
						lostPoint += 40;
					}
				}
			}

			for (col = 0; col < moduleCount; col++) {
				for (row = 0; row < moduleCount - 6; row++) {
					if (qrcode.isDark(row, col) &&
						!qrcode.isDark(row + 1, col) &&
						qrcode.isDark(row + 2, col) &&
						qrcode.isDark(row + 3, col) &&
						qrcode.isDark(row + 4, col) &&
						!qrcode.isDark(row + 5, col) &&
						qrcode.isDark(row + 6, col)) {
						lostPoint += 40;
					}
				}
			}

			// LEVEL4
			var darkCount = 0;
			for (col = 0; col < moduleCount; col++) {
				for (row = 0; row < moduleCount; row++) {
					if (qrcode.isDark(row, col)) {
						darkCount++;
					}
				}
			}

			var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
			lostPoint += ratio * 10;

			return lostPoint;
		}
	};

	/* qrcode-core/src/qrcode/qr-mode.js */
	var QRMode = {
		MODE_NUMBER: 1 << 0,
		MODE_ALPHA_NUM: 1 << 1,
		MODE_8BIT_BYTE: 1 << 2,
		MODE_KANJI: 1 << 3
	};

	/* qrcode-core/src/qrcode/qr-error-correct-level.js */
	var QRErrorCorrectLevel = {
		L: 1, // 7%
		M: 2, // 15%
		Q: 3, // 25%
		H: 4, // 30%
	};

	var G_ERROR_CORRECT_CAPACITY = [
		[19, 16, 13, 9],
		[34, 28, 22, 16],
		[55, 44, 34, 26],
		[80, 64, 48, 36],
		[108, 86, 62, 46],
		[136, 108, 76, 60],
		[156, 124, 88, 66],
		[194, 154, 110, 86],
		[232, 182, 132, 100],
		[274, 216, 154, 122],
		[324, 254, 180, 140],
		[370, 290, 206, 158],
		[428, 334, 244, 180],
		[461, 365, 261, 203],
		[523, 415, 295, 221],
		[589, 453, 325, 253],
		[647, 507, 367, 283],
		[721, 563, 397, 313],
		[795, 627, 445, 341],
		[861, 669, 485, 385],
		[932, 714, 512, 406],
		[1006, 782, 568, 442],
		[1094, 860, 614, 464],
		[1174, 914, 664, 514],
		[1276, 1000, 718, 538],
		[1370, 1062, 754, 596],
		[1468, 1128, 808, 628],
		[1531, 1193, 869, 659],
		[1631, 1267, 909, 691],
		[1735, 1373, 985, 745],
		[1843, 1455, 1033, 793],
		[1955, 1541, 1115, 845],
		[2071, 1631, 1171, 891],
		[2191, 1725, 1231, 949],
		[2306, 1812, 1286, 981],
		[2434, 1914, 1354, 1051],
		[2566, 1988, 1426, 1095],
		[2702, 2096, 1502, 1143],
		[2812, 2206, 1582, 1219],
		[2956, 2334, 1666, 1273]
	];

	/* qrcode-core/src/qrcode/qr-mask-pattern.js */
	var QRMaskPattern = {
		PATTERN000: 0,
		PATTERN001: 1,
		PATTERN010: 2,
		PATTERN011: 3,
		PATTERN100: 4,
		PATTERN101: 5,
		PATTERN110: 6,
		PATTERN111: 7
	};

	var QRUtil = {
		/* qrcode-core/src/util/qr-util.js */
		getPatternPosition: function(version) {
			return G_PATTERN_POSITION[version - 1];
		},
		getBCHTypeInfo: function(data) {
			var d = data << 10;
			while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G_BCH_TYPE_INFO) >= 0) {
				d ^= (G_BCH_TYPE_INFO << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G_BCH_TYPE_INFO)));
			}
			return ((data << 10) | d) ^ G_BCH_TYPE_MASK;
		},
		getBCHTypeNumber: function(version) {
			var d = version << 12;
			while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G_BCH_TYPE_NUMBER) >= 0) {
				d ^= (G_BCH_TYPE_NUMBER << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G_BCH_TYPE_NUMBER)));
			}
			return (version << 12) | d;
		},
		getBCHDigit: function(data) {
			var digit = 0;
			while (data != 0) {
				digit++;
				data >>>= 1;
			}
			return digit;
		},
		getRSBlocks: function(version, errorCorrectLevel) {
			var rsBlock = G_RS_BLOCKS[version - 1][errorCorrectLevel - 1];
			if (typeof rsBlock == 'undefined') {
				throw new Error("version:" + version + "/errorCorrectLevel:" + errorCorrectLevel);
			}
			return rsBlock;
		}
	};

	var G_PATTERN_POSITION = [
		[],
		[6, 18],
		[6, 22],
		[6, 26],
		[6, 30],
		[6, 34],
		[6, 22, 38],
		[6, 24, 42],
		[6, 26, 46],
		[6, 28, 50],
		[6, 30, 54],
		[6, 32, 58],
		[6, 34, 62],
		[6, 26, 46, 66],
		[6, 26, 48, 70],
		[6, 26, 50, 74],
		[6, 30, 54, 78],
		[6, 30, 56, 82],
		[6, 30, 58, 86],
		[6, 34, 62, 90],
		[6, 28, 50, 72, 94],
		[6, 26, 50, 74, 98],
		[6, 30, 54, 78, 102],
		[6, 28, 54, 80, 106],
		[6, 32, 58, 84, 110],
		[6, 30, 58, 86, 114],
		[6, 34, 62, 90, 118],
		[6, 26, 50, 74, 98, 122],
		[6, 30, 54, 78, 102, 126],
		[6, 26, 52, 78, 104, 130],
		[6, 30, 56, 82, 108, 134],
		[6, 34, 60, 86, 112, 138],
		[6, 30, 58, 86, 114, 142],
		[6, 34, 62, 90, 118, 146],
		[6, 30, 54, 78, 102, 126, 150],
		[6, 24, 50, 76, 102, 128, 154],
		[6, 28, 54, 80, 106, 132, 158],
		[6, 32, 58, 84, 110, 136, 162],
		[6, 26, 54, 82, 110, 138, 166],
		[6, 30, 58, 86, 114, 142, 170]
	];
	var G_BCH_TYPE_INFO = 0x537;
	var G_BCH_TYPE_NUMBER = 0x7973;
	var G_BCH_TYPE_MASK = 0x5412;
	var G_RS_BLOCKS = [
		[
			[1, 26, 19],
			[1, 26, 16],
			[1, 26, 13],
			[1, 26, 9]
		],
		[
			[1, 44, 34],
			[1, 44, 28],
			[1, 44, 22],
			[1, 44, 16]
		],
		[
			[1, 70, 55],
			[1, 70, 44],
			[2, 35, 17],
			[2, 35, 13]
		],
		[
			[1, 100, 80],
			[2, 50, 32],
			[2, 50, 24],
			[4, 25, 9]
		],
		[
			[1, 134, 108],
			[2, 67, 43],
			[2, 33, 15, 2, 34, 16],
			[2, 33, 11, 2, 34, 12]
		],
		[
			[2, 86, 68],
			[4, 43, 27],
			[4, 43, 19],
			[4, 43, 15]
		],
		[
			[2, 98, 78],
			[4, 49, 31],
			[2, 32, 14, 4, 33, 15],
			[4, 39, 13, 1, 40, 14]
		],
		[
			[2, 121, 97],
			[2, 60, 38, 2, 61, 39],
			[4, 40, 18, 2, 41, 19],
			[4, 40, 14, 2, 41, 15]
		],
		[
			[2, 146, 116],
			[3, 58, 36, 2, 59, 37],
			[4, 36, 16, 4, 37, 17],
			[4, 36, 12, 4, 37, 13]
		],
		[
			[2, 86, 68, 2, 87, 69],
			[4, 69, 43, 1, 70, 44],
			[6, 43, 19, 2, 44, 20],
			[6, 43, 15, 2, 44, 16]
		],
		[
			[4, 101, 81],
			[1, 80, 50, 4, 81, 51],
			[4, 50, 22, 4, 51, 23],
			[3, 36, 12, 8, 37, 13]
		],
		[
			[2, 116, 92, 2, 117, 93],
			[6, 58, 36, 2, 59, 37],
			[4, 46, 20, 6, 47, 21],
			[7, 42, 14, 4, 43, 15]
		],
		[
			[4, 133, 107],
			[8, 59, 37, 1, 60, 38],
			[8, 44, 20, 4, 45, 21],
			[12, 33, 11, 4, 34, 12]
		],
		[
			[3, 145, 115, 1, 146, 116],
			[4, 64, 40, 5, 65, 41],
			[11, 36, 16, 5, 37, 17],
			[11, 36, 12, 5, 37, 13]
		],
		[
			[5, 109, 87, 1, 110, 88],
			[5, 65, 41, 5, 66, 42],
			[5, 54, 24, 7, 55, 25],
			[11, 36, 12]
		],
		[
			[5, 122, 98, 1, 123, 99],
			[7, 73, 45, 3, 74, 46],
			[15, 43, 19, 2, 44, 20],
			[3, 45, 15, 13, 46, 16]
		],
		[
			[1, 135, 107, 5, 136, 108],
			[10, 74, 46, 1, 75, 47],
			[1, 50, 22, 15, 51, 23],
			[2, 42, 14, 17, 43, 15]
		],
		[
			[5, 150, 120, 1, 151, 121],
			[9, 69, 43, 4, 70, 44],
			[17, 50, 22, 1, 51, 23],
			[2, 42, 14, 19, 43, 15]
		],
		[
			[3, 141, 113, 4, 142, 114],
			[3, 70, 44, 11, 71, 45],
			[17, 47, 21, 4, 48, 22],
			[9, 39, 13, 16, 40, 14]
		],
		[
			[3, 135, 107, 5, 136, 108],
			[3, 67, 41, 13, 68, 42],
			[15, 54, 24, 5, 55, 25],
			[15, 43, 15, 10, 44, 16]
		],
		[
			[4, 144, 116, 4, 145, 117],
			[17, 68, 42],
			[17, 50, 22, 6, 51, 23],
			[19, 46, 16, 6, 47, 17]
		],
		[
			[2, 139, 111, 7, 140, 112],
			[17, 74, 46],
			[7, 54, 24, 16, 55, 25],
			[34, 37, 13]
		],
		[
			[4, 151, 121, 5, 152, 122],
			[4, 75, 47, 14, 76, 48],
			[11, 54, 24, 14, 55, 25],
			[16, 45, 15, 14, 46, 16]
		],
		[
			[6, 147, 117, 4, 148, 118],
			[6, 73, 45, 14, 74, 46],
			[11, 54, 24, 16, 55, 25],
			[30, 46, 16, 2, 47, 17]
		],
		[
			[8, 132, 106, 4, 133, 107],
			[8, 75, 47, 13, 76, 48],
			[7, 54, 24, 22, 55, 25],
			[22, 45, 15, 13, 46, 16]
		],
		[
			[10, 142, 114, 2, 143, 115],
			[19, 74, 46, 4, 75, 47],
			[28, 50, 22, 6, 51, 23],
			[33, 46, 16, 4, 47, 17]
		],
		[
			[8, 152, 122, 4, 153, 123],
			[22, 73, 45, 3, 74, 46],
			[8, 53, 23, 26, 54, 24],
			[12, 45, 15, 28, 46, 16]
		],
		[
			[3, 147, 117, 10, 148, 118],
			[3, 73, 45, 23, 74, 46],
			[4, 54, 24, 31, 55, 25],
			[11, 45, 15, 31, 46, 16]
		],
		[
			[7, 146, 116, 7, 147, 117],
			[21, 73, 45, 7, 74, 46],
			[1, 53, 23, 37, 54, 24],
			[19, 45, 15, 26, 46, 16]
		],
		[
			[5, 145, 115, 10, 146, 116],
			[19, 75, 47, 10, 76, 48],
			[15, 54, 24, 25, 55, 25],
			[23, 45, 15, 25, 46, 16]
		],
		[
			[13, 145, 115, 3, 146, 116],
			[2, 74, 46, 29, 75, 47],
			[42, 54, 24, 1, 55, 25],
			[23, 45, 15, 28, 46, 16]
		],
		[
			[17, 145, 115],
			[10, 74, 46, 23, 75, 47],
			[10, 54, 24, 35, 55, 25],
			[19, 45, 15, 35, 46, 16]
		],
		[
			[17, 145, 115, 1, 146, 116],
			[14, 74, 46, 21, 75, 47],
			[29, 54, 24, 19, 55, 25],
			[11, 45, 15, 46, 46, 16]
		],
		[
			[13, 145, 115, 6, 146, 116],
			[14, 74, 46, 23, 75, 47],
			[44, 54, 24, 7, 55, 25],
			[59, 46, 16, 1, 47, 17]
		],
		[
			[12, 151, 121, 7, 152, 122],
			[12, 75, 47, 26, 76, 48],
			[39, 54, 24, 14, 55, 25],
			[22, 45, 15, 41, 46, 16]
		],
		[
			[6, 151, 121, 14, 152, 122],
			[6, 75, 47, 34, 76, 48],
			[46, 54, 24, 10, 55, 25],
			[2, 45, 15, 64, 46, 16]
		],
		[
			[17, 152, 122, 4, 153, 123],
			[29, 74, 46, 14, 75, 47],
			[49, 54, 24, 10, 55, 25],
			[24, 45, 15, 46, 46, 16]
		],
		[
			[4, 152, 122, 18, 153, 123],
			[13, 74, 46, 32, 75, 47],
			[48, 54, 24, 14, 55, 25],
			[42, 45, 15, 32, 46, 16]
		],
		[
			[20, 147, 117, 4, 148, 118],
			[40, 75, 47, 7, 76, 48],
			[43, 54, 24, 22, 55, 25],
			[10, 45, 15, 67, 46, 16]
		],
		[
			[19, 148, 118, 6, 149, 119],
			[18, 75, 47, 31, 76, 48],
			[34, 54, 24, 34, 55, 25],
			[20, 45, 15, 61, 46, 16]
		]
	];

	function QR8bitByte(data) {
		this.mode = QRMode.MODE_8BIT_BYTE;
		this.data = data;
		this.parsedData = [];

		// Added to support UTF-8 Characters
		for (var i = 0, l = this.data.length; i < l; i++) {
			var byteArray = [];
			var code = this.data.charCodeAt(i);

			if (code > 0x10000) {
				byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
				byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
				byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
				byteArray[3] = 0x80 | (code & 0x3F);
			} else if (code > 0x800) {
				byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
				byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
				byteArray[2] = 0x80 | (code & 0x3F);
			} else if (code > 0x80) {
				byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
				byteArray[1] = 0x80 | (code & 0x3F);
			} else {
				byteArray[0] = code;
			}

			this.parsedData.push.apply(this.parsedData, byteArray);
		}

		this.parsedData.length = this.data.length;
	}
	QR8bitByte.prototype = {
		getLength: function(buffer) {
			return this.parsedData.length;
		},
		write: function(buffer) {
			for (var i = 0, l = this.parsedData.length; i < l; i++) {
				buffer.put(this.parsedData[i], 8);
			}
		}
	};

	function QRCodeModel(version, errorCorrectLevel) {
		this.version = version;
		this.errorCorrectLevel = errorCorrectLevel;
		this.modules = null;
		this.moduleCount = 0;
		this.dataCache = null;
		this.dataList = [];
	}
	QRCodeModel.prototype = {
		addData: function(data) {
			var newData = new QR8bitByte(data);
			this.dataList.push(newData);
			this.dataCache = null;
		},
		isDark: function(row, col) {
			if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
				throw new Error(row + "," + col);
			}
			return this.modules[row][col];
		},
		getModuleCount: function() {
			return this.moduleCount;
		},
		make: function() {
			this.makeImpl(false, this.getBestMaskPattern());
		},
		makeImpl: function(test, maskPattern) {
			this.moduleCount = this.version * 4 + 17;
			this.modules = new Array(this.moduleCount);
			for (var row = 0; row < this.moduleCount; row++) {
				this.modules[row] = new Array(this.moduleCount);
				for (var col = 0; col < this.moduleCount; col++) {
					this.modules[row][col] = null;
				}
			}
			this.setupPositionProbePattern(0, 0);
			this.setupPositionProbePattern(this.moduleCount - 7, 0);
			this.setupPositionProbePattern(0, this.moduleCount - 7);
			this.setupPositionAdjustPattern();
			this.setupTimingPattern();
			this.setupTypeInfo(test, maskPattern);
			if (this.version >= 7) {
				this.setupTypeNumber(test);
			}
			if (this.dataCache == null) {
				this.dataCache = QRCodeModel.createData(this.version, this.errorCorrectLevel, this.dataList);
			}
			this.mapData(this.dataCache, maskPattern);
		},
		setupPositionProbePattern: function(row, col) {
			for (var r = -1; r <= 7; r++) {
				if (row + r <= -1 || this.moduleCount <= row + r) continue;
				for (var c = -1; c <= 7; c++) {
					if (col + c <= -1 || this.moduleCount <= col + c) continue;
					if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
						this.modules[row + r][col + c] = true;
					} else {
						this.modules[row + r][col + c] = false;
					}
				}
			}
		},
		getBestMaskPattern: function() {
			var minLostPoint = 0;
			var pattern = 0;
			for (var i = 0; i < 8; i++) {
				this.makeImpl(true, i);
				var lostPoint = Util.getLostPoint(this);
				if (i == 0 || minLostPoint > lostPoint) {
					minLostPoint = lostPoint;
					pattern = i;
				}
			}
			return pattern;
		},
		createMovieClip: function(target_mc, instance_name, depth) {
			var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
			var cs = 1;
			this.make();
			for (var row = 0; row < this.modules.length; row++) {
				var y = row * cs;
				for (var col = 0; col < this.modules[row].length; col++) {
					var x = col * cs;
					var dark = this.modules[row][col];
					if (dark) {
						qr_mc.beginFill(0, 100);
						qr_mc.moveTo(x, y);
						qr_mc.lineTo(x + cs, y);
						qr_mc.lineTo(x + cs, y + cs);
						qr_mc.lineTo(x, y + cs);
						qr_mc.endFill();
					}
				}
			}
			return qr_mc;
		},
		setupTimingPattern: function() {
			for (var r = 8; r < this.moduleCount - 8; r++) {
				if (this.modules[r][6] != null) {
					continue;
				}
				this.modules[r][6] = (r % 2 == 0);
			}
			for (var c = 8; c < this.moduleCount - 8; c++) {
				if (this.modules[6][c] != null) {
					continue;
				}
				this.modules[6][c] = (c % 2 == 0);
			}
		},
		setupPositionAdjustPattern: function() {
			var pos = QRUtil.getPatternPosition(this.version);
			for (var i = 0; i < pos.length; i++) {
				for (var j = 0; j < pos.length; j++) {
					var row = pos[i];
					var col = pos[j];
					if (this.modules[row][col] != null) {
						continue;
					}
					for (var r = -2; r <= 2; r++) {
						for (var c = -2; c <= 2; c++) {
							if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
								this.modules[row + r][col + c] = true;
							} else {
								this.modules[row + r][col + c] = false;
							}
						}
					}
				}
			}
		},
		setupTypeNumber: function(test) {
			var bits = QRUtil.getBCHTypeNumber(this.version);
			var i;
			var mod;
			for (i = 0; i < 18; i++) {
				mod = (!test && ((bits >> i) & 1) == 1);
				this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
			}
			for (i = 0; i < 18; i++) {
				mod = (!test && ((bits >> i) & 1) == 1);
				this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
			}
		},
		setupTypeInfo: function(test, maskPattern) {
			var data = (this.errorCorrectLevel << 3) | maskPattern;
			var bits = QRUtil.getBCHTypeInfo(data);
			var i;
			var mod;
			for (i = 0; i < 15; i++) {
				mod = (!test && ((bits >> i) & 1) == 1);
				if (i < 6) {
					this.modules[i][8] = mod;
				} else if (i < 8) {
					this.modules[i + 1][8] = mod;
				} else {
					this.modules[this.moduleCount - 15 + i][8] = mod;
				}
			}
			for (i = 0; i < 15; i++) {
				mod = (!test && ((bits >> i) & 1) == 1);
				if (i < 8) {
					this.modules[8][this.moduleCount - i - 1] = mod;
				} else if (i < 9) {
					this.modules[8][15 - i - 1 + 1] = mod;
				} else {
					this.modules[8][15 - i - 1] = mod;
				}
			}
			this.modules[this.moduleCount - 8][8] = (!test);
		},
		mapData: function(data, maskPattern) {
			var inc = -1;
			var row = this.moduleCount - 1;
			var bitIndex = 7;
			var byteIndex = 0;
			for (var col = this.moduleCount - 1; col > 0; col -= 2) {
				if (col == 6) col--;
				while (true) {
					for (var c = 0; c < 2; c++) {
						if (this.modules[row][col - c] == null) {
							var dark = false;
							if (byteIndex < data.length) {
								dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
							}
							var mask = QRMask.getMask(maskPattern, row, col - c);
							if (mask) {
								dark = !dark;
							}
							this.modules[row][col - c] = dark;
							bitIndex--;
							if (bitIndex == -1) {
								byteIndex++;
								bitIndex = 7;
							}
						}
					}
					row += inc;
					if (row < 0 || this.moduleCount <= row) {
						row -= inc;
						inc = -inc;
						break;
					}
				}
			}
		}
	};
	QRCodeModel.PAD0 = 0xEC;
	QRCodeModel.PAD1 = 0x11;
	QRCodeModel.createData = function(version, errorCorrectLevel, dataList) {
		var rsBlocks = QRUtil.getRSBlocks(version, errorCorrectLevel);
		var buffer = new QRBitBuffer();
		for (var i = 0; i < dataList.length; i++) {
			var data = dataList[i];
			buffer.put(data.mode, 4);
			buffer.put(data.getLength(), Util.getLengthInBits(data.mode, version));
			data.write(buffer);
		}
		var totalDataCount = 0;
		for (i = 0; i < rsBlocks.length; i++) {
			totalDataCount += rsBlocks[i].dataCount;
		}
		if (buffer.getLengthInBits() > totalDataCount * 8) {
			throw new Error("code length overflow. (" +
				buffer.getLengthInBits() +
				">" +
				totalDataCount * 8 +
				")");
		}
		if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
			buffer.put(0, 4);
		}
		while (buffer.getLengthInBits() % 8 != 0) {
			buffer.putBit(false);
		}
		while (true) {
			if (buffer.getLengthInBits() >= totalDataCount * 8) {
				break;
			}
			buffer.put(QRCodeModel.PAD0, 8);
			if (buffer.getLengthInBits() >= totalDataCount * 8) {
				break;
			}
			buffer.put(QRCodeModel.PAD1, 8);
		}
		return QRCodeModel.createBytes(buffer, rsBlocks);
	};
	QRCodeModel.createBytes = function(buffer, rsBlocks) {
		var offset = 0;
		var maxDcCount = 0;
		var maxEcCount = 0;
		var dcdata = new Array(rsBlocks.length);
		var ecdata = new Array(rsBlocks.length);
		for (var r = 0; r < rsBlocks.length; r++) {
			var dcCount = rsBlocks[r].dataCount;
			var ecCount = rsBlocks[r].totalCount - dcCount;
			maxDcCount = Math.max(maxDcCount, dcCount);
			maxEcCount = Math.max(maxEcCount, ecCount);
			dcdata[r] = new Array(dcCount);
			for (var i = 0; i < dcdata[r].length; i++) {
				dcdata[r][i] = 0xff & buffer.buffer[i + offset];
			}
			offset += dcCount;
			var rsPoly = QRMath.getPolynomial(ecCount);
			var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
			var modPoly = rawPoly.mod(rsPoly);
			ecdata[r] = new Array(rsPoly.getLength() - 1);
			for (i = 0; i < ecdata[r].length; i++) {
				var modIndex = i + modPoly.getLength() - ecdata[r].length;
				ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
			}
		}
		var totalCodeCount = 0;
		for (i = 0; i < rsBlocks.length; i++) {
			totalCodeCount += rsBlocks[i].totalCount;
		}
		var data = new Array(totalCodeCount);
		var index = 0;
		for (i = 0; i < maxDcCount; i++) {
			for (r = 0; r < rsBlocks.length; r++) {
				if (i < dcdata[r].length) {
					data[index++] = dcdata[r][i];
				}
			}
		}
		for (i = 0; i < maxEcCount; i++) {
			for (r = 0; r < rsBlocks.length; r++) {
				if (i < ecdata[r].length) {
					data[index++] = ecdata[r][i];
				}
			}
		}
		return data;
	};
	var QRMask = {
		getMask: function(maskPattern, i, j) {
			switch (maskPattern) {
				case QRMaskPattern.PATTERN000:
					return (i + j) % 2 == 0;
				case QRMaskPattern.PATTERN001:
					return i % 2 == 0;
				case QRMaskPattern.PATTERN010:
					return j % 3 == 0;
				case QRMaskPattern.PATTERN011:
					return (i + j) % 3 == 0;
				case QRMaskPattern.PATTERN100:
					return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
				case QRMaskPattern.PATTERN101:
					return (i * j) % 2 + (i * j) % 3 == 0;
				case QRMaskPattern.PATTERN110:
					return ((i * j) % 2 + (i * j) % 3) % 2 == 0;
				case QRMaskPattern.PATTERN111:
					return ((i * j) % 3 + (i + j) % 2) % 2 == 0;
				default:
					throw new Error("bad maskPattern:" + maskPattern);
			}
		}
	}

	var QRMath = {
		glog: function(n) {
			if (n < 1) {
				throw new Error("glog(" + n + ")");
			}
			return LOG_TABLE[n];
		},
		gexp: function(n) {
			while (n < 0) {
				n += 255;
			}
			while (n >= 256) {
				n -= 255;
			}
			return EXP_TABLE[n];
		},
		getPolynomial: function(num) {
			if (typeof G_POLYNOMIAL[num] == 'undefined') {
				G_POLYNOMIAL[num] = new QRPolynomial([1], 0);
				for (var i = 0; i < num; i++) {
					G_POLYNOMIAL[num] = G_POLYNOMIAL[num].multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
				}
			}
			return G_POLYNOMIAL[num];
		}
	}

	var EXP_TABLE = new Array(256);
	var LOG_TABLE = new Array(256);
	for (var i = 0; i < 8; i++) {
		EXP_TABLE[i] = 1 << i;
	}
	for (i = 8; i < 256; i++) {
		EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
	}
	for (i = 0; i < 255; i++) {
		LOG_TABLE[EXP_TABLE[i]] = i;
	}
	var G_POLYNOMIAL = [];

	function QRPolynomial(num, shift) {
		if (typeof num.length == 'undefined') {
			throw new Error(num.length + "/" + shift);
		}
		var offset = 0;
		while (offset < num.length && num[offset] == 0) {
			offset++;
		}
		this.num = new Array(num.length - offset + shift);
		for (var i = 0; i < num.length - offset; i++) {
			this.num[i] = num[i + offset];
		}
	}
	QRPolynomial.prototype = {
		get: function(index) {
			return this.num[index];
		},
		getLength: function() {
			return this.num.length;
		},
		multiply: function(e) {
			var num = new Array(this.getLength() + e.getLength() - 1);
			for (var i = 0; i < this.getLength(); i++) {
				for (var j = 0; j < e.getLength(); j++) {
					num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
				}
			}
			return new QRPolynomial(num, 0);
		},
		mod: function(e) {
			if (this.getLength() - e.getLength() < 0) {
				return this;
			}
			var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
			var num = new Array(this.getLength());
			for (var i = 0; i < this.getLength(); i++) {
				num[i] = this.get(i);
			}
			for (i = 0; i < e.getLength(); i++) {
				num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
			}
			return new QRPolynomial(num, 0).mod(e);
		}
	};

	function QRRSBlock(totalCount, dataCount) {
		this.totalCount = totalCount;
		this.dataCount = dataCount;
	}
	QRRSBlock.getRSBlocks = function(version, errorCorrectLevel) {
		var rsBlock = QRUtil.getRSBlocks(version, errorCorrectLevel);
		var length = rsBlock.length / 3;
		var list = [];
		for (var i = 0; i < length; i++) {
			var count = rsBlock[i * 3 + 0];
			var totalCount = rsBlock[i * 3 + 1];
			var dataCount = rsBlock[i * 3 + 2];
			for (var j = 0; j < count; j++) {
				list.push(new QRRSBlock(totalCount, dataCount));
			}
		}
		return list;
	};

	function QRBitBuffer() {
		this.buffer = [];
		this.length = 0;
	}
	QRBitBuffer.prototype = {
		get: function(index) {
			var bufIndex = Math.floor(index / 8);
			return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
		},
		put: function(num, length) {
			for (var i = 0; i < length; i++) {
				this.putBit(((num >>> (length - i - 1)) & 1) == 1);
			}
		},
		getLengthInBits: function() {
			return this.length;
		},
		putBit: function(bit) {
			var bufIndex = Math.floor(this.length / 8);
			if (this.buffer.length <= bufIndex) {
				this.buffer.push(0);
			}
			if (bit) {
				this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
			}
			this.length++;
		}
	};

	function Drawer(options) {
		this.options = options;
		/* 绘制模块 */
		this.drawing = {
			/* background */
			"background": {
				"type": "color",
				"value": this.options.background
			},
			/* foreground */
			"foreground": {
				"type": "color",
				"value": this.options.foreground
			},
			/* backgroundImage */
			"backgroundImage": {
				"type": "image",
				"value": this.options.backgroundImage,
				"alpha": this.options.backgroundImageAlpha,
				"x": this.options.backgroundImageX,
				"y": this.options.backgroundImageY,
				"width": this.options.backgroundImageWidth,
				"height": this.options.backgroundImageHeight,
				"repeat": this.options.backgroundImageRepeat
			},
			/* foregroundImage */
			"foregroundImage": {
				"type": "image",
				"value": this.options.foregroundImage,
				"alpha": this.options.foregroundImageAlpha,
				"x": this.options.foregroundImageX,
				"y": this.options.foregroundImageY,
				"width": this.options.foregroundImageWidth,
				"height": this.options.foregroundImageHeight,
				"padding": this.options.foregroundImagePadding
			},
			/* anmation */
			"anmation": {
				"value": this.options.anmation
			},
		};
	}

	Drawer.prototype = {
		draw: function() {
			var _this = this;

			return new Promise(async function(resolve, reject) {
				try {
					var modules = _this.options.modules;
					var moduleCount = _this.options.moduleCount;
					var size = _this.options.size;

					_this.options.ctx.clearRect(0, 0, _this.options.canvas.width, _this.options.canvas.height);

					var tileWidth = size / moduleCount;
					var tileHeight = size / moduleCount;

					var drawModules = [];

					for (var row = 0; row < moduleCount; row++) {
						for (var col = 0; col < moduleCount; col++) {
							var x = Math.round(col * tileWidth);
							var y = Math.round(row * tileHeight);
							var w = Math.ceil((col + 1) * tileWidth) - x;
							var h = Math.ceil((row + 1) * tileHeight) - y;
							var isBlack = modules[row][col];

							drawModules.push({
								isBlack: isBlack,
								x: x,
								y: y,
								w: w,
								h: h
							});
						}
					}
					
					_this.options.drawModules = drawModules;

					for (var name in _this.drawing) {
						var drawing = _this.drawing[name];
						await _this.drawToCanvas(drawing);
					}

					if (_this.options.isDrawed) {
						_this.options.isDrawed(resolve);
					} else {
						resolve();
					}
				} catch (e) {
					//TODO handle the exception
					reject(e);
				}
			});
		},
		drawToCanvas: function(drawing) {
			var _this = this;

			return new Promise(function(resolve, reject) {
				try {
					var type = drawing.type;
					var value = drawing.value;

					if (!value) {
						return resolve();
					}

					var ctx = _this.options.ctx;

					switch (type) {
						case "color":
							_this.drawColor(ctx, drawing);
							break;
						case "image":
							_this.drawImage(ctx, drawing).then(function() {
								resolve();
							});
							break;
					}
				} catch (e) {
					//TODO handle the exception
					reject(e);
				}
			});
		},
		drawColor: function(ctx, drawing) {
			var _this = this;
			var drawModules = this.options.drawModules;
			var value = drawing.value;

			if (!value) {
				return;
			}
			
			ctx.save();
			ctx.fillStyle = value;
			for (var i = 0; i < drawModules.length; i++) {
				var drawModule = drawModules[i];
				if (!drawModule.isBlack) {
					continue;
				}
				ctx.fillRect(drawModule.x, drawModule.y, drawModule.w, drawModule.h);
			}
			ctx.restore();
		},
		drawImage: function(ctx, drawing) {
			var _this = this;
			return new Promise(function(resolve, reject) {
				try {
					var value = drawing.value;
					var x = drawing.x;
					var y = drawing.y;
					var width = drawing.width;
					var height = drawing.height;
					var padding = drawing.padding;
					var alpha = drawing.alpha;
					var repeat = drawing.repeat;
					var size = _this.options.size;

					var img = new Image();
					img.src = value;
					img.onload = function() {
						ctx.save();

						if (padding) {
							var p = width / size * padding;
							var w = width - p * 2;
							var h = height - p * 2;
							var px = x + p;
							var py = y + p;

							ctx.fillStyle = "rgba(255,255,255,1)";
							ctx.fillRect(x, y, width, height);
							ctx.drawImage(img, px, py, w, h);
						} else {
							ctx.globalAlpha = alpha;
							ctx.drawImage(img, x, y, width, height);
						}

						ctx.restore();

						resolve();
					}
				} catch (e) {
					//TODO handle the exception
					reject(e);
				}
			});
		}
	}

	var defaultOptions = {
		// qrcode-core
		version: undefined, // 版本号，不传会根据data自动判断
		errorCorrectLevel: QRErrorCorrectLevel.L, // 容错率，L/M/Q/H
		// dear-qrcode
		size: 200, // 二维码大小
		data: '', // 二维码内容
		// canvas
		canvasId: '', // canvas-id
		canvas: undefined, // canvas实例
		ctx: undefined, // canvas上下文
		// drawer
		background: "rgba(255,255,255,1)", // 背景色
		foreground: "rgba(0,0,0,1)", // 前景色
		backgroundImage: undefined, // 背景图
		backgroundImageAlpha: 1, // 背景图透明度
		backgroundImageX: undefined, // 背景图x
		backgroundImageY: undefined, // 背景图y
		backgroundImageWidth: undefined, // 背景图宽
		backgroundImageHeight: undefined, // 背景图高
		backgroundImageRepeat: 'no-repeat', // 背景图重复
		foregroundImage: undefined, // 前景图
		foregroundImageAlpha: 1, // 前景图透明度
		foregroundImageX: undefined, // 前景图x
		foregroundImageY: undefined, // 前景图y
		foregroundImageWidth: undefined, // 前景图宽
		foregroundImageHeight: undefined, // 前景图高
		foregroundImagePadding: 6, // 前景图内边距
		// anmation
		anmation: false // 动画效果
	};

	function UQRCode(options, plugins) {
		options = extend(defaultOptions, options);

		if (plugins) {
			this.plugins = plugins.map(function(plugin) {
				return new plugin.constructor(extend(plugin.options, options));
			});
		}
	}

	UQRCode.prototype = {
		// 同步绘制
		draw: function() {
			var _this = this;

			return new Promise(function(resolve, reject) {
				_this.make();

				var drawer = new Drawer(_this);
				drawer.draw().then(function() {
					_this.plugins.forEach(function(plugin) {
						if (typeof plugin.hooks.drawed === 'function') {
							plugin.hooks.drawed.call(plugin);
						}
					});
					resolve();
				}).catch(function(err) {
					reject(err);
				});
			});
		},
		// 异步绘制
		make: function(callback) {
			var _this = this;

			if (!this.data) {
				throw new Error('`data` required');
			}

			if (this.data.length > 7089) {
				throw new Error('data too long');
			}

			if (this.version === undefined) {
				this.version = Util.checkVersion(this.data, this.errorCorrectLevel);
			}

			var qrcode = new QRCodeModel(this.version, this.errorCorrectLevel);
			qrcode.addData(this.data);
			qrcode.make();

			this.modules = qrcode.modules;
			this.moduleCount = qrcode.moduleCount;

			var plugins = this.plugins;
			if (plugins) {
				plugins.forEach(function(plugin) {
					if (typeof plugin.hooks.made === 'function') {
						plugin.hooks.made.call(plugin);
					}
				});
			}

			if (typeof callback === 'function') {
				callback();
			}
		},
		// canvasToTempFilePath
		canvasToTempFilePath: function(options) {
			var _this = this;

			return new Promise(function(resolve, reject) {
				try {
					var canvas = _this.canvas;
					var fileType = options.fileType || 'png';
					var quality = options.quality || 1;

					if (_this.canvasId) {
						var ctx = uni.createCanvasContext(_this.canvasId, _this.component);
						ctx.draw(true, function() {
							uni.canvasToTempFilePath({
								canvasId: _this.canvasId,
								fileType: fileType,
								quality: quality,
								success: function(res) {
									resolve(res.tempFilePath);
								},
								fail: function(err) {
									reject(err);
								}
							}, _this.component);
						});
					} else {
						if (canvas.toDataURL) {
							resolve(canvas.toDataURL("image/" + fileType, quality));
						} else {
							reject(new Error('canvas no toDataURL'));
						}
					}
				} catch (e) {
					//TODO handle the exception
					reject(e);
				}
			});
		},
		getModules: function() {
			return this.modules;
		}
	};

	for (var name in defaultOptions) {
		Object.defineProperty(UQRCode.prototype, name, {
			get: function() {
				return this.options[name];
			},

			set: function(value) {
				this.options[name] = value;
			}
		});
	}

	UQRCode.Plugin = Plugin;

	return UQRCode;

})));