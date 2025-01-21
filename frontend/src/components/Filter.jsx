import React from "react";

const Filter = ({ filterPerson, handleFilterPerson }) => { 
    return (
        <div>
        filter shown with <input value={filterPerson} onChange={handleFilterPerson} />
        </div>
    );
}

export default Filter;