import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const ProfilePage = () => {
	const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
	const [userData, setUserData] = useState(null);
	const [loadingUserData, setLoadingUserData] = useState(true);

	useEffect(() => {
		//  fetchUserData fetches user data from the backend, not Auth0, using the user's email as a key. 
		const fetchUserData = async () => {
			if (isAuthenticated && user) {
				try {
					const token = await getAccessTokenSilently();
					const response = await axios.get('http://localhost:8000/api/user', {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					setUserData(response.data);
				} catch (error) {
					console.error('Error fetching user data from backend:', error);
				} finally {
					setLoadingUserData(false);
				}
			}
		};

		fetchUserData();
	}, [isAuthenticated, user, getAccessTokenSilently]);

	if (isLoading || loadingUserData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="profile-page">
			<h1 className="center-title">Profile Page</h1>
			{user && (
				<div>
					<img src={userData.picture} alt={userData.name} />
					<h2>{userData.name}</h2>
					<p>Email: {userData.email}</p>
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
