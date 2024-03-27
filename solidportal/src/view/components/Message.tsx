import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import 'katex/dist/katex.min.css';
import 'highlight.js/styles/monokai-sublime.css';
import React, { ReactElement } from "react";
import "./stChat.css";

function Message(props: React.PropsWithChildren<{ is_table: boolean, message: string, allow_html: boolean }>): ReactElement {
    // Init React Markdown plugins
    const remarkPlugins = [
        remarkMath,
        remarkGfm
    ];
    const rehypePlugins = [
        rehypeKatex,
        ...(props.allow_html ? [rehypeRaw] : [])
    ];

    let classList = ["msg"];

    if (props.is_table){
        classList.push("msg-table");
    }
        

    return (
        <div className={classList.join(' ')} >
            <ReactMarkdown
                remarkPlugins={remarkPlugins}
                rehypePlugins={[...rehypePlugins, [rehypeHighlight, { detect: true }]]}
            >
                {props.message}
            </ReactMarkdown>
        </div>
    );
}

export default Message;
