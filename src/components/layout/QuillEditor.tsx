import {useRef, useState, useMemo, useEffect} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import hljs from 'highlight.js'
import 'highlight.js/styles/stackoverflow-dark.css'
import "highlight.js/styles/atom-one-dark.css";
import axios from 'axios';
import "../style/Board.css";


interface QuillProps  {
    onAddQuill: (content:string) => void
    content: string
}

// Undo and redo functions for Custom Toolbar
function undoChange() {

}

function redoChange() {

}


// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida"
];
Quill.register(Font, true);

hljs.configure({
    languages: ['javascript', 'ruby', 'python', 'rust', 'java'],
})

const EditorToolbar = (props : QuillProps) => {
    const QuillRef = useRef<ReactQuill>();
    const [content, setContent] = useState<string>("");
    const feUrl = process.env.REACT_APP_FRONT_URL;

    useEffect(() => {
        setContent(props.content);
    }, [props.content])
    
    // 이미지를 업로드 하기 위한 함수
    const imageHandler = () => {

        const input = document.createElement("input");
        input.setAttribute('type','file');
        input.setAttribute('multiple','multiple');
        const formData = new FormData();
        const fileList : File[] = [];

        input.setAttribute('accept','image/*');
        input.click();

        input.onchange = async () => {
            const files: FileList | null = input.files;
            const fileArray = Array.prototype.slice.call(files);

            //test용(이미지 이름 설정)
            const min = 1; // 최소값
            const max = 1000; // 최대값
            const randomInt = Math.floor(Math.random() * (max - min + 1)) + min; // min 이상 max 이하의 정수 난수 생성

            fileArray.forEach((file) => {
                fileList.push(file);
            })
            fileList.forEach((file) => {
                formData.append('file', file);
            })
            formData.append("nameFile",randomInt.toString())
                axios({
                    method: "post",
                    url: "/api/files",
                    headers: {"Content-Type": "multipart/form-data"},
                    data: formData,
                }).then((response)=>{
                    console.log("###", response);
                    const url = `${feUrl}`+response.data;
                    const range = QuillRef.current?.getEditor().getSelection()?.index;
                    if (range !== null && range !== undefined) {
                        let quill = QuillRef.current?.getEditor();
                        quill?.setSelection(range, 1);
                        quill?.clipboard.dangerouslyPasteHTML(
                            range,
                            `<img src=${url} alt="이미지 태그 삽입" />`
                        );
                    }
                }).catch((err)=>{
                    console.log(err);
                })
        }
    }

    const modules = useMemo(() => ({
            syntax: {
                highlight: (text: string) => hljs.highlightAuto(text).value,
            },
            toolbar: {
                syntax: true,
                container: [
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                        { align: [] },
                    ],
                    ["image", "video"],
                    ['code-block'],
                    
                ],
                handlers: {
                    undo: undoChange,
                    redo: redoChange,
                    image: imageHandler,
                },
            },
            history: {
                delay: 500,
                maxStack: 100,
                userOnly: true
            }
        }),
        []
    );

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "align",
        "strike",
        "script",
        "blockquote",
        "background",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "code-block"
    ];

    return (
        <>  
            <ReactQuill
                ref={(element) => {
                    if (element !== null) {
                        QuillRef.current = element;
                    }
                }}
                value={props.content}
                onChange={(content) => {
                    setContent(content);
                    props.onAddQuill(content);
                }}
                formats={formats}
                modules={modules}
                theme="snow"
                placeholder="내용을 입력해주세요."
            />
        </>
    )
}

export default EditorToolbar;