// eslint-disable-next-line react/prop-types
const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={`notification ${type}`}>
            {message}
        </div>  
    )
}

export default Notification