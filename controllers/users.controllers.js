const { User, Role, sequelize, Order, Order_Details , Status} = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const register = async (req, res) => {
    const { fullname, email, phone, address, password } = req.body

    const user = await User.findOne({
        where: {
            email
        }
    })
    if (user) {
        res.status(404).send({ error: "Email Đã Tồn Tại" })
    } else {
        const salt = bcrypt.genSaltSync(3);
        const hashPassword = bcrypt.hashSync(password, salt)
        const newUser = await User.create({ fullname, email, phone, address, password: hashPassword, role_id : 2 })
        res.status(201).send(newUser)
    }
}
const registerAdmin = async (req, res) => {
    const { fullname, email, phone, address, password, role_id } = req.body

    const user = await User.findOne({
        where: {
            email
        }
    })
    if (user) {
        res.status(404).send({ error: "Email Đã Tồn Tại" })
    } else {
        const salt = bcrypt.genSaltSync(3);
        const hashPassword = bcrypt.hashSync(password, salt)
        const newUser = await User.create({ fullname, email, phone, address, password: hashPassword, role_id : 1 })
        res.status(201).send(newUser)
    }
}
const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({
        where: {
            email,
        }
    })
    if (user) {
        const isAuth = bcrypt.compareSync(password, user.password);
        if (isAuth) {
            const asscess_Token = jwt.sign({ id: user.id, email: user.email, fullname: user.fullname, phone: user.phone, address: user.address, role: user.role_id }, "nhom01")
            res.status(200).send({ id: user.id, email: user.email, fullname: user.fullname, phone: user.phone, address: user.address, role: user.role_id, asscess_Token })

        } else {
            res.status(500).send("Tài Khoản Hoặc Mật Khẩu Không Đúng")
        }
    } else {
        res.status(404).send("Tài Khoản Hoặc Mật Khẩu Không Đúng")
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    await User.destroy({
        where: {
            id
        }
    })
    res.status(201).send("Xóa Thành Công")
}

const updateUser = async (req, res) => {
    const { id } = req.params
    const { fullname, phone, address, email, role_id } = req.body
    const userUpdate = await User.findOne({
        where: {
            id
        }
    })
    userUpdate.fullname = fullname
    userUpdate.phone = phone
    userUpdate.address = address
    userUpdate.email = email
    userUpdate.role_id = role_id
    await userUpdate.save()
    res.status(200).send(userUpdate)
}
const upadtePassword = async (req, res) => {
    const { id } = req.params
    const { passwordOLD, password } = req.body
    const PasswordUpdate = await User.findOne({
        where: {
            id,
        }
    })
    const isAuth = bcrypt.compareSync(passwordOLD, PasswordUpdate.password);
    if (isAuth) {
        const saltUpdate = bcrypt.genSaltSync(11);
        const hashPasswordUpdate = bcrypt.hashSync(password, saltUpdate)
        PasswordUpdate.password = hashPasswordUpdate;
        await PasswordUpdate.save()
        res.status(200).send(PasswordUpdate)
    } else {
        res.status(400).send({ flag: false })
    }

}


const getAllUsers = async (req, res) => {
    const { fullname } = req.query
    if (fullname) {
        const UserList = await User.findAll({
            where: {
                name: {
                    [Op.like]: `${fullname}`,
                }
            }
        })
        res.status(200).send(UserList)
    } else {
        const UserList = await User.findAll({
            include: [
                {
                    model: Role,
                },
                {
                    model : Order
                }
            ]
        })
        res.status(200).send(UserList)
    }
}

const findOneUser = async (req, res) => {
    const { id } = req.params
    const findUseOne = await User.findOne({
        where: {
            id,
        },
        include: [
            {
                model: Role,
            },
            {
                model : Order
            }
        ]
    })
    res.status(200).send(findUseOne)
}
const getAllOrder = async (req, res) => {
    const [resuilt] = await sequelize.query(
        `
        SELECT Users.fullname, Users.phone,Orders.address, Orders.fullname,Orders.phone, Orders.note, Orders.status , Order_Details.price, Order_Details.number, Products.price, Products.title FROM Users
        inner join Orders on Users.id = Orders.user_ID
        inner join Order_Details on Order_Details.order_ID = orders.id
        inner join  Products on Products.id = Order_Details.product_ID
        `
    )
    res.status(200).send(resuilt)
}
const getOrderinUser = async (req,res) => {
    const {id} = req.params
    const order = await Order.findAll({
        where : {
            user_ID : id
        }
    })
    const arrOrder = []
    for(let i = 0; i < order.length; i++) {
        arrOrder.push(order[i].id)
    }
    const arrOrderDetails = []
    for(let i = 0; i < arrOrder.length ; i ++) {
        const orderDtail = await Order_Details.findOne({
            where : {
                order_ID : arrOrder[i]
            },
            include : [
                {
                    model : Order,
                    include : [
                        {
                            model : Status
                        }
                    ]
                }
            ]
        })
        arrOrderDetails.push(orderDtail)
    }

    res.status(200).send(arrOrderDetails)
}
module.exports = {
    register,
    login,
    deleteUser,
    getAllUsers,
    findOneUser,
    upadtePassword,
    updateUser,
    getAllOrder,
    getOrderinUser,
    registerAdmin
}