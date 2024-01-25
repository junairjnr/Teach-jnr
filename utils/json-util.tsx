"use client"

function parse<T>(obj: null | undefined | string) {
    return JSON.parse(obj || "{}");
  }
  export default parse;
  