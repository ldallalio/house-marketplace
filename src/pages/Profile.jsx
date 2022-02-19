import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Profile() {
	const auth = getAuth();

	const [changeDetails, setChangeDetails] = useState(false);

	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});

	const { name, email } = formData;

	const navigate = useNavigate();

	const onLogout = () => {
		auth.signOut();
		navigate('/');
	};

	const onSubmit = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				//Update display name in fb
				await updateProfile(auth.currentUser, {
					displayName: name,
				});

				//Update Firestore
				const useRef = doc(db, 'users', auth.currentUser.uid);
				await updateDoc(useRef, {
					name,
				});
			}
		} catch (error) {
			toast.error('Could not update profile');
		}
	};

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	return (
		<div className='profile'>
			<header className='profileHeader'>
				<p className='pageHeader'>My Profile</p>
				<button type='button' className='logOut' onClick={onLogout}>
					LogOut
				</button>
			</header>
			<main>
				<div className='profileDetailsHeader'>
					<p className='profileDetailsText'>Personal Details</p>
					<p
						className='changePersonalDetails'
						onClick={() => {
							changeDetails && onSubmit();
							setChangeDetails((prevState) => !prevState);
						}}>
						{changeDetails ? 'done' : 'change'}
					</p>
				</div>
				<div className='profileCard'>
					<form>
						<label htmlFor='name'> Name</label>
						<input
							type='text'
							name='name'
							id='name'
							value={name}
							className={!changeDetails ? 'profileName' : 'profileNameActive'}
							disabled={!changeDetails}
							onChange={onChange}
						/>
						<label htmlFor='email'>Email</label>
						<input
							type='text'
							name='email'
							id='email'
							value={email}
							className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
							disabled={!changeDetails}
							onChange={onChange}
						/>
					</form>
				</div>
			</main>
		</div>
	);
}

export default Profile;
