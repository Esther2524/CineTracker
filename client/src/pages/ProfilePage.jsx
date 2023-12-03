import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const ProfilePage = () => {
	const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
	const [userData, setUserData] = useState(null);
	const [loadingUserData, setLoadingUserData] = useState(true);
	const [movieCollection, setMovieCollection] = useState([]);

	useEffect(() => {
		const fetchUserData = async () => {
			if (isAuthenticated && user) {
				try {
					const token = await getAccessTokenSilently();
					// get user info from backend
					const userResponse = await axios.get('http://localhost:8000/api/user', {
						headers: { Authorization: `Bearer ${token}` }
					});
					setUserData(userResponse.data);

					// get movie info from backend
					const collectionResponse = await axios.get('http://localhost:8000/api/user/collection', {
						headers: { Authorization: `Bearer ${token}` }
					});
					// console.log(collectionResponse.data)
					setMovieCollection(collectionResponse.data);

				} catch (error) {
					console.error('Error fetching data:', error);
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

					<h3>{user.name}'s Movie Collection</h3>
					{movieCollection.length > 0 ? (
						<ul>
							{movieCollection.map((movie) => (
								<li key={movie.id}> {/* Use unique movie id */}
									<div className="details-movie-poster">
										<img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} alt={movie.title} />
									</div>
									{movie.title}
								</li>
							))}
						</ul>
					) : (
						<p>No movies in your collection.</p>
					)}
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
