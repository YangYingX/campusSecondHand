/**
 * 引入SQL工具模块
 */
const sql = require('../mysql/sql');
/**
 * 引入文件系统模块
 */
const fs = require('fs');
/**
 * 引入路径处理模块
 */
const path = require('path');

/**
 * 创建当前时间的字符串表示，格式为yyyy-MM-dd hh:mm
 */
const createTime = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

/**
 * 处理商品操作的函数对象
 */
const handle = {
    /**
     * 添加商品
     * @param {Object} req 请求对象，包含文件和表单数据
     * @param {Object} res 响应对象，用于发送响应
     */
    addCommodity: (req, res) => {
        const file = req.file
        const info = req.body
        if (file && info) {
            const filePath = req.file.path;
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    // 文件读取错误时，发送错误响应
                    res.send({
                        code: 400,
                        msg: '文件读取失败'
                    })
                    return
                } else {
                    const fileExtension = req.file.originalname.split('.').pop();
                    const fileName = Date.now() + '.' + fileExtension;
                    const fullFilePath = path.join(__dirname, '../../images/commodity', fileName);
                    fs.writeFile(fullFilePath, data, (err) => {
                        if (err) {
                            console.error(err);
                            // 文件写入错误时，发送错误响应
                            res.status(500).send('Error writing file');
                        } else {
                            const src = 'https://www.wagu.vip:3637/images/commodity/' + fileName;
                            info.src = src
                            sql.query('insert into commoditys set ?', info, (err, result) => {
                                if (err) {
                                    // 数据库插入错误时，发送错误响应
                                    res.send({
                                        code: 400,
                                        msg: '上传失败'
                                    })
                                    return
                                } else {
                                    // 插入成功时，发送成功响应
                                    res.send({
                                        code: 200,
                                        msg: '上传成功'
                                    })
                                }
                            })
                        }
                    });
                }
            })
        } else {
            // 参数缺失时，发送错误响应
            res.send({
                code: 400,
                msg: '参数错误'
            })
            return
        }

    },
    /**
     * 获取用户商品列表
     * @param {Object} req 请求对象，包含查询参数
     * @param {Object} res 响应对象，用于发送响应
     */
    getUserCommoditys: (req, res) => {
        sql.query('select * from commoditys where userId = ?', [req.query.id], (err, result) => {
            if (err) {
                // 数据库查询错误时，发送错误响应
                res.status(500).send('服务器错误');
            } else {
                // 查询成功时，发送查询结果
                res.status(200).send(result);
            }
        })
    },

    /**
  * 删除商品接口
  * 使用SQL查询语句删除指定ID的商品
  * @param {object} req - 请求对象，包含要删除的商品ID
  * @param {object} res - 响应对象，用于返回删除结果
  */
    deleteCommodity: (req, res) => {
        sql.query('delete from commoditys where id = ?', [req.query.id], (err, result) => {
            if (err) {
                res.status(500).send('服务器错误');
            } else {
                res.status(200).send('删除成功');
            }
        })
    },

    /**
     * 获取商品列表接口
     * 根据类型查询商品列表，并关联查询商品对应的用户信息
     * @param {object} req - 请求对象，包含查询的商品类型
     * @param {object} res - 响应对象，用于返回查询结果
     */
    getCommoditys: (req, res) => {
        sql.query(`select * from commoditys where type = ? and state = 1`, [req.query.type], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send('服务器错误');
            } else {
                if (result.length === 0) {
                    res.status(404).send('未找到商品');
                } else {
                    const userIds = result.map(item => item.userId);
                    sql.query(`select * from users where id in (?)`, [userIds], (err, userResult) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send('服务器错误');
                        } else {
                            if (userResult.length === 0) {
                                res.status(404).send('未找到用户');
                            } else {
                                result.forEach(item => {
                                    item.user = userResult.find(user => user.id === item.userId);
                                });
                                res.status(200).send(result);
                            }
                        }
                    })
                }
            }
        })
    },

    /**
     * 获取单个商品接口
     * 根据ID查询商品信息，并关联查询商品对应的用户信息
     * @param {object} req - 请求对象，包含查询的商品ID
     * @param {object} res - 响应对象，用于返回查询结果
     */
    getCommodity: (req, res) => {
        sql.query(`select * from commoditys where id = ?`, [req.query.id], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send('服务器错误');
            } else {
                if (result.length === 0) {
                    res.status(404).send('未找到商品');
                } else {
                    const userId = result[0].userId;
                    sql.query(`select * from users where id = ?`, [userId], (err, userResult) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send('服务器错误');
                        } else {
                            if (userResult.length === 0) {
                                res.status(404).send('未找到用户');
                            } else {
                                result[0].user = userResult[0];
                                res.status(200).send(result);
                            }
                        }
                    })
                }
            }
        })
    },
    /**
  * 添加订单
  * @param {Object} req 请求对象，包含订单信息
  * @param {Object} res 响应对象，用于返回结果
  */
    addOrder: (req, res) => {
        // 解析请求体中的订单信息
        const info = req.body
        // 构建地址对象
        const address = {
            address: info.address,
            phone: info.phone,
            addressName: info.addressName
        }
        // 更新用户地址信息
        sql.query(`update users set ? where id = ?`, [address, info.userId], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send('服务器错误');
            } else {
                // 插入订单信息
                sql.query(`insert into orders set ?`, { userId: info.userId, commodityId: info.commodityId, createTime, address: info.address }, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send('服务器错误');
                    } else {
                        // 将商品状态设置为已预订
                        sql.query(`update commoditys set state = 0 where id = ?`, [info.commodityId], (err, result) => {
                            if (err) {
                                console.log(err)
                                res.status(500).send('服务器错误');
                            } else {
                                res.status(200).send('下单成功');
                            }
                        })
                    }
                })
            }
        })

    },
    /**
     * 获取用户订单
     * @param {Object} req 请求对象，包含用户ID
     * @param {Object} res 响应对象，用于返回订单信息
     */
    getOrders: (req, res) => {
        const id = req.query.id;
        // 根据用户ID查询订单
        sql.query(`select * from orders where userId = ?`, [id], (err, result) => {
            if (err) {
                res.status(500).send({ error: '查询订单失败' });
            } else {
                if (result.length === 0) {
                    res.send([]);
                } else {
                    // 提取所有订单中的商品ID
                    const commodityIds = result.map(order => order.commodityId);
                    // 根据商品ID查询商品信息
                    sql.query(`select * from commoditys where id in (?)`, [commodityIds], (err, commoditys) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send({ error: '查询商品信息失败' });
                        } else {
                            // 给商品信息补充订单相关数据
                            commoditys.forEach(commodity => {
                                const order = result.find(order => order.commodityId === commodity.id);
                                commodity.createTime = order.createTime;
                                commodity.orderId = order.id;
                                commodity.OrderState = order.state;
                                commodity.address = order.address;
                            });
                            res.send(commoditys);
                        }
                    });
                }
            }
        });
    },

    /**
     * 删除订单
     * @param {Object} req 请求对象，包含订单ID和商品ID
     * @param {Object} res 响应对象，用于返回结果
     */
    deleOrder: (req, res) => {
        // 将商品状态恢复为可销售
        sql.query(`update commoditys set state = 1 where id  = ${req.query.commodityId}`, (err, result) => {
            if (err) {
                res.status(500).send('服务器错误');
            } else {
                // 删除订单
                sql.query(`delete from orders where id = ${req.query.orderId}`, (err, result) => {
                    if (err) {
                        res.status(500).send('服务器错误');
                    } else {
                        res.status(200).send('删除成功');
                    }
                })
            }
        })
    },
    /**
     * 订单支付
     * @param {Object} req 请求对象，包含订单ID
     * @param {Object} res 响应对象，用于返回结果
     */
    play: (req, res) => {
        // 将订单状态设置为已支付
        sql.query(`update orders set state = 1 where id = ${req.query.id}`, (err, result) => {
            if (err) {
                res.status(500).send('服务器错误');
            } else {
                res.status(200).send('支付成功');
            }
        })
    },
    /**
     * 用户收藏商品
     * @param {Object} req 请求对象，包含用户ID和商品ID
     * @param {Object} res 响应对象，用于返回结果
     */
    collection: (req, res) => {
        // 检查是否已收藏该商品
        sql.query(`select * from collections where userId = ${req.query.userId} and commdoityId = ${req.query.id}`, (err, result) => {
            if (err) {
                res.status(500).send('服务器错误');
            } else {
                if (result.length > 0) {
                    res.status(400).send('您已收藏此商品');
                } else {
                    // 添加收藏记录
                    sql.query(`insert into collections set ?`, { userId: req.query.userId, commdoityId: req.query.id }, (err, result) => {
                        if (err) {
                            res.status(500).send('服务器错误');
                        } else {
                            res.status(200).send('收藏成功');
                        }
                    })
                }
            }
        })
    },
    /**
  * 获取用户的收藏商品
  * @param {Object} req 请求对象，包含查询参数userId
  * @param {Object} res 响应对象，用于返回查询结果
  */
    getCollections: (req, res) => {
        const userId = req.query.userId;
        // 根据userId查询收藏表中的所有记录
        sql.query(`select * from collections where userId = ${userId}`, (err, result) => {
            if (err) {
                // 如果查询出错，返回500错误信息
                res.status(500).send('服务器错误');
            } else {
                if (result.length === 0) {
                    // 如果查询结果为空，返回空数组
                    res.send([]);
                } else {
                    // 提取所有收藏商品的id
                    const commodityIds = result.map(collection => collection.commdoityId);
                    // 根据商品id查询商品表中状态为1的商品信息
                    sql.query(`select * from commoditys where id in (?) and state = 1`, [commodityIds], (err, commoditys) => {
                        if (err) {
                            // 如果查询出错，返回500错误信息
                            res.status(500).send('服务器错误');
                        } else {
                            // 给每个商品添加收藏记录的id
                            commoditys.forEach(commodity => {
                                const collection = result.find(collection => collection.commdoityId === commodity.id);
                                commodity.collectionId = collection.id;
                            });
                            // 返回处理后的商品信息
                            res.send(commoditys);
                        }
                    })
                }
            }
        })
    },
    /**
     * 删除收藏记录
     * @param {Object} req 请求对象，包含查询参数id
     * @param {Object} res 响应对象，用于返回操作结果
     */
    deleCollection: (req, res) => {
        // 根据id删除收藏记录
        sql.query(`delete from collections where id = ${req.query.id}`, (err, result) => {
            if (err) {
                // 如果操作出错，返回500错误信息
                res.status(500).send('服务器错误');
            } else {
                // 如果操作成功，返回200成功信息
                res.status(200).send('删除成功');
            }
        })
    },
    /**
     * 添加评论
     * @param {Object} req 请求对象，包含评论信息
     * @param {Object} res 响应对象，用于返回操作结果
     */
    comments: (req, res) => {
        const info = req.body;
        info.createTime = createTime
        // 插入评论信息到comments表
        sql.query(`insert into comments set ?`, info, (err, result) => {
            if (err) {
                // 如果操作出错，返回500错误信息
                res.status(500).send('服务器错误');
            } else {
                // 如果操作成功，返回200成功信息
                res.status(200).send('评论成功');
            }
        })
    },
    /**
     * 获取商品的评论列表
     * @param {Object} req 请求对象，包含查询参数commodityId
     * @param {Object} res 响应对象，用于返回查询结果
     */
    getComments: (req, res) => {
        const commodityId = req.query.commodityId;
        // 根据commodityId查询评论信息
        sql.query(`select * from comments where commodityId = ?`, [commodityId], (err, result) => {
            if (err) {
                // 如果查询出错，返回500错误信息
                console.log(err)
                res.status(500).send('服务器错误');
            } else {
                if (result.length === 0) {
                    // 如果查询结果为空，返回空数组
                    console.log(result)
                    res.send([]);
                    return
                } else {
                    // 提取所有评论用户的id
                    const userIds = result.map(comment => comment.userId);
                    // 根据用户id查询用户信息
                    sql.query(`select * from users where id in (?)`, [userIds], (err, users) => {
                        if (err) {
                            // 如果查询出错，返回500错误信息
                            console.log(err)
                            res.status(500).send('服务器错误');
                        } else {
                            // 给每个评论添加用户信息
                            result.forEach(comment => {
                                const user = users.find(user => user.id === comment.userId);
                                comment.user = user;
                            });
                            // 提取所有评论的id和商品id
                            const commentIds = result.map(comment => comment.id);
                            const commdoityId = result.map(comment => comment.commodityId);
                            // 根据评论id查询回复信息
                            sql.query(`select * from replys where collectionId in (?)`, [commentIds], (err, replies) => {
                                if (replies.length === 0) {
                                    // 如果回复信息为空，直接返回评论信息
                                    result.replies = []
                                    res.send(result);
                                    return
                                }
                                // 根据回复用户的id查询用户信息
                                sql.query(`select * from users where id in (?)`, [replies.map(reply => reply.userId)], (err, users) => {
                                    if (err) {
                                        // 如果查询出错，返回500错误信息
                                        console.log(err)
                                        res.status(500).send('服务器错误');
                                    } else {
                                        // 给每个评论的每个回复添加用户信息
                                        result.forEach(comment => {
                                            comment.replies = replies.filter(reply => reply.collectionId === comment.id);
                                            comment.replies.forEach(reply => {
                                                reply.user = users.find(user => user.id === reply.userId);
                                            });
                                        });
                                        // 返回处理后的评论信息
                                        res.send(result);
                                    }
                                })
                            })
                        }
                    })
                }
            }
        })
    },
    /**
 * 回复功能处理函数
 * @param {object} req - 请求对象，包含回复的信息
 * @param {object} res - 响应对象，用于向客户端发送回复结果
 * 此函数用于处理回复的添加操作，将请求体中的信息插入到replys表中
 */
    reply: (req, res) => {
        const info = req.body
        info.createTime = createTime
        sql.query(`insert into replys set ?`, info, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send('服务器错误');
            } else {
                res.status(200).send('回复成功');
            }
        })
    },

    /**
     * 点赞功能处理函数
     * @param {object} req - 请求对象，包含点赞的用户信息和评论ID
     * @param {object} res - 响应对象，用于向客户端发送点赞结果
     * 此函数用于处理点赞操作，首先检查该用户是否已经点赞过该评论，
     * 如果已点赞，则发送相应信息；否则执行点赞操作，并更新评论的点赞数
     */
    love: (req, res) => {
        const info = req.body;
        const userId = info.userId;
        const id = info.id;

        sql.query(`SELECT * FROM loves WHERE userId = ${userId} AND commentId = ${id}`, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('服务器错误');
            } else {
                if (result.length > 0) {
                    res.status(400).send('您已点赞过该评论');
                } else {
                    sql.query(`SELECT * FROM comments WHERE id = ${id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('服务器错误');
                        } else {
                            sql.query(`UPDATE comments SET nike = nike + 1 WHERE id = ${id}`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('服务器错误');
                                } else {
                                    sql.query(`INSERT INTO loves SET ?`, { userId, commentId: id }, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).send('服务器错误');
                                        } else {
                                            res.status(200).send('点赞成功');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    },

    /**
     * 搜索功能处理函数
     * @param {object} req - 请求对象，包含搜索关键字
     * @param {object} res - 响应对象，用于向客户端发送搜索结果
     * 此函数用于处理商品搜索操作，根据请求中的关键字查询商品信息，
     * 如果未找到相关商品，则发送相应信息；否则发送查询结果
     */
    search: (req, res) => {
        const key = req.query.key;
        sql.query(`select * from commoditys where name=?`, [key], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('服务器错误');
            } else {
                if (result.length === 0) {
                    res.status(404).send('没有找到此商品');
                } else {
                    res.status(200).send(result);
                }
            }
        })
    },
    /**
   * 更新订单的评论信息。
   * 通过请求的body获取评论内容和状态，以及订单ID，然后更新相应订单的评论和评论状态。
   * @param {Object} req - 请求对象，包含评论信息和订单ID。
   * @param {Object} res - 响应对象，用于返回操作结果。
   */
    productReviews: (req, res) => {
        const info = req.body;
        // 使用SQL查询语句更新订单的评论和评论状态
        sql.query(`update orders set comments = '${info.comment}', commentsState = ${info.commentsState} where id = ${info.id}`, (err, result) => {
            if (err) {
                console.log(err);
                // 如果出现错误，返回500状态码和'服务器错误'信息
                res.status(500).send('服务器错误');
            } else {
                // 如果操作成功，返回200状态码和'商品评论成功'信息
                res.status(200).send('商品评论成功');
            }
        });
    },

    /**
     * 统计用户订单的评论状态分布。
     * 通过请求的query获取用户ID，然后统计该用户订单中各种评论状态的数量。
     * @param {Object} req - 请求对象，包含用户ID。
     * @param {Object} res - 响应对象，用于返回评论状态分布统计结果。
     */
    getproduct: (req, res) => {
        const { userId } = req.query;
        // 使用SQL查询语句统计用户订单的评论状态分布
        sql.query(`select commentsState, count(*) as count from orders where userId = ${userId} group by commentsState`, (err, result) => {
            if (err) {
                console.log(err)
                // 如果出现错误，返回500状态码和'服务器错误'信息
                res.status(500).send('服务器错误');
            } else {
                let goodCount = 0;
                let mediumCount = 0;
                let badCount = 0;
                // 遍历查询结果，统计每种评论状态的数量
                for (let i = 0; i < result.length; i++) {
                    if (result[i].commentsState == 1) {
                        goodCount = result[i].count
                    } else if (result[i].commentsState == 2) {
                        mediumCount = result[i].count
                    } else if (result[i].commentsState == 3) {
                        badCount = result[i].count
                    }
                }
                // 返回各种评论状态的数量统计结果
                res.status(200).send({ goodCount, mediumCount, badCount });
            }
        });
    }




}

module.exports = handle;