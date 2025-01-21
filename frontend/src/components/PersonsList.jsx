import React from "react";

const PersonsList = ({ persons, deletePerson }) => {
    return (
        <div>
            <ul>
                {persons.map(person =>
                    <li key={person.id}>
                        {person.name} {person.number}
                        <button
                            className="button"
                            onClick={() => deletePerson(person.id)}>
                            delete
                        </button>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default PersonsList