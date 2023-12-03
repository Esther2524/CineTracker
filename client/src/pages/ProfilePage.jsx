import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import TextDisplay from '../components/TextDisplay'; // Adjust this import path as necessary

const ProfilePage = () => {
	const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
	const [userData, setUserData] = useState(null);
	const [loadingUserData, setLoadingUserData] = useState(true);
	const [movieCollection, setMovieCollection] = useState([]);
	const [editPopupVisible, setEditPopupVisible] = useState(false);
	const [newName, setNewName] = useState('');

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

					// get movie info from backend and sort by updatedAt
					const collectionResponse = await axios.get('http://localhost:8000/api/user/collection', {
						headers: { Authorization: `Bearer ${token}` }
					});

					// sort movie collection by updatedAt
					const sortedCollection = collectionResponse.data.sort((a, b) => {
						return new Date(b.updatedAt) - new Date(a.updatedAt);
					});
					setMovieCollection(sortedCollection);

				} catch (error) {
					console.error('Error fetching data:', error);
				} finally {
					setLoadingUserData(false);
				}
			}
		};

		fetchUserData();
	}, [isAuthenticated, user, getAccessTokenSilently]);

	const handleSaveNewName = async () => {
		try {
			const token = await getAccessTokenSilently();
			await axios.put('http://localhost:8000/api/user', { newName }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setUserData({ ...userData, name: newName });
			setEditPopupVisible(false);
		} catch (error) {
			console.error('Error updating name:', error);
		}
	};

	function formatDate(timestamp) {
		const date = new Date(timestamp);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	if (isLoading || loadingUserData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="profile-page">
			<h1 className="center-title">Profile Page</h1>
			{user && (
				<div className="profile-user-info-container">
					<img src={userData.picture} alt={userData.name} className='profile-image' />
					<div className="profile-user-details">
						<h2>{userData.name}</h2>
						<p>Email: {userData.email}</p>
						<button onClick={() => setEditPopupVisible(true)} className='profile-edit-button'>
							Edit
						</button>
					</div>

					{editPopupVisible && (
						<div className="profile-popup-overlay">
							<div className="profile-popup-content">
								<input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
								<button onClick={handleSaveNewName}>Save</button>
								<button onClick={() => setEditPopupVisible(false)}>Cancel</button>
							</div>
						</div>
					)}
				</div>
			)}


			<div className='profile-text-display-section'>
				<h3 className='profile-hint'>You have rated and reviewed...</h3>
				{movieCollection.length > 0 ? (
					movieCollection.map((movie) => (
						<TextDisplay key={movie.apiId} movie={movie} formatDate={formatDate} />
					))
				) : (
					<p className='profile-no-movie-hints'>Oops, no movies...</p>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
