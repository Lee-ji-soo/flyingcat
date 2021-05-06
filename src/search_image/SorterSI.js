import React from "react";
import { Grid } from "@material-ui/core";
import styled from "styled-components";

const SorterSI = ({
  sortType,
  handleSortType
}) => {
  return (
    <SortGrid container xs={12} item justify="flex-end" alignItems="center">
      <div>
        <select
          id="search_image_sorter"
          value={sortType}
          onChange={e=>{handleSortType(e.target.value)}}
        >
          <option value="recomm">추천순</option>
          <option value="orderCnt">주문순</option>
          <option value="lowPrice">낮은가격순</option>
          <option value="highPrice">높은가격순</option>
        </select>
      </div>
    </SortGrid>
  )
}

export default SorterSI;

const SortGrid = styled(Grid)`
  height: 42px;
  padding-right: 10px;
  border-bottom: 1px solid #f1f1f1;
  background-color: white;
  #search_image_sorter {
    border: 0;
    background-color: transparent;
    font-size: 16px;
    text-align-last: right;
  }
`