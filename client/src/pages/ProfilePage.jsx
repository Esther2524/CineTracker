import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ProfilePage = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // // actually I handle it in Navbar
    // if (!isAuthenticated) {
    //     return <div>Please log in to view your profile.</div>;
    // }

    return (
        <div className="profile-page">
            <h1 className="center-title">Profile Page</h1>
            {user && (
                <div>
                    <img src={user.picture} alt={user.name} />
                    <h2>{user.name}</h2>
                    <p>Email: {user.email}</p>
                    {/* Display other user details here */}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
