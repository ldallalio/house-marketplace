/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';

function Listing() {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(null);

	const navigate = useNavigate();
	const params = useParams();
	const auth = getAuth();

	useEffect(() => {
		const fetchListing = async () => {
			const updatedparams = params.listingId.replace(/[}]/g, '');
			const docRef = doc(db, 'listings', updatedparams);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists) {
				console.log(docSnap.data());
				setListing(docSnap.data());
				setLoading(false);
			}
		};
		fetchListing();
	}, [navigate, params.listingId]);

	if (loading) {
		return <Spinner />;
	}
	return (
		<main>
			{/* slider */}
			<div
				className='shareIconDiv'
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLinkCopied(true);
					setTimeout(() => {
						setShareLinkCopied(false);
					}, 2000);
				}}>
				<img src={shareIcon} alt='share icon' className='shareIcon' />
			</div>
			{shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
			<div className='listingDetails'>
				<p className='listingName'>
					{listing.name} - $
					{listing.offer ? listing.discountedPrice : listing.regularPrice}
				</p>
				<p className='listingLocation'>{listing.location}</p>
				<p className='listingType'>
					For {listing.type === 'rent' ? 'Rent' : 'Sale'}
				</p>
				{listing.offer && (
					<p className='discountPrice'>
						${listing.regularPrice - listing.discountedPrice} Discount
					</p>
				)}
				<ul className='listingDetailsList'>
					<li>
						{listing.bedrooms > 1
							? `${listing.bedrooms} Bedrooms`
							: `${listing.bedrooms} Bedroom`}
					</li>
					<li>
						{listing.bathrooms > 1
							? `${listing.bathrooms} Bathrooms`
							: `${listing.bathrooms} Bathroom`}
					</li>
					<li>{listing.parking && 'Parking Spot'}</li>
					<li>{listing.furnished && 'Furnished'}</li>
				</ul>
				<p className='listingLocationTitle'>Location</p>
				{/* Map */}

				{auth.currentUser?.uid !== listing.userRef && (
					<Link
						to={`/contact/${listing.userRef}?listingName=${listing.name} & listingLocation=${listing.location}`}
						className='primaryButton'>
						Contact Owner
					</Link>
				)}
			</div>
		</main>
	);
}

export default Listing;
