/**
 * 引入MySQL的SQL工具模块
 */
const sql = require('../mysql/sql');
/**
 * 引入bcryptjs模块，用于密码加密
 */
const bcrypt = require('bcryptjs');
/**
 * 引入jsonwebtoken模块，用于生成和验证JSON Web Token
 */
const jwt = require('jsonwebtoken');
/**
 * 引入fs模块，用于文件操作
 */
const fs = require('fs');
/**
 * 引入path模块，用于处理文件路径
 */
const path = require('path');
/**
 * 引入mime-types模块，用于获取文件的MIME类型
 */
const mime = require('mime-types');

/**
 * 创建当前时间的字符串表示，用于记录创建时间
 */
const createTime = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

/**
 * 解码Base64编码的图像数据
 * @param {string} dataString Base64编码的图像数据
 * @returns {Object|Error} 解码后的图像数据对象，如果输入字符串无效，则返回错误
 */
function decodeBase64Image (dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

/**
 * 用户操作处理对象
 */
const handle = {

    /**
     * 注册新用户
     * @param {object} req 请求对象，包含注册信息
     * @param {object} res 响应对象
     */
    register: (req, res) => {
        const registerInfo = req.body;
        const { username, password, email } = registerInfo;

        /**
         * 用户名正则表达式，检查用户名格式
         */
        const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{4,}$/;
        /**
         * 密码正则表达式，检查密码格式
         */
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,12}$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).send('用户名至少需要4个字符，且必须包含字母和数字的组合');
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send('密码长度必须在5-12个字符之间，且必须包含字母和数字的组合');
        }

        sql.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
            if (err) {
                return res.status(500).send('注册用户时发生错误');
            }

            if (result.length > 0) {
                return res.status(400).send('用户名已存在');
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).send('注册用户时发生错误');
                }

                sql.query('INSERT INTO users (username, password, createTime) VALUES (?, ?, ?)', [username, hashedPassword, createTime], (err, result) => {
                    if (err) {
                        return res.status(500).send('注册用户时发生错误');
                    }

                    res.send({ code: 200, msg: '注册成功' });
                });
            });
        });
    },
    /**
     * 用户登录
     * @param {object} req 请求对象，包含登录信息
     * @param {object} res 响应对象
     */
    login: (req, res) => {
        const { username, password } = req.body;

        sql.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
            if (err) {
                return res.status(500).send('登录时发生错误');
            }

            if (result.length === 0) {
                return res.status(400).send('没有此用户');
            }

            const user = result[0];

            bcrypt.compare(password, user.password, (err, isValid) => {
                if (err) {
                    return res.status(500).send('登录时发生错误');
                }

                if (!isValid) {
                    return res.status(400).send('用户名或密码错误');
                }
                delete user.password;

                const token = jwt.sign({ id: user.id }, 'rihuowagu', { expiresIn: '1h' });

                res.status(200).send({ user, token });
            });
        });
    },
    /**
     * 检查令牌并更新令牌
     * @param {object} req 请求对象，包含令牌信息
     * @param {object} res 响应对象
     */
    checkToken: (req, res) => {
        const token = req.headers['authorization'].replace('Bearer ', '');

        if (!token) {
            return res.status(401).send('拒绝访问');
        }

        let isTokenValid = false;

        try {
            const verified = jwt.verify(token, 'rihuowagu');
            sql.query('SELECT * FROM users WHERE id = ?', [verified.id], (err, result) => {
                if (err) {
                    return res.status(500).send('检查令牌时发生错误');
                }

                if (result.length === 0) {
                    return res.status(400).send('没有此用户');
                }

                const user = result[0];
                delete user.password;

                const newToken = jwt.sign({ id: user.id }, 'rihuowagu', { expiresIn: '1h' });

                isTokenValid = true;

                res.status(200).send({ user, token: newToken, isValid });
            });
        } catch (err) {
            return res.status(401).send('令牌已过期');
        }
    },
    /**
  * 上传截图
  * @param {object} req - 请求对象，包含上传的截图信息
  * @param {object} res - 响应对象，用于返回处理结果
  */
    uploadShot: (req, res) => {
        // 从请求中获取上传的截图信息
        const info = req.body;
        let base64 = info.base64;
        // 定义截图存储路径
        const filePath = path.join(__dirname, '../../images/shot');

        // 获取当前时间戳作为文件名的一部分
        const timestamp = new Date().getTime();

        // 解码Base64格式的图片数据
        let decodedImg = decodeBase64Image(base64);
        let imageBuffer = decodedImg.data;
        let type = decodedImg.type;
        // 根据图片类型获取对应的文件扩展名
        let extension = mime.extension(type);
        // 构建唯一的文件名
        let fileName = timestamp + '.' + extension;

        // 完整的文件路径
        const fullFilePath = path.join(filePath, fileName);

        // 将解码后的图片数据写入文件系统
        fs.writeFile(fullFilePath, imageBuffer, 'utf8', (err) => {
            if (err) {
                console.log(err)
                return res.status(500).send('上传时发生错误');
            }

            // 构建图片的URL
            const src = 'https://www.wagu.vip:3637/images/shot/' + fileName;
            // 更新用户信息，将截图URL保存到数据库
            sql.query('update users set shot = ? where id = ?', [src, info.id], (err, result) => {
                if (err) {
                    return res.status(500).send('上传时发生错误');
                }

                res.status(200).send({ code: 200, msg: '上传成功', fileName });
            })
        });
    },

    /**
     * 获取用户信息
     * @param {object} req - 请求对象，包含用户ID
     * @param {object} res - 响应对象，用于返回用户信息
     */
    getUserInfo: (req, res) => {
        // 从请求中获取用户ID
        const id = req.query.id;
        // 从数据库查询用户信息
        sql.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
            if (err) {
                return res.status(500).send('获取用户信息时发生错误');
            }

            if (result.length === 0) {
                return res.status(500).send('没有此用户');
            }

            // 删除用户密码信息
            const user = result[0];
            delete user.password;

            res.status(200).send(user);
        });
    },

    /**
     * 修改用户信息
     * @param {object} req - 请求对象，包含要修改的用户信息
     * @param {object} res - 响应对象，用于返回修改结果
     */
    changeUserInfo: async (req, res) => {
        const info = req.body;
        let userInfo = {};

        // 如果提供了用户名
        if (info.username) {
            // 验证用户名格式
            const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{4,}$/;
            if (!usernameRegex.test(info.username)) {
                return res.status(400).send('用户名至少需要4个字符，且必须包含字母和数字的组合');
            }

            // 检查用户名是否已存在
            const checkUsernameExists = () => {
                return new Promise((resolve, reject) => {
                    sql.query('SELECT * FROM users WHERE username = ?', [info.username], (err, result) => {
                        if (err) {
                            reject(new Error('查询用户时发生错误'));
                        } else {
                            resolve(result);
                        }
                    });
                });
            };

            const result = await checkUsernameExists();
            if (result.length > 0) {
                return res.status(400).send('用户名已存在');
            }

            userInfo.username = info.username;
        }

        // 如果提供了密码
        if (info.password) {
            // 验证密码格式
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,12}$/;
            if (!passwordRegex.test(info.password)) {
                return res.status(400).send('密码长度必须在5-12个字符之间，且必须包含字母和数字的组合');
            }

            // 对密码进行加密
            const hashPassword = async (password) => {
                return new Promise((resolve, reject) => {
                    bcrypt.hash(password, 10, (err, hashedPassword) => {
                        if (err) {
                            reject(new Error('注册用户时发生错误'));
                        } else {
                            resolve(hashedPassword);
                        }
                    });
                });
            };

            userInfo.password = await hashPassword(info.password);
        }

        // 如果提供了电话号码
        if (info.phone) {
            // 验证电话号码格式
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(info.phone)) {
                return res.status(400).send('电话号码格式不正确');
            }

            userInfo.phone = info.phone;
        }

        // 如果提供了地址信息
        if (info.address) {
            userInfo.address = info.address;
        }

        // 更新用户信息
        for (let key in userInfo) {
            sql.query(`UPDATE users SET ${key} = ? WHERE id = ?`, [userInfo[key], info.id], (err, result) => {
                if (err) {
                    return
                }

            });

        }
        res.status(200).send('用户信息修改成功');
    },

    /**
     * 修改背景图片
     * @param {object} req - 请求对象，包含上传的背景图片信息
     * @param {object} res - 响应对象，用于返回修改结果
     */
    changeUseBj: (req, res) => {
        // 获取上传文件的临时路径
        const filePath = req.file.path;
        // 读取文件内容
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error reading file');
            } else {
                // 从文件名中获取原始扩展名
                const fileExtension = req.file.originalname.split('.').pop();
                // 构建新的文件名
                const fileName = Date.now() + '.' + fileExtension;
                // 新文件的保存路径
                const fullFilePath = path.join(__dirname, '../../images/bg', fileName);

                // 写入文件
                fs.writeFile(fullFilePath, data, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error writing file');
                    } else {
                        // 构建图片的URL
                        const src = 'https://www.wagu.vip:3637/images/bg/' + fileName;
                        // 更新用户信息，将背景图片URL保存到数据库
                        sql.query('UPDATE users SET bg = ? WHERE id = ?', [src, req.body.id], (err, result) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send('更新失败');
                            } else {
                                res.status(200).send('更新成功');
                            }
                        })
                    }
                });
            }
        });
    },

    /**
     * 修改地址信息
     * @param {object} req - 请求对象，包含用户地址信息
     * @param {object} res - 响应对象，用于返回修改结果
     */
    uploadAddress: (req, res) => {
        const info = req.body;
        const id = info.userId
        for (let key in info) {
            sql.query(`UPDATE users SET ${key} = ? WHERE id = ?`, [info[key], id], (err, result) => {
                if (err) {
                    return
                }
            });
        }
        res.status(200).send('地址修改成功');
    },

    /**
     * 关注用户
     * @param {object} req - 请求对象，包含关注者和被关注者的ID
     * @param {object} res - 响应对象，用于返回关注结果
     */
    concern: (req, res) => {
        const { concernId, userId } = req.query
        sql.query('SELECT * FROM concern WHERE userId = ? AND concernId = ?', [userId, concernId], (err, result) => {
            if (err) {
                return res.status(500).send('查询时发生错误');
            }
            if (result.length > 0) {
                return res.status(400).send('您已关注该用户')
            }
            sql.query('INSERT INTO concern (userId,concernId) VALUES (?,?)', [userId, concernId], (err, result) => {
                if (err) {
                    return res.status(500).send('关注时发生错误');
                }
                res.status(200).send('关注成功');
            });
        })
    },

    /**
     * 检查是否关注
     * @param {object} req - 请求对象，包含关注者和被关注者的ID
     * @param {object} res - 响应对象，用于返回检查结果
     */
    getIsConcern: (req, res) => {
        const { concernId, userId } = req.query
        sql.query('SELECT * FROM concern WHERE userId = ? AND concernId = ?', [userId, concernId], (err, result) => {
            if (err) {
                return res.status(500).send('查询时发生错误');
            }
            if (result.length > 0) {
                return res.status(200).send(true)
            }
            res.status(400).send(false);
        })
    },

    /**
     * 获取关注者数量
     * @param {object} req - 请求对象，包含被关注者的ID
     * @param {object} res - 响应对象，用于返回关注者数量
     */
    getFollowersNum: (req, res) => {
        const { userId } = req.query
        sql.query('SELECT * FROM concern WHERE concernId = ?', [userId], (err, result) => {
            if (err) {
                return res.status(500).send('查询时发生错误');
            }
            res.status(200).send(result.length.toString());
        })
    },
    /**
  * 获取关注者信息
  * 通过查询关心表（concern），找出关注某用户的所有用户信息
  * @param {Object} req - 请求对象，包含查询参数
  * @param {Object} res - 响应对象，用于返回查询结果
  */
    getFollowersInfo: (req, res) => {
        // 从请求中提取userId
        const { userId } = req.query
        // 查询关心表中关心某用户的用户信息
        sql.query('SELECT * FROM concern WHERE concernId = ?', [userId], (err, result) => {
            if (err) {
                // 如果查询出错，返回错误信息
                return res.status(500).send('查询时发生错误');
            }
            let followers = []
            // 遍历查询结果，进一步查询每个用户的详细信息
            result.forEach(async item => {
                await sql.query('SELECT * FROM users WHERE id = ?', [item.userId], (err, result) => {
                    if (err) {
                        // 如果查询出错，返回错误信息
                        return res.status(500).send('查询时发生错误');
                    }
                    // 将用户详细信息添加到关注者列表
                    followers.push(result[0])
                })
            });
            // 等待所有查询完成后，返回关注者列表
            setTimeout(() => {
                res.status(200).send(followers);
            }, 1000)
        })
    },
    /**
     * 取消关注
     * 根据userId和concernId取消某用户的关注关系
     * @param {Object} req - 请求对象，包含取消关注的参数
     * @param {Object} res - 响应对象，用于返回操作结果
     */
    cancelConcern: (req, res) => {
        // 从请求中提取userId和concernId
        const { concernId, userId } = req.query
        // 删除关心表中对应的关注关系
        sql.query('DELETE FROM concern WHERE userId = ? AND concernId = ?', [userId, concernId], (err, result) => {
            if (err) {
                // 如果操作出错，返回错误信息
                return res.status(500).send('取消关注时发生错误');
            }
            // 操作成功，返回成功信息
            res.status(200).send('取消关注成功');
        })
    },


}

module.exports = handle;
