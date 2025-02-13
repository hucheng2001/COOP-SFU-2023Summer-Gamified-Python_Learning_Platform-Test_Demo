import React from "react";
import Item from "./Item";

export default function List({ data, isHeader }) {
  if (!Array.isArray(data))return <></>;
  return (
    <ul className="layout-list-wrapper">
      {data?.map((row, index) => (
        <Item row={row} key={row.userID} index={index} isHeader={isHeader} />
      ))}
    </ul>
  );
}
