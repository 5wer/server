/*
 Navicat MySQL Data Transfer

 Source Server         : 5wer
 Source Server Type    : MySQL
 Source Server Version : 50722
 Source Host           : localhost:3306
 Source Schema         : 5wer

 Target Server Type    : MySQL
 Target Server Version : 50722
 File Encoding         : 65001

 Date: 25/10/2018 13:38:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for books
-- ----------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books`  (
  `id` int(8) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT '文集id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '名称',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '文集状态1正常 0删除',
  `authorId` int(8) UNSIGNED ZEROFILL NOT NULL COMMENT '作者id',
  `createTime` datetime(0) NULL DEFAULT NULL,
  `removeTime` datetime(0) NULL DEFAULT NULL,
  `lastModifyTime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of books
-- ----------------------------
INSERT INTO `books` VALUES (00000039, 'wokao爽肤234', 1, 00000008, '2018-10-24 03:41:27', NULL, '2018-10-24 05:34:19');
INSERT INTO `books` VALUES (00000040, 'hello', 1, 00000008, '2018-10-25 01:31:55', NULL, '2018-10-25 01:31:55');

-- ----------------------------
-- Table structure for posts
-- ----------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts`  (
  `id` int(8) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `authorId` int(8) UNSIGNED ZEROFILL NOT NULL COMMENT '关联作者用户id',
  `bookId` int(8) NULL DEFAULT NULL COMMENT '所属文集id',
  `mainImage` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '主题url',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `summary` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '摘要',
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '正文,html',
  `color` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '色调类型',
  `type` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文章类型',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签列表',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '发布时间',
  `lastModifyTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `removeTime` datetime(0) NULL DEFAULT NULL COMMENT '删除时间',
  `status` int(1) NULL DEFAULT 1 COMMENT '1正常 0删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of posts
-- ----------------------------
INSERT INTO `posts` VALUES (00000001, 00000008, NULL, NULL, 'hello world', NULL, '<div>海螺我的</div>', 'YELLOW', 'ARTICLE', '人物,景物,女,小孩', '2018-10-25 03:34:10', '2018-10-25 05:38:02', NULL, 1);
INSERT INTO `posts` VALUES (00000003, 00000008, NULL, NULL, 'hello world', NULL, '<div>hhhhhhhhh</div>', 'YELLOW', 'ARTICLE', '人物,景物,女,小孩', '2018-10-25 03:41:14', '2018-10-25 05:36:43', NULL, 1);
INSERT INTO `posts` VALUES (00000004, 00000008, NULL, NULL, 'hello world', NULL, '<div>hhhhhhhhh</div>', 'YELLOW', 'ARTICLE', '人物,景物,女,小孩', '2018-10-25 05:36:53', '2018-10-25 05:36:53', NULL, 1);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(8) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mobile` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `birthday` date NULL DEFAULT NULL,
  `point` int(8) NULL DEFAULT NULL,
  `level` int(4) NULL DEFAULT NULL,
  `roles` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createTime` datetime(0) NULL DEFAULT NULL,
  `lastModifyTime` datetime(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  `status` int(1) NULL DEFAULT NULL,
  `salt` varchar(6) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `openid` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (00000008, NULL, 'zxk', 'ad3d0a2bf591f7ffdeeb233ac3871e08', NULL, NULL, NULL, NULL, NULL, '2018-10-11 07:49:12', '2018-10-11 07:49:12', NULL, '353266', 'undefined', NULL);
INSERT INTO `users` VALUES (00000009, NULL, 'liuxiao', '05d51b6c2171207702284344fe6cca6b', NULL, NULL, NULL, NULL, NULL, '2018-10-11 07:52:05', '2018-10-11 07:52:05', NULL, '946118', 'undefined', NULL);
INSERT INTO `users` VALUES (00000010, NULL, 'zhaoxinke', 'f6892f83a6e3c2adeb56938f12601151', NULL, NULL, NULL, NULL, NULL, '2018-10-11 08:23:14', '2018-10-11 08:23:14', NULL, '856597', 'undefined', NULL);
INSERT INTO `users` VALUES (00000011, NULL, 'zhaozehao', '418a4c4ea7b409025a8692c350ebbc71', NULL, NULL, NULL, NULL, NULL, '2018-10-11 08:23:43', '2018-10-11 08:23:43', NULL, '160672', 'undefined', NULL);
INSERT INTO `users` VALUES (00000012, NULL, 'sofia', '702c0222e2f119104d1796b99a81c293', NULL, NULL, NULL, NULL, NULL, '2018-10-11 09:54:44', '2018-10-11 09:54:44', NULL, '345893', 'undefined', NULL);

SET FOREIGN_KEY_CHECKS = 1;
