
const LayoutHeader = ({ usersInformationStatus, loggedInUserInformation, logout }) => {
    const name = sessionStorage.getItem('name')
    return (
        <>
            <h1>Chat Page</h1>
            <h2>Hello {sessionStorage.getItem('name')}</h2>
            {usersInformationStatus === 'loading' && <p>Loading...</p>}
            {usersInformationStatus === 'succeeded' && (
                <div>
                    <label>Name: {loggedInUserInformation.name}, Email: {loggedInUserInformation.email} </label><br />
                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </>
    )
}

export default LayoutHeader