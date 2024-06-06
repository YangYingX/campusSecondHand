const express = require('express')
const router = express.Router()
const handleUser = require('../handle/handleUser')
const handleCommodity = require('../handle/handleCommodity')
const multer = require('multer');
const upload = multer({dest: 'upload'})

router.post('/user/register',handleUser.register)
router.post('/user/login',handleUser.login)
router.post('/user/checkToken',handleUser.checkToken)
router.post('/user/uploadShot',handleUser.uploadShot) 
router.get('/user/getUserInfo',handleUser.getUserInfo)
router.get('/user/concern',handleUser.concern)
router.get('/user/getIsConcern',handleUser.getIsConcern)
router.get('/user/getFollowersNum',handleUser.getFollowersNum)
router.get('/user/getFollowersInfo',handleUser.getFollowersInfo)
router.get('/user/cancelConcern',handleUser.cancelConcern)
router.post('/user/changeUserInfo',handleUser.changeUserInfo)
router.post('/user/changeUseBj',upload.single('file'),handleUser.changeUseBj)
router.post('/user/uploadAddress',handleUser.uploadAddress)
router.post('/commodity/addCommodity',upload.single('file'),handleCommodity.addCommodity)
router.get('/commodity/getUserCommoditys',handleCommodity.getUserCommoditys)
router.get('/commodity/deleteCommodity',handleCommodity.deleteCommodity)
router.get('/commodity/getCommoditys',handleCommodity.getCommoditys)
router.get('/commodity/getCommodity',handleCommodity.getCommodity)
router.post('/commodity/addOrder',handleCommodity.addOrder)
router.get('/commodity/getOrders',handleCommodity.getOrders)
router.get('/commodity/deleOrder',handleCommodity.deleOrder)
router.get('/commodity/play',handleCommodity.play)
router.get('/commodity/collection',handleCommodity.collection)
router.get('/commodity/getCollections',handleCommodity.getCollections)
router.get('/commodity/deleCollection',handleCommodity.deleCollection)
router.post('/commodity/comments',handleCommodity.comments)
router.get('/commodity/getComments',handleCommodity.getComments)
router.post('/commodity/reply',handleCommodity.reply)
router.post('/commodity/love',handleCommodity.love)
router.post('/commodity/productReviews',handleCommodity.productReviews)
router.get('/commodity/getproduct',handleCommodity.getproduct)
router.get('/commodity/search',handleCommodity.search)
module.exports = router
