/*
用来指定商品详情的富文本编辑器组件
 */

import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import PropTypes from "prop-types"
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

class RichTextEditor extends Component {
    // state = {
    //     editorState: EditorState.createEmpty(),
    // }

    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props)
        // const html = '<p>Hey this <strong>editor</strong> rocks 😀 </p>'
        const html = this.props.detail
        if (html) {
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState,
                }
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty()
            }
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }

    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        // 返回输入数据对应的HTML格式的文本
    }


    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', "/manage/img/upload");
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    const url = response.data.url
                    resolve({ data: { link: url } });
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    render() {
        const { editorState } = this.state
        return (
            <Editor
                editorState={editorState}
                // wrapperClassName="demo-wrapper"
                // editorClassName="demo-editor"
                editorStyle={{ border: "1px solid pink", minHeight: 200, padding: 17 }}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
            // {/* <textarea
            //     disabled
            //     value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            // /> */}
        )
    }
}

export default RichTextEditor

