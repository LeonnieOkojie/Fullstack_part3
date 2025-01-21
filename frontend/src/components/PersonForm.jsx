import React from "react";

const PersonForm = ({newName, phoneNumber, handleNewName, handleNumber, addName }) => {
    return (
        <form onSubmit={addName}>
            <div>
                name: <input value={newName} onChange={handleNewName} />
            </div>
            <div>
                number: <input value={phoneNumber} onChange={handleNumber}/>
            </div>
            <div>
                <button className="button" type="submit">Add</button>
            </div>
        </form>
    )
}

export default PersonForm