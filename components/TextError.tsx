import React from "react";

function TextError(props: { children: React.ReactNode }) {
  return <div className="error-message">{props.children}</div>;
}

export default TextError;
