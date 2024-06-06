/*
 Navicat Premium Data Transfer

 Source Server         : campus
 Source Server Type    : MySQL
 Source Server Version : 50740
 Source Host           : 47.108.171.224:3306
 Source Schema         : campus

 Target Server Type    : MySQL
 Target Server Version : 50740
 File Encoding         : 65001

 Date: 03/06/2024 18:14:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for collections
-- ----------------------------
DROP TABLE IF EXISTS `collections`;
CREATE TABLE `collections`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commdoityId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of collections
-- ----------------------------
INSERT INTO `collections` VALUES (4, 6, 1);
INSERT INTO `collections` VALUES (5, 24, 1);
INSERT INTO `collections` VALUES (6, 21, 1);
INSERT INTO `collections` VALUES (7, 17, 1);
INSERT INTO `collections` VALUES (8, 30, 1);
INSERT INTO `collections` VALUES (10, 18, 3);
INSERT INTO `collections` VALUES (11, 24, 3);

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `commodityId` int(11) NOT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nike` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (11, 1, 17, '这沙发不错', '6', '2024/06/01 20:14');
INSERT INTO `comments` VALUES (12, 2, 17, '还可以', '2', '2024/06/01 21:25');
INSERT INTO `comments` VALUES (13, 3, 17, '你好', '0', '2024/06/01 22:12');
INSERT INTO `comments` VALUES (14, 3, 20, '撒打算', '0', '2024/06/01 22:12');
INSERT INTO `comments` VALUES (15, 3, 20, '阿萨德', '0', '2024/06/01 22:12');
INSERT INTO `comments` VALUES (16, 3, 22, '1', '0', '2024/06/01 22:12');
INSERT INTO `comments` VALUES (17, 3, 31, '1', '0', '2024/06/01 22:12');
INSERT INTO `comments` VALUES (18, 3, 17, '111', '0', '2024/06/01 22:12');
INSERT INTO `comments` VALUES (19, 3, 18, '1231231 ', '0', '2024/06/01 22:12');
INSERT INTO `comments` VALUES (20, 3, 20, '萨达', '0', '2024/06/01 22:12');
INSERT INTO `comments` VALUES (21, 3, 24, '好不好嘛', '0', '2024/06/01 22:12');
INSERT INTO `comments` VALUES (22, 1, 17, '还好\n', '0', '2024/06/02 22:58');
INSERT INTO `comments` VALUES (23, 1, 21, '你好', '0', '2024/06/02 22:58');
INSERT INTO `comments` VALUES (24, 2, 34, '挺好看的衣服', '1', '2024/06/03 01:21');

-- ----------------------------
-- Table structure for commoditys
-- ----------------------------
DROP TABLE IF EXISTS `commoditys`;
CREATE TABLE `commoditys`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `price` int(255) NOT NULL,
  `src` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'https://img1.mydrivers.com/img/20220725/d0638c289ab5483e9383ab1af1ea8821.jpg',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `state` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of commoditys
-- ----------------------------
INSERT INTO `commoditys` VALUES (6, 1, '苹果13', 3899, 'https://www.wagu.vip:3637/images/commodity/1717038061974.jpg', '2', '电池百分之90，九成新', 1);
INSERT INTO `commoditys` VALUES (8, 1, '沙发 & 座椅', 199, 'https://www.wagu.vip:3637/images/commodity/1717042103198.png', '1', '买任何沙发都要试坐，坐的时候，要把握的是松软适宜，太松软的一定要警惕。过于松软的沙发，未必是质量有问题，但是“陷落感”使人容易成为“沙发土豆”。1233333333333333333333333333333333333333333333333333333333333333', 0);
INSERT INTO `commoditys` VALUES (17, 1, '沙发', 1998, 'https://www.wagu.vip:3637/images/commodity/1717060465479.png', '1', '沙发', 1);
INSERT INTO `commoditys` VALUES (18, 1, '书柜', 578, 'https://www.wagu.vip:3637/images/commodity/1717060551953.png', '1', '书柜', 1);
INSERT INTO `commoditys` VALUES (19, 1, '床', 1890, 'https://www.wagu.vip:3637/images/commodity/1717060608120.png', '1', '床', 1);
INSERT INTO `commoditys` VALUES (20, 1, '花', 98, 'https://www.wagu.vip:3637/images/commodity/1717060642472.png', '1', '花', 0);
INSERT INTO `commoditys` VALUES (21, 1, '床头柜', 397, 'https://www.wagu.vip:3637/images/commodity/1717060680474.png', '1', '床头柜', 1);
INSERT INTO `commoditys` VALUES (22, 1, '音响', 187, 'https://www.wagu.vip:3637/images/commodity/1717060741855.png', '2', '音响', 1);
INSERT INTO `commoditys` VALUES (23, 1, '空调', 388, 'https://www.wagu.vip:3637/images/commodity/1717060857048.png', '2', '空调', 1);
INSERT INTO `commoditys` VALUES (24, 1, '无人机', 3456, 'https://www.wagu.vip:3637/images/commodity/1717060892506.png', '2', '无人机', 1);
INSERT INTO `commoditys` VALUES (25, 1, '森马寸衫', 99, 'https://www.wagu.vip:3637/images/commodity/1717062143504.png', '3', '未穿过森马寸衫,原价199', 1);
INSERT INTO `commoditys` VALUES (26, 1, '商务礼袍', 496, 'https://www.wagu.vip:3637/images/commodity/1717062219887.jpg', '3', '商务礼袍，只穿过一次出席活动 已送过干洗', 1);
INSERT INTO `commoditys` VALUES (27, 1, '干练小短裤', 89, 'https://www.wagu.vip:3637/images/commodity/1717062326367.png', '3', '之前买的 长胖了 一直放在衣柜', 1);
INSERT INTO `commoditys` VALUES (28, 1, '风云', 986, 'https://www.wagu.vip:3637/images/commodity/1717062376904.jpg', '3', '大品牌风衣 质地很好 之前买的1598', 1);
INSERT INTO `commoditys` VALUES (29, 1, '羽绒服', 348, 'https://www.wagu.vip:3637/images/commodity/1717062428514.jpg', '3', '没啥好说的 没穿过', 1);
INSERT INTO `commoditys` VALUES (30, 1, '篮球', 38, 'https://www.wagu.vip:3637/images/commodity/1717062951566.png', '4', '全新篮球', 0);
INSERT INTO `commoditys` VALUES (31, 1, '自行车', 389, 'https://www.wagu.vip:3637/images/commodity/1717062970508.png', '4', '自行车', 1);
INSERT INTO `commoditys` VALUES (32, 1, '电动车', 988, 'https://www.wagu.vip:3637/images/commodity/1717062986649.jpg', '4', '电动车', 1);
INSERT INTO `commoditys` VALUES (34, 2, 'ts', 182, 'https://www.wagu.vip:3637/images/commodity/1717352121251.png', '3', 'ts衣服', 1);

-- ----------------------------
-- Table structure for concern
-- ----------------------------
DROP TABLE IF EXISTS `concern`;
CREATE TABLE `concern`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `concernId` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of concern
-- ----------------------------
INSERT INTO `concern` VALUES (1, 2, 1);

-- ----------------------------
-- Table structure for loves
-- ----------------------------
DROP TABLE IF EXISTS `loves`;
CREATE TABLE `loves`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of loves
-- ----------------------------
INSERT INTO `loves` VALUES (3, 11, 2);
INSERT INTO `loves` VALUES (4, 12, 2);
INSERT INTO `loves` VALUES (5, 12, 1);
INSERT INTO `loves` VALUES (6, 24, 2);

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commodityId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `state` tinyint(4) NOT NULL DEFAULT 0,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `comments` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `commentsState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 47 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (42, 20, 1, '2024/06/03 01:16', 1, '成都市', 'undefined', '2');
INSERT INTO `orders` VALUES (44, 8, 1, '2024/06/03 03:06', 1, '成都市', 'undefined', '1');
INSERT INTO `orders` VALUES (46, 30, 1, '2024/06/03 03:06', 1, '成都市', 'undefined', '3');

-- ----------------------------
-- Table structure for replys
-- ----------------------------
DROP TABLE IF EXISTS `replys`;
CREATE TABLE `replys`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commodityId` int(11) NOT NULL,
  `collectionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of replys
-- ----------------------------
INSERT INTO `replys` VALUES (2, 17, 11, 2, '还行吧', '2024/06/01 20:14');
INSERT INTO `replys` VALUES (4, 17, 12, 1, '真的还可以', '2024/06/01 21:25');
INSERT INTO `replys` VALUES (5, 17, 12, 3, '不是吧', '2024/06/01 22:12');
INSERT INTO `replys` VALUES (6, 17, 11, 3, '真的吗', '2024/06/01 22:12');
INSERT INTO `replys` VALUES (7, 34, 24, 2, '穿了三天真的还行', '2024/06/03 01:21');

-- ----------------------------
-- Table structure for types
-- ----------------------------
DROP TABLE IF EXISTS `types`;
CREATE TABLE `types`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of types
-- ----------------------------
INSERT INTO `types` VALUES (1, '家具与户外用品', '1');
INSERT INTO `types` VALUES (2, '电子产品', '2');
INSERT INTO `types` VALUES (3, '服饰服装', '3');
INSERT INTO `types` VALUES (4, '其它', '4');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `shot` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'https://gd-hbimg.huaban.com/e7b770bf874c9ae0a90976608d0ea889b889d4017ed22-0hmCwW_fw236',
  `bg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'https://img.js.design/assets/publishHomeBannerImg/default3.png',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `addressName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2a$10$FM3/g53GsF1zH9Smwq7frud04owwovSz9RBgfkO2Xa4fuVOd407x6', '2024/05/28 18:34', 'https://www.wagu.vip:3637/images/shot/1717017790382.png', 'https://www.wagu.vip:3637/images/bg/1717018834646.jpg', '15183407630', '成都市', '瓦a');
INSERT INTO `users` VALUES (2, 'wagu', '$2a$10$VbV0hQrrtP4RhuO/9/cstebmugskiAWrM155rpjEuZwpRXWKaqYLi', '2024/05/28 18:54', 'https://gd-hbimg.huaban.com/e7b770bf874c9ae0a90976608d0ea889b889d4017ed22-0hmCwW_fw236', 'https://img.js.design/assets/publishHomeBannerImg/default3.png', '0', NULL, NULL);
INSERT INTO `users` VALUES (3, 'yang', '$2a$10$uPtRANiS9jGSCa46bLWxceHms3QYoZiAUvJhaFXPTIN38PixkN29O', '2024/06/01 22:10', 'https://gd-hbimg.huaban.com/e7b770bf874c9ae0a90976608d0ea889b889d4017ed22-0hmCwW_fw236', 'https://img.js.design/assets/publishHomeBannerImg/default3.png', '13256057652', '2313', '你好');
INSERT INTO `users` VALUES (4, 'user', '$2a$10$.yalYWml9p3CF1ynEGuKpu2LvUHthpEkxLGPfiPZhlnAeEtMYuHD6', '2024/06/03 03:06', 'https://gd-hbimg.huaban.com/e7b770bf874c9ae0a90976608d0ea889b889d4017ed22-0hmCwW_fw236', 'https://img.js.design/assets/publishHomeBannerImg/default3.png', NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
