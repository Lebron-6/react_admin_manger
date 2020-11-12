import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import { reqDeleteImg } from "../../api"
import PropTypes from "prop-types"
import { BASE_IMG_URL } from '../../utils/constants'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

class PicturesWall extends Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    constructor(props) {
        super(props)

        let fileList = []

        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: "done",
                url: BASE_IMG_URL + img

            }))
        }

        this.state = {
            // 初始化状态
            previewVisible: false,
            previewImage: '',
            fileList
        }
    }

    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        })
    }

    handleChange = async ({ file, fileList }) => {
        // file:当前操作的图片文件(上传/删除)

        // 当图片上传成功,将当前上传的file信息修正(name,url)
        if (file.status === "done") {
            const result = file.response
            if (result.status === 0) {
                message.success("图片上传成功!")
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error("图片上传失败!")
            }
        } else if (file.status === "removed") {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success("图片删除成功!")
            } else {
                message.error("图片删除失败!")
            }
        }

        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        )
        return (
            <div>
                <Upload
                    action="/manage/img/upload"
                    accept="image/*"
                    // 只接受图片格式
                    name="image"
                    // 发送到后台的文件参数名
                    listType="picture-card"
                    fileList={fileList}
                    // 已上传图片文件对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

export default PicturesWall