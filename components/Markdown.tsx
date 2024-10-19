import React from "react";
import markdowunit from "markdown-it";
import DOMPurify from "dompurify";
const md = new markdowunit();

type Props = {
  content: string;
};

const Markdown = ({ content }: Props) => {
  const htmlcontent = md.render(content);
  const sanitized = DOMPurify.sanitize(htmlcontent);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }}></div>;
};

export default Markdown;
