import { useState } from "react";
import Pagination from 'react-bootstrap/Pagination';

function PaginationComp({ total_pages, go_to_page}) {
    const [active, setActive] = useState(1);
    let items = [];
    for (let number = 1; number <= total_pages; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active} onClick={ () => {jump_to_page(number)} }>
            {number}
            </Pagination.Item>,
        );
    }

    const jump_to_page = ( page ) => {
      setActive(page);
      go_to_page(page);
    }
  return (
    <div >
      <Pagination>
        <Pagination.First onClick={ () => {jump_to_page(1)} } />
        <Pagination.Prev disabled={ active == 1 } onClick={ () => {jump_to_page(active - 1)} }/>
        {
          items
        }
        <Pagination.Next disabled={ active == total_pages } onClick={ () => {jump_to_page(active + 1)} }/>
        <Pagination.Last onClick={ () => {jump_to_page(total_pages)} } />
      </Pagination>
    </div>
  );
}

export default PaginationComp;