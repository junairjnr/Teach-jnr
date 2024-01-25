import React from "react"

function RequiredError(props: { children: React.ReactNode }) {
    return <div className="error-required">{props.children}</div>;
  }
  
  export default RequiredError;
  